import { PartialType } from '@nestjs/swagger';
import { CreateDocumentOriginInfoDto } from './create-document-origin-info.dto';

export class UpdateDocumentDetailDto extends PartialType(CreateDocumentOriginInfoDto) { }
