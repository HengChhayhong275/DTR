import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SelfRegisteredRecordService } from './self-registered-record.service';
import { CreateSelfRegisteredRecordDto } from './dto/create-self-registered-record.dto';
import { UpdateSelfRegisteredRecordDto } from './dto/update-self-registered-record.dto';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { GetCurrentUser } from 'src/common/decorator';
import { User } from 'src/libs/database/entities';
import { CreateDropOffDto } from './dto/create-drop-off.dto';

@ApiTags('self-registered-records')
@Controller('self-registered-records')
export class SelfRegisteredRecordController {
  constructor(private readonly selfRegisteredRecordService: SelfRegisteredRecordService) {
  }

  @Post('drop-off')
  dropOffSelf(@Body() createDropoffDto: CreateDropOffDto, @GetCurrentUser() user:User){
    return this.selfRegisteredRecordService.dropOffSelf(createDropoffDto, user)
  }

  @Post()
  create(@Body() createDto: CreateSelfRegisteredRecordDto, @GetCurrentUser() user: User) {
    console.log('Hello from self post controller')
    return this.selfRegisteredRecordService.create(createDto, user);
  }

  @Get('doc-given-number')
  docGivenNumber(@GetCurrentUser() user: User){
    const unit = user.unit
    return this.selfRegisteredRecordService.docGivenNumber(unit)
  }

  @Get('latest')
  async findLatestRecord() {
    return this.selfRegisteredRecordService.findLatestRecord();
  }

  @Get('dispatched')
  getDispatchedRecord(@GetCurrentUser() user: User) {
    return this.selfRegisteredRecordService.getDispatchedRecord(user);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.selfRegisteredRecordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateSelfRegisteredRecordDto) {
    return this.selfRegisteredRecordService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.selfRegisteredRecordService.remove(id);
  }

  @Post('dispatch')
  dispatch(@Body() createDispatchDto: CreateDispatchDto, @GetCurrentUser() user:User){
    return this.selfRegisteredRecordService.dispatch(createDispatchDto, user)
  }

  @Get()
  findAll(@GetCurrentUser() user: User) {
    return this.selfRegisteredRecordService.findAll(user);
  } 
}
