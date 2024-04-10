import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Unit, User } from 'src/libs/database/entities';
import { Repository } from 'typeorm';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';
import { MethodType } from 'src/libs/database/data-type/method.type';

@Injectable()
export class DispatchService {

  constructor(
    @InjectRepository(Status)
    private readonly statusRepo: Repository<Status>,
    @InjectRepository(DispatchTransaction)
    private readonly transactionRepo: Repository<DispatchTransaction>,
  ) { }

  async generatePin() {
    const pin = Math.floor(1000 + Math.random() * 9000)
    if (!await this.transactionRepo.findOne({
      where: {
        pin: pin
      }
    })) {
      return pin
    } else {
      this.generatePin()
    }
  }

  async dispatchRecord(user: User) {
    try {
      const status = new Status()
      status.pending = true
      await this.statusRepo.insert(status)

      const pin = await this.generatePin()

      const transaction = new DispatchTransaction()
      transaction.sender = user
      transaction.pin = pin
      transaction.transaction_status = status

      await this.transactionRepo.insert(transaction)
      return transaction
    } catch (error) {
      throw error
    }
  }
  
  async dropOff(unit: Unit, transactionId: string){
    try {
      await this.transactionRepo.update({
        id: transactionId
      }, {
        pin: null,
        method: MethodType.DROP_OFF,
        receiving_unit: unit
      })
      return {
        message: "Document Dropped Off Successfully."
      }
    } catch (error) {
      throw error
    }
  }



}
