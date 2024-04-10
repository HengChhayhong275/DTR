import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ReceiveRecordDto {
  @ApiProperty()
  @IsNumber()
  pin: number
}
