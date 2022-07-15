import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { SendEmailDto } from "./dto/send-email.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { ConfigService } from "@nestjs/config";
import { SES } from "aws-sdk";

@Injectable()
export class NotificationsService {
  private readonly awsCredentials;
  private readonly sesClient: SES;

  constructor(private config: ConfigService) {
    this.awsCredentials = {
      accessKeyId: config.get<string>("aws.accessKeyId"),
      secretAccessKey: config.get<string>("aws.secretAccessKey"),
    };
    this.sesClient = new SES({
      credentials: this.awsCredentials,
      region: "us-east-1",
    });
    this.config = config;
  }

  async sendEmail(sendNotificationDto: SendEmailDto) {
    let params: SES.SendEmailRequest = {
      Destination: {
        ToAddresses: [...sendNotificationDto.emails],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: sendNotificationDto.html,
          },
          Text: {
            Charset: "UTF-8",
            Data: sendNotificationDto.text || "",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: sendNotificationDto.subject,
        },
      },
      Source: sendNotificationDto.source || "usde@soterius.com",
      ReplyToAddresses: ["usde@soterius.com"],
    };
    console.log(params)
    return await this.sesClient.sendEmail(params).promise();
  }
}
