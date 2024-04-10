import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AcceptingRecordService } from "./accepting-record.service";
import { GetCurrentUser } from "src/common/decorator";
import { User } from "src/libs/database/entities";


@ApiTags('accepting-records')
@Controller('accepting-records')
export class AcceptingRecordController {
  constructor(private readonly acceptingRecordService: AcceptingRecordService) { }


  @Get()
  findAll(@GetCurrentUser() user: User) {
    return this.acceptingRecordService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.acceptingRecordService.findOne(id);
  }

 
}
