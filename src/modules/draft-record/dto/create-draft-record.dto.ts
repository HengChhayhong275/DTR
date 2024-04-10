import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString } from "class-validator"
import { DraftType } from "src/libs/database/data-type/draft.type"
import { Status, Unit } from "src/libs/database/entities"
import { CreateDocumentOriginInfoDto } from "src/modules/document/document-origin-info/dto/create-document-origin-info.dto"

export class CreateDraftRecordDto extends CreateDocumentOriginInfoDto {
    
    // @ApiProperty()
    // @IsString()
    // unit: Unit

    // @ApiProperty()
    // @IsString()
    // @IsEnum(DraftType)
    // draft_type: DraftType

    // @ApiProperty()
    // @IsString()
    // status: Status

    // @ApiProperty()
    // @IsString()
    // requested_by: Unit

    // @ApiProperty()
    // @IsString()
    // requested_from: Unit
}
