import { API } from "@template/api-client";
import Head from "next/head";
import { QueuePartial, Role } from "@template/common";
import { Col, Result, Row } from "antd";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import styled from "styled-components";
import { mutate } from "swr";
import NavBar from "../../../components/Nav/NavBar";
import OpenQueueCard, {
  OpenQueueCardSkeleton,
} from "../../../components/Today/OpenQueueCard";
import TACheckinButton from "../../../components/Today/TACheckinButton";
import WelcomeStudents from "../../../components/Today/WelcomeStudents";
import { useRoleInCourse } from "../../../hooks/useRoleInCourse";
import { useCourse } from "../../../hooks/useCourse";
import SchedulePanel from "../../../components/Schedule/SchedulePanel";

const Container = styled.div`
  margin: 32px 64px;
  @media (max-width: 768px) {
    margin: 32px 24px;
  }
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 30px;
  color: #212934;
`;

export default function Today(): ReactElement {
  const router = useRouter();
  const { cid } = router.query;
  const role = useRoleInCourse(Number(cid));

  const { course, courseError } = useCourse(Number(cid));

  const updateQueueNotes = async (
    queue: QueuePartial,
    notes: string
  ): Promise<void> => {
    const newQueues =
      course &&
      course.queues.map((q) => (q.id === queue.id ? { ...q, notes } : q));

    mutate(`api/v1/courses/${cid}`, { ...course, queues: newQueues }, false);
    await API.queues.update(queue.id, {
      notes,
      allowQuestions: queue.allowQuestions,
    });
    mutate(`api/v1/courses/${cid}`);
  };

  if (courseError) {
    return (
      <Result
        status="500"
        title="Something went wrong, please ask chinese man"
      />
    );
  }
  return (
    <div>
      <Head>
        <title>{course?.name} | Khoury Office Hours</title>
      </Head>
      <WelcomeStudents />
      <NavBar courseId={Number(cid)} />
      <Container>
        <Row gutter={64}>
          <Col md={12} xs={24}>
            <Row justify="space-between">
              <Title>Current Office Hours</Title>
              {role === Role.TA && <TACheckinButton courseId={Number(cid)} />}
            </Row>
            {course?.queues?.map((q) => (
              <OpenQueueCard
                key={q.id}
                queue={q}
                isTA={role === Role.TA}
                updateQueueNotes={updateQueueNotes}
              />
            ))}
            {!course && <OpenQueueCardSkeleton />}
          </Col>
          <Col md={12} sm={24}>
            <SchedulePanel courseId={Number(cid)} defaultView="day" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
