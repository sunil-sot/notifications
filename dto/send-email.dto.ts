import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendEmailDto {
  @ApiProperty()
  emails: [string];

  @ApiProperty()
  subject: string;

  @ApiProperty()
  html: string;

  @ApiPropertyOptional()
  text?: string;

  @ApiProperty()
  source: string;
}
