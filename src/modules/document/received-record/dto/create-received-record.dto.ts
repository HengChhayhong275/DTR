import { Unit } from "src/libs/database/entities";
import { CreateDocumentOriginInfoDto } from "../../document-origin-info/dto/create-document-origin-info.dto";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReceivedRecordDto extends CreateDocumentOriginInfoDto{
  @ApiProperty()
  @IsString()
  fromUnit: Unit
}
