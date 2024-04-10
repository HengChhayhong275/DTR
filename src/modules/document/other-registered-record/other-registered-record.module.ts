import { Module } from '@nestjs/common';
import { OtherRegisteredRecordService } from './other-registered-record.service';
import { OtherRegisteredRecordController } from './other-registered-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DispatchTransaction,
  DocumentOriginInfo,
  OtherRegisteredRecord,
  Status,
  Unit,
} from 'src/libs/database/entities';
import { DraftRecord } from 'src/libs/database/entities/draft-record.entity';
import { RequestModule } from '../request/request.module';
import { SelfRegisteredRecordModule } from '../self-registered-record/self-registered-record.module';
import { DispatchModule } from '../dispatch/dispatch.module';
import { DropOffRecordModule } from '../drop-off-record/drop-off-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OtherRegisteredRecord,
      DocumentOriginInfo,
      Status,
      DraftRecord,
      Unit,
      DispatchTransaction
    ]),
    RequestModule,
    SelfRegisteredRecordModule,
    DispatchModule,
    DropOffRecordModule
  ],
  controllers: [OtherRegisteredRecordController],
  providers: [OtherRegisteredRecordService],
})
export class OtherRegisteredRecordModule { }
