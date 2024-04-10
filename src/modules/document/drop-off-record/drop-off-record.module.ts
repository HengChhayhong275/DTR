import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentOriginInfo, DropOffRecord, ReceivedRecord } from 'src/libs/database/entities';
import { DropOffRecordService } from './drop-off-record.service';
import { DropOffRecordController } from './drop-off-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DropOffRecord, ReceivedRecord, DocumentOriginInfo])],
  providers: [DropOffRecordService],
  controllers: [DropOffRecordController],
  exports: [DropOffRecordService]
})
export class DropOffRecordModule { }
