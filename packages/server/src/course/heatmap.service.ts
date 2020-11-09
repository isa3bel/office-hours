import { ClosedQuestionStatus, Heatmap, timeDiffInMins } from '@koh/common';
import { Injectable } from '@nestjs/common';
import { mean, sample } from 'lodash';
import moment = require('moment');
import { Command } from 'nestjs-command';
import { QuestionModel } from 'question/question.entity';
import { OfficeHourModel } from './office-hour.entity';

function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

@Injectable()
export class HeatmapService {
  async getHeatmapFor(courseId: number): Promise<Heatmap> {
    // The number of minutes to average across
    const BUCKET_SIZE_IN_MINS = 15;
    // Number of samples to gather per bucket
    const SAMPLES_PER_BUCKET = 3;
    console.time('heatmap');
    const questions = await QuestionModel.createQueryBuilder('question')
      .leftJoinAndSelect('question.queue', 'queue')
      .where('queue.courseId = :courseId', { courseId })
      .andWhere('question.status = :status', {
        status: ClosedQuestionStatus.Resolved,
      })
      .andWhere('question.helpedAt IS NOT NULL')
      .andWhere('question.createdAt > :recent', {
        recent: moment().subtract(8, 'weeks').toISOString(),
      })
      .orderBy('question.createdAt', 'ASC')
      .getMany();

    const heatmap = this._generateHeatMapWithReplay(
      // Ignore questions that cross midnight (usually a fluke)
      questions.filter((q) => q.helpedAt.getDate() === q.createdAt.getDate()),
      [], //TODO: query for office hours
      'America/New_York',
      BUCKET_SIZE_IN_MINS,
      SAMPLES_PER_BUCKET,
    );
    console.timeEnd('heatmap');
    return heatmap;
  }

