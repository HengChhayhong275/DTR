import { Module } from '@nestjs/common';
import { SelfRegisteredRecord, Status } from 'src/libs/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';
import { RequestService } from './request.service';
import { RequestTransaction } from 'src/libs/database/entities/request-transaction.entity';
import { DraftRecord } from 'src/libs/database/entities/draft-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status, RequestTransaction, DraftRecord, SelfRegisteredRecord])],
  providers: [RequestService],
  exports: [RequestService]
})
export class RequestModule { }
