import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelfRegisteredRecord, Status, Unit, User } from 'src/libs/database/entities';
import { DraftRecord } from 'src/libs/database/entities/draft-record.entity';
import { RequestTransaction } from 'src/libs/database/entities/request-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(RequestTransaction)
    private readonly requestTransactionRepository: Repository<RequestTransaction>,
    @InjectRepository(DraftRecord)
    private readonly draftRecordRepository: Repository<DraftRecord>,
    @InjectRepository(SelfRegisteredRecord)
    private readonly selfRecordRepository: Repository<SelfRegisteredRecord>,
  ) {}

  async request(user: User, id_owner: Unit) {
    try {
      // Get pending status
      const status = new Status();
      status.pending = true;
      await this.statusRepository.insert(status);

      //   Store Request Transaction
      const requestTransaction = new RequestTransaction();
      requestTransaction.requested_from = id_owner;
      requestTransaction.requested_by = user.unit;
      requestTransaction.transaction_status = status;

      await this.requestTransactionRepository.insert(requestTransaction);
      return requestTransaction;
    } catch (error) {
      throw error;
    }
  }

  async accept() {
    try {
      const record = this.draftRecordRepository.findOne({
        // where: { id },
      });

      if (!record) {
        throw new NotFoundException('Request Record not found !');
      }

      // get accepted status
      const status = new Status();
      status.accepted = true;
      await this.statusRepository.insert(status);

      // frist find transaction id
      const transaction_id =  (await record).request_transaction.id;

      // update transaction status to accepted
      await this.requestTransactionRepository.update(transaction_id, {
        transaction_status: status
      })

      // Save it id_owner's self registered
      const selfRecord = new SelfRegisteredRecord();
      selfRecord.documentOriginInfo = (await record).documentOriginInfo
      // selfRecord.unit = 
      await this.selfRecordRepository.save({})


    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async reject(id: string) {
    try {
      const draftSelf = await this.draftRecordRepository.findOne({
        where: { id },
      });

      if (!draftSelf) {
        throw new NotFoundException('Record not found !');
      }

      const updateTransaction = await this.requestTransactionRepository.update(
        id,
        {},
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
