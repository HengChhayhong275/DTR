import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DraftRecordService } from './draft-record.service';
import { CreateDraftRecordDto } from './dto/create-draft-record.dto';
import { UpdateDraftRecordDto } from './dto/update-draft-record.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorator';
import { User } from 'src/libs/database/entities';

@ApiTags('draft-records')
@Controller('draft-records')
export class DraftRecordController {
  constructor(private readonly draftRecordService: DraftRecordService) {}

  // --------------- Self ---------------
  @Post('self')
  createSelf(
    @Body() createDto: CreateDraftRecordDto,
    @GetCurrentUser() user: User,
  ) {
    return this.draftRecordService.createDraftSelf(createDto, user);
  }

  @Get('self')
  findAllSelf(@GetCurrentUser() user: User) {
    return this.draftRecordService.findAllSelf(user);
  }

  @Get('self/:id')
  findOneSelf(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.draftRecordService.findOneSelf(id);
  }

  @Patch('self/:id')
  updateSelf(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateDraftRecordDto,
  ) {
    return this.draftRecordService.updateSelf(id, updateDto);
  }

  @Delete('self/:id')
  removeSelf(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.draftRecordService.removeSelf(id);
  }

  @Post('self/save-to-self-registered/:id')
  saveDraftSelfToSelfRegistered(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetCurrentUser() user: User,
  ) {
    return this.draftRecordService.saveDraftSelfToSelfRegisteredRecord(
      id,
      user,
    );
  }

  @Patch('self/:id/accept')
  acceptRequest(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() acceptDto: CreateDraftRecordDto,
    @GetCurrentUser() user: User
  ) {
    return this.draftRecordService.acceptRequest(id, acceptDto, user);
  }

  @Delete('self/:id/reject')
  rejectRequest(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.draftRecordService.rejectRequest(id);
  }

  // --------------- Other ---------------
  @Post('other')
  createOther(@Body() createDto: CreateDraftRecordDto) {
    return this.draftRecordService.createOtherDraft(createDto);
  }

  @Get('other')
  findAllOther(@GetCurrentUser() user: User) {
    return this.draftRecordService.findAllOther(user);
  }

  @Get('other/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.draftRecordService.findOneOther(id);
  }

  @Patch('other/:id')
  updateOther(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateDraftRecordDto,
  ) {
    return this.draftRecordService.updateOther(id, updateDto);
  }

  @Delete('other/:id')
  removeOther(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.draftRecordService.removeOther(id);
  }
}
