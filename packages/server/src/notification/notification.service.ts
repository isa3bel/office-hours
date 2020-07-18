import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as twilio from 'twilio';
import { Connection, DeepPartial } from 'typeorm';
import * as webPush from 'web-push';
import { UserModel } from '../profile/user.entity';
import { DesktopNotifModel } from './desktop-notif.entity';
import { PhoneNotifModel } from './phone-notif.entity';

@Injectable()
export class NotificationService {
  private twilioClient: twilio.Twilio;
  desktopPublicKey: string;

  constructor(
    private connection: Connection,
    private configService: ConfigService,
  ) {
    this.twilioClient = twilio(
      this.configService.get('TWILIOACCOUNTSID'),
      this.configService.get('TWILIOAUTHTOKEN'),
    );
    webPush.setVapidDetails(
      this.configService.get('EMAIL'),
      this.configService.get('PUBLICKEY'),
      this.configService.get('PRIVATEKEY'),
    );
    this.desktopPublicKey = this.configService.get('PUBLICKEY');
  }

  async registerDesktop(info: DeepPartial<DesktopNotifModel>) {
    await DesktopNotifModel.create(info).save();
  }

  async registerPhone(phoneNumber: string, userId: number): Promise<void> {
    try {
      phoneNumber = (
        await this.twilioClient.lookups.phoneNumbers(phoneNumber).fetch()
      ).phoneNumber;
    } catch (err) {
      // if the phone number is not found, then endpoint should return invalid
      throw new BadRequestException('phone number invalid');
    }

    const phoneNotifModel = await PhoneNotifModel.create({
      phoneNumber,
      userId,
      verified: false,
    }).save();

    await this.notifyPhone(
      phoneNotifModel,
      "You've signed up for phone notifications for Khoury Office Hours. To verify your number, please respond to this message with YES. To unsubscribe, respond to this message with NO or STOP",
      true,
    );
  }

  // Notify user on all platforms
  async notifyUser(userId: number, message: string): Promise<void> {
    const notifModelsOfUser = await UserModel.findOne({
      where: {
        id: userId,
      },
      relations: ['desktopNotifs', 'phoneNotifs'],
    });

    // run the promises concurrently
    await Promise.all([
      ...notifModelsOfUser.desktopNotifs.map(async (nm) =>
        this.notifyDesktop(nm, message),
      ),
      ...notifModelsOfUser.phoneNotifs.map(async (pn) => {
        this.notifyPhone(pn, message, false);
      }),
    ]);
  }

  // notifies a user via desktop notification
  async notifyDesktop(nm: DesktopNotifModel, message: string): Promise<void> {
    try {
      await webPush.sendNotification(
        {
          endpoint: nm.endpoint,
          keys: {
            p256dh: nm.p256dh,
            auth: nm.auth,
          },
        },
        message,
      );
    } catch (error) {
      await DesktopNotifModel.remove(nm);
    }
  }

  // notifies a user via phone number
  async notifyPhone(
    pn: PhoneNotifModel,
    message: string,
    verificationMethod: boolean,
  ): Promise<void> {
    if (verificationMethod || pn.verified) {
      try {
        this.twilioClient &&
          (await this.twilioClient.messages.create({
            body: message,
            from: this.configService.get('TWILIOPHONENUMBER'),
            to: pn.phoneNumber,
          }));
      } catch (error) {
        console.error('problem sending message', error);
      }
    }
  }

  async verifyPhone(
    phoneNumber: string,
    message: string,
    response: Response,
  ): Promise<void> {
    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    if (message !== 'YES' && message !== 'NO' && message !== 'STOP') {
      twiml.message(
        'Please respond with either YES or NO. Text STOP at any time to stop receiving text messages',
      );
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
      return;
    }

    const phoneNotif = await PhoneNotifModel.findOne({
      where: { phoneNumber: phoneNumber },
    });

    if (!phoneNotif) {
      twiml.message(
        'Could not find an Office Hours account with your phone number.',
      );
    } else if (message === 'NO' || message === 'STOP') {
      // might not need stop -- Twilio might auto do that for us? a little crazy but that's ok
      await PhoneNotifModel.delete(phoneNotif);
      twiml.message(
        "You've unregistered from text notifications for Khoury Office Hours. Feel free to re-register any time through the website",
      );
    } else if (phoneNotif.verified) {
      twiml.message(
        "You've already been verified to receive text notifications from Khoury Office Hours!",
      );
    } else {
      phoneNotif.verified = true;
      await phoneNotif.save();

      twiml.message(
        'Thank you for verifying your number with Khoury Office Hours! You are now signed up for text notifications!',
      );
    }
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(twiml.toString());
    return;
  }
}
