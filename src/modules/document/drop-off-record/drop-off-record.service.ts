import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DispatchTransaction, DocumentOriginInfo, ReceivedRecord, Unit, User } from 'src/libs/database/entities';
import { DropOffRecord } from 'src/libs/database/entities/drop-off-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DropOffRecordService {

  constructor(
    @InjectRepository(DropOffRecord)
    private readonly dropOffRepo: Repository<DropOffRecord>,
    @InjectRepository(ReceivedRecord)
    private readonly receiveRepo: Repository<ReceivedRecord>,
    @InjectRepository(DocumentOriginInfo)
    private readonly documentRepo: Repository<DocumentOriginInfo>

    ) { }

  async create(documentOriginInfo: DocumentOriginInfo, unit: Unit, sender: User, transactionId: string) {
    try {
      const transaction = new DispatchTransaction()
      transaction.id = transactionId

      const count = await this.receiveRepo.count({
        where: {
          unit: {
            id: sender.unit.id
          }
        },
      })

      const newSeuqence = count + 1


      //Create a new document origin info to seperate from the sender
      const record = documentOriginInfo
      delete record.id
      delete record.createdAt
      delete record.updatedAt
      const doc_sequence_number = String(newSeuqence).padStart(6, '0');
      record.doc_sequence_number = doc_sequence_number
      await this.documentRepo.save(record)

      const dropOff = new DropOffRecord()
      dropOff.documentOriginInfo = record
      dropOff.receiving_unit = unit
      dropOff.sender = sender
      dropOff.transaction = transaction

      const res = await this.dropOffRepo.save(dropOff)


      return res
    } catch (error) {
      throw error
    }
  }

  async findAll(user:User) {
    return await this.dropOffRepo.find({where: {
      receiving_unit: {
        id: user.unit.id
      }
    },
      relations: {
        documentOriginInfo: true,
        sender: true,
        receiving_unit: true,
        transaction: {
          transaction_status: true
        }
      }
    })
  }

  async findByTransactionId(id: string){
    try {
      const res = await this.dropOffRepo.findOne({
        where: {
          transaction: {
            id
          }
        },
        relations: {
          documentOriginInfo: {
            documentType: true,
            created_by: true
          },
          receiving_unit: true,
          sender: true,
          transaction: true,
        }
      })
  
      if(!res){
        throw new NotFoundException({
          message: "Drop Off Record Not Found."
        })
      }
      return res
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findOne(id:string){
    try{
      return await this.dropOffRepo.findOne({
        where: {
          id
        },
        relations: {
          sender: true,
          documentOriginInfo: true,
          receiving_unit: true
        }
      })
    }catch(error){
      console.log(error);
      throw error
    }
  }

  update(id: number) {
    return `This action updates a #${id} dropOff`;
  }

  async remove(id: string){
    try {
      return await this.dropOffRepo.delete(id)
    } catch (error) {
      console.log(error);
    }
  }
}
