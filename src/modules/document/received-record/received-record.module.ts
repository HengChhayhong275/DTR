import { Module } from '@nestjs/common';
import { ReceivedRecordService } from './received-record.service';
import { ReceivedRecordController } from './received-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';
import { DocumentOriginInfo, OtherRegisteredRecord, ReceivedRecord, SelfRegisteredRecord, Status, Unit } from 'src/libs/database/entities';
import { AcceptingRecordModule } from '../accepting-record/accepting-record.module';
import { DropOffRecordModule } from '../drop-off-record/drop-off-record.module';

@Module({
  imports: [TypeOrmModule.forFeature([DispatchTransaction, Status, SelfRegisteredRecord, Unit, DocumentOriginInfo, ReceivedRecord, OtherRegisteredRecord]), AcceptingRecordModule, DropOffRecordModule],
  controllers: [ReceivedRecordController],
  providers: [ReceivedRecordService],
})
export class ReceivedRecordModule { }
