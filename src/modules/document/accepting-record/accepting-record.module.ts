import { Module } from '@nestjs/common';
import { AcceptingRecordService } from './accepting-record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptingRecord } from 'src/libs/database/entities';
import { AcceptingRecordController } from './accepting-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcceptingRecord])],
  controllers: [AcceptingRecordController],
  providers: [AcceptingRecordService],
  exports: [AcceptingRecordService]
})
export class AcceptingRecordModule {}
