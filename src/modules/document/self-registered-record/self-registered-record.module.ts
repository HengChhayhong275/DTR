import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentOriginInfo, DocumentType, SelfRegisteredRecord, Status, Unit, User } from 'src/libs/database/entities';
import { SelfRegisteredRecordService } from './self-registered-record.service';
import { SelfRegisteredRecordController } from './self-registered-record.controller';
import { DispatchModule } from '../dispatch/dispatch.module';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';
import { DropOffRecordModule } from '../drop-off-record/drop-off-record.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    SelfRegisteredRecord,
    DocumentOriginInfo,
    DocumentType,
    User,
    Status,
    Unit,
    DispatchTransaction
  ]), DispatchModule, DropOffRecordModule],
  controllers: [SelfRegisteredRecordController],
  providers: [SelfRegisteredRecordService],
  exports: [SelfRegisteredRecordService]
})
export class SelfRegisteredRecordModule { }
