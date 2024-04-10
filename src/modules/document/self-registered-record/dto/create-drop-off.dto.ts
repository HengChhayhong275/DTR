import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateDropOffDto {
  @ApiProperty()
  @IsString()
  document_id: string

  @ApiProperty()
  @IsString()
  unit_pin: string
}