  // PRIVATE function that is public for testing purposes
  // Rewind through the last few weeks and for each time interval,
  // figure out how long wait time would have been if you had joined the queue at that time
  // Timezone should be IANA
  _generateHeatMapWithReplay(
    questions: QuestionModel[],
    hours: OfficeHourModel[],
    timezone: string,
    bucketSize: number,
    samplesPerBucket: number,
  ): Heatmap {
    const sampleInterval = bucketSize / samplesPerBucket;
    /*
    TEST: Question1 is  3:05 - 3:25
    // The next question is 3:21 - 3:49
    THe following question is 4:05 - 4:10
    
    Bucket = 60, Samples = 3, so timepoints are: 3:00, 3:20, 3:40.

    3:20 sample gets waittime of 5 minutes
    3:40 samples get waittimes of 9 minutes
    4:00 sample gets waittime of 0 minutes


    If i entered the queue at that time when should I have gotten help?
    Every interval of minutes for the past 5 weeks are aggregated (by taking the avg)
    
    analyze the buckets to find the closest time approximation

    look at question Q1 and the next question Q2
    for all sample timepoints between Q1.createdAt and Q2.createdAt:
       - sample = Q1.closedAt - timepoint (if negative, then it's 0)
    */

    if (!questions.length) {
      return [...Array((24 * 7 * 60) / bucketSize)].map(() => -1);
    }

    const hourTimestamps: [number, number][] = hours.map((hours) => [
      hours.startTime.getTime(),
      hours.endTime.getTime(),
    ]);

    const startDate = questions[0].createdAt;
    const sunday = moment.tz(startDate, timezone).startOf('week').toDate();

    function getNextTimepointIndex(date: Date): number {
      return Math.floor(timeDiffInMins(date, sunday) / sampleInterval) + 1;
    }

    // Get the date of the sample timepoint immediately after the given date
    function getNextSampleTimepoint(date: Date): Date {
      const timepointIndex = getNextTimepointIndex(date);
      return new Date(
        sunday.getTime() + timepointIndex * sampleInterval * 60 * 1000,
      );
    }

    // Get all timepoints between the two dates
    function getSampleTimepointsInDateRange(date1: Date, date2: Date): Date[] {
      const ret = [];
      let curr = getNextSampleTimepoint(date1);
      while (curr.getTime() < date2.getTime()) {
        ret.push(curr);
        curr = getNextSampleTimepoint(curr);
      }
      return ret;
    }

    const allTimepointWaitTimes: number[] = [];

    const timepointBuckets: number[][] = [
      ...Array((24 * 7 * 60) / bucketSize),
    ].map(() => []);

    // go two questions at a time
    let isFirst = true;
    for (let i = 0; i < questions.length; i++) {
      const curr = questions[i];
      const next = questions[i + 1];
      const isLast = i === questions.length - 1;

      // get the timepoints in between
      const sampledTimepoints = getSampleTimepointsInDateRange(
        curr.createdAt,
        isLast ? curr.helpedAt : next.createdAt,
      ).filter((time) =>
        hourTimestamps.some(
          ([start, end]) => start <= time.getTime() && time.getTime() < end,
        ),
      );

      if (sampledTimepoints.length > 0 && isFirst) {
        isFirst = false;
        const timeDiff = timeDiffInMins(sampledTimepoints[0], sunday);
        const intervals = Math.ceil((timeDiff % bucketSize) / sampleInterval);
        const bucketIndex = Math.floor(timeDiff / bucketSize);
        for (let i = 0; i < intervals; i++) {
          timepointBuckets[bucketIndex].push(0);
        }
      }
      // When we would have hypothetically gotten help at this timepoint
      for (const c of sampledTimepoints) {
        const wait = Math.max(
          0,
          (curr.helpedAt.getTime() - c.getTime()) / 60000,
        );
        // parse in zone to handle daylight savings by getting day/hour/minute within that IANA zone
        const cInZone = moment.tz(c, timezone);

        const bucketIndex = Math.floor(
          (cInZone.day() * 24 * 60 + cInZone.hour() * 60 + cInZone.minute()) /
            bucketSize,
        );
        timepointBuckets[bucketIndex].push(wait);
      }
    }

    const h: Heatmap = timepointBuckets.map((samples) =>
      samples.length > 0 ? mean(samples) : -1,
    );
    arrayRotate(
      h,
      -moment.tz
        .zone(timezone)
        .utcOffset(questions[questions.length - 1].helpedAt.getTime()) / 60,
    );
    return h;

    // rotate to UTC

    // Bucket the timepoints
    const SAMPLES_PER_HOUR = 60 / sampleInterval;
    const SAMPLES_PER_DAY = 24 * SAMPLES_PER_HOUR;
    const SAMPLES_PER_WEEK = 7 * SAMPLES_PER_DAY;
    const heatmap = [...Array(7 * 24)];
    // for 24 hrs 7 days
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const times = [];
        // Iterate through each week
        let week = 0;
        // index in alltimepoints array
        let index =
          week * SAMPLES_PER_WEEK +
          day * SAMPLES_PER_DAY +
          SAMPLES_PER_HOUR * hour;
        while (index < allTimepointWaitTimes.length) {
          for (
            let s = 0;
            s < sampleInterval && index + s < allTimepointWaitTimes.length;
            s++
          ) {
            // Grab all the samples in this bucket from current week
            const t = allTimepointWaitTimes[index + s];
            if (t) {
              times.push(t);
            }
          }
          week++;
          index =
            week * SAMPLES_PER_WEEK +
            day * SAMPLES_PER_DAY +
            SAMPLES_PER_HOUR * hour;
        }
        // times.sort();
        // const median = times[Math.floor(times.length / 2)];
        heatmap[day * 7 + hour] = mean(times);
      }
    }

    return heatmap;
  }

  @Command({
    command: 'heatmap:generate',
    describe: 'generate heatmap for a course',
    autoExit: true,
  })
  async create(): Promise<void> {
    const h = await this.getHeatmapFor(4);
  }
}
