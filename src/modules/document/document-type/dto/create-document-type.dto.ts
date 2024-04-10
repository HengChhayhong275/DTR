import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateDocumentTypeDto {
    @ApiProperty()
    @IsString()
    name: string
}
