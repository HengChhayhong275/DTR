import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { AcceptingRecord, DropOffRecord } from 'src/libs/database/entities';
import { CreateDocumentOriginInfoDto } from '../../document-origin-info/dto/create-document-origin-info.dto';

export class SaveToReceivedRecord extends CreateDocumentOriginInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  acceptingRecord?: AcceptingRecord

  @ApiProperty()
  @IsString()
  @IsOptional()
  dropOffRecord?: DropOffRecord
}

