import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateDispatchDto {
  @ApiProperty()
  @IsString()
  record: string
}

