import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { DocumentType, User } from "src/libs/database/entities";

export class CreateDocumentOriginInfoDto {

    @ApiProperty()
    @IsString()
    doc_given_number: string

    @ApiProperty()
    @IsNumber()
    created_by: User

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    summary: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    num_of_copies: number

    @ApiProperty()
    @IsDate()
    published_date: Date

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    documentType: DocumentType

    @ApiProperty()
    @IsOptional()
    @IsString() 
    main_doc_file: string
    
    @ApiProperty()
    @IsOptional()
    @IsString() 
    referral_doc_file: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    other: string
}
