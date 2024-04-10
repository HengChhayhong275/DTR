import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SaveToReceivedRecord } from './dto/save-to-received-record.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReceivedRecordService } from './received-record.service';
import { CreateReceivedRecordDto } from './dto/create-received-record.dto';
import { GetCurrentUser } from 'src/common/decorator';
import { ReceiveRecordDto } from './dto/receive-record.dto';
import { User } from 'src/libs/database/entities';
import { UpdateReceivedRecordDto } from './dto/update-received-record.dto';

@ApiTags('received-records')
@Controller('received-records')
export class ReceivedRecordController {
  constructor(private readonly receivedRecordService: ReceivedRecordService) { }

  @Post('save')
  saveToReceivedRecord(@Body() saveToReceivedRecord: SaveToReceivedRecord, @GetCurrentUser() user: User) {
    return this.receivedRecordService.saveToReceivedRecord(saveToReceivedRecord, user);
  }

  @Post()
  create(@Body() createReceivedRecordDto: CreateReceivedRecordDto, @GetCurrentUser() user: User) {
    return this.receivedRecordService.create(createReceivedRecordDto, user);
  }

  @Post('receive')
  receiveRecord(@Body() receiveRecordDto: ReceiveRecordDto, @GetCurrentUser() user: User) {
    return this.receivedRecordService.receiveRecord(receiveRecordDto, user);
  }

  @Get('latest')
  docGivenNumber(@GetCurrentUser() user: User){
    return this.receivedRecordService.findLatestRecord(user)
  }

  @Get()
  findAll(@GetCurrentUser() user: User) {
    return this.receivedRecordService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.receivedRecordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateReceivedRecordDto: UpdateReceivedRecordDto) {
    return this.receivedRecordService.update(id, updateReceivedRecordDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.receivedRecordService.remove(id);
  }
}
