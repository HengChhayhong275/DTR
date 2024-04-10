import { PartialType } from '@nestjs/swagger';
import { CreateReceivedRecordDto } from './create-received-record.dto';

export class UpdateReceivedRecordDto extends PartialType(CreateReceivedRecordDto) {}
