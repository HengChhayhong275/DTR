import { Module } from '@nestjs/common';
import { DraftRecordService } from './draft-record.service';
import { DraftRecordController } from './draft-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftRecord } from 'src/libs/database/entities/draft-record.entity';
import {
  DocumentOriginInfo,
  OtherRegisteredRecord,
  SelfRegisteredRecord,
  Status,
  User,
} from 'src/libs/database/entities';
import { RequestModule } from '../document/request/request.module';
import { RequestTransaction } from 'src/libs/database/entities/request-transaction.entity';
import { SelfRegisteredRecordModule } from '../document/self-registered-record/self-registered-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DraftRecord,
      DocumentOriginInfo,
      User,
      SelfRegisteredRecord,
      OtherRegisteredRecord,
      Status,
      RequestTransaction,
    ]),
    RequestModule,
    SelfRegisteredRecordModule,
  ],
  controllers: [DraftRecordController],
  providers: [DraftRecordService],
})
export class DraftRecordModule {}
