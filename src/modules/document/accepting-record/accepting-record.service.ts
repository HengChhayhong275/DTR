import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptingRecord, DispatchTransaction, DocumentOriginInfo, Unit, User } from 'src/libs/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AcceptingRecordService {

  constructor(
    @InjectRepository(AcceptingRecord)
    private readonly acceptingRecordRepo: Repository<AcceptingRecord>
  ) {}


  
  async create(documentOriginInfo: DocumentOriginInfo, unit:Unit, receiver: User, sender:User, transaction: DispatchTransaction) {
    try {
      const acceptingRecord = new AcceptingRecord()
      acceptingRecord.documentOriginInfo = documentOriginInfo
      acceptingRecord.unit= unit 
      acceptingRecord.receiver = receiver
      acceptingRecord.sender = sender
      acceptingRecord.transaction = transaction
      const res = await this.acceptingRecordRepo.insert(acceptingRecord)
      return res
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findOne(id:string){
    try{
      return await this.acceptingRecordRepo.findOne({
        where: {
          id
        },
        relations: {
          receiver: true,
          sender: true,
          unit: true,
          documentOriginInfo: true,
          transaction: {
            transaction_status: true
          }
        }
      })
    }catch(error){
      console.log(error);
      throw error
    }
  }

  async findAll(user: User) {
    try {
      return await this.acceptingRecordRepo.find({
        where: {
          unit: {
            id: user.unit.id
          }
        },
        relations:{ 
          documentOriginInfo:{
            created_by: true
          },
          unit: true,
          receiver: true
        }
      })      
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async remove(id: string){
    try {
      return await this.acceptingRecordRepo.delete(id)
    } catch (error) {
      console.log(error);
    }
  }
}
