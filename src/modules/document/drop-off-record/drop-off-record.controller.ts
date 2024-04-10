import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DropOffRecordService } from './drop-off-record.service';
import { GetCurrentUser } from 'src/common/decorator';
import { User } from 'src/libs/database/entities';

@ApiTags('drop-off-records')
@Controller('drop-off-records')

export class DropOffRecordController {

  constructor(private readonly dropOffRecordService: DropOffRecordService) { }

  @Get()
  findAll(@GetCurrentUser() user: User) {
    return this.dropOffRecordService.findAll(user);
  }

  @Get(':id')
  findOneByDocId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.dropOffRecordService.findByTransactionId(id);
  }
}
