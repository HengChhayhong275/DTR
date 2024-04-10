import { PartialType } from '@nestjs/swagger';
import { CreateOtherRegisteredRecordDto } from './create-other-registered-record.dto';

export class UpdateOtherRegisteredRecordDto extends PartialType(CreateOtherRegisteredRecordDto) {}
