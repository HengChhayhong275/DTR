import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OtherRegisteredRecordService } from './other-registered-record.service';
import { CreateOtherRegisteredRecordDto } from './dto/create-other-registered-record.dto';
import { UpdateOtherRegisteredRecordDto } from './dto/update-other-registered-record.dto';
import { GetCurrentUser } from 'src/common/decorator';
import { User } from 'src/libs/database/entities';
import { ApiTags } from '@nestjs/swagger';
import { CreateDispatchDto } from '../self-registered-record/dto/create-dispatch.dto';
import { CreateDropOffDto } from '../self-registered-record/dto/create-drop-off.dto';

@ApiTags('other-registered-records')
@Controller('other-registered-records')
export class OtherRegisteredRecordController {
  constructor(private readonly otherRegisteredRecordService: OtherRegisteredRecordService) {}

  @Post('drop-off')
  dropOffOther(@Body() createDropoffDto: CreateDropOffDto, @GetCurrentUser() user:User){
    return this.otherRegisteredRecordService.dropOffOther(createDropoffDto, user)
  }

  @Post()
  create(@Body() createDto: CreateOtherRegisteredRecordDto, @GetCurrentUser() user: User) {
    return this.otherRegisteredRecordService.create(createDto, user);
  }

  @Post('dispatch')
  dispatch(@Body() createDispatchDto: CreateDispatchDto, @GetCurrentUser() user:User){
    return this.otherRegisteredRecordService.dispatch(createDispatchDto, user)
  }

  @Get()
  findAll(@GetCurrentUser() user: User) {
    return this.otherRegisteredRecordService.findAll(user);
  }

  @Get('dispatched')
  getDispatchedRecord(@GetCurrentUser() user: User) {
    return this.otherRegisteredRecordService.getDispatchedRecord(user);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.otherRegisteredRecordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateOtherRegisteredRecordDto: UpdateOtherRegisteredRecordDto) {
    return this.otherRegisteredRecordService.update(id, updateOtherRegisteredRecordDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.otherRegisteredRecordService.remove(id);
  }
}
