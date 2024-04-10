import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { Status } from 'src/libs/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status, DispatchTransaction])],
  providers: [DispatchService],
  exports: [DispatchService]
})
export class DispatchModule { }
