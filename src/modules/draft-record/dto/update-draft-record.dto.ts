import { PartialType } from '@nestjs/swagger';
import { CreateDraftRecordDto } from './create-draft-record.dto';
import { CreateDocumentOriginInfoDto } from 'src/modules/document/document-origin-info/dto/create-document-origin-info.dto';

export class UpdateDraftRecordDto extends CreateDocumentOriginInfoDto {}
