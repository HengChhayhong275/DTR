// filter.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { DocumentType, User } from "src/libs/database/entities";

export class FilterDto {
    doc_given_number?: string;
    summary?: string;
    documentType?: string;
    createdAt?: string;
  }
  