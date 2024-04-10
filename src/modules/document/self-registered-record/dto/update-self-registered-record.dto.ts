import { PartialType } from '@nestjs/swagger';
import { CreateSelfRegisteredRecordDto } from './create-self-registered-record.dto';

export class UpdateSelfRegisteredRecordDto extends PartialType(CreateSelfRegisteredRecordDto) { }
