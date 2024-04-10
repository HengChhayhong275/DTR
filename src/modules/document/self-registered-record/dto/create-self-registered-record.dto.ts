/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { CreateDocumentOriginInfoDto } from "../../document-origin-info/dto/create-document-origin-info.dto";
import { Unit } from "src/libs/database/entities";

export class CreateSelfRegisteredRecordDto extends CreateDocumentOriginInfoDto{

    // @ApiProperty()
    // unit: Unit

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsBoolean()
    // isDeleted: boolean
}
