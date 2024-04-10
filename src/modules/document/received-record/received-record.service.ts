import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReceiveRecordDto } from './dto/receive-record.dto';
import { DocumentOriginInfo, OtherRegisteredRecord, ReceivedRecord, SelfRegisteredRecord, Status, User } from 'src/libs/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';
import { CreateReceivedRecordDto } from './dto/create-received-record.dto';
import { AcceptingRecordService } from '../accepting-record/accepting-record.service';
import { SaveToReceivedRecord } from './dto/save-to-received-record.dto';
import { UpdateReceivedRecordDto } from './dto/update-received-record.dto';
import { DropOffRecordService } from '../drop-off-record/drop-off-record.service';

@Injectable()
export class ReceivedRecordService {

  constructor(

    private readonly acceptingRecordService: AcceptingRecordService,
    private readonly dropOffService: DropOffRecordService,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    @InjectRepository(DispatchTransaction)
    private readonly transactionRepo: Repository<DispatchTransaction>,

    @InjectRepository(SelfRegisteredRecord)
    private readonly selfRecordRepo: Repository<SelfRegisteredRecord>,

    @InjectRepository(OtherRegisteredRecord)
    private readonly otherRecordRepo: Repository<OtherRegisteredRecord>,

    @InjectRepository(DocumentOriginInfo)
    private readonly documentRepo: Repository<DocumentOriginInfo>,

    @InjectRepository(ReceivedRecord)
    private readonly receiveRepo: Repository<ReceivedRecord>,
  ) { }

  async saveToReceivedRecord(saveToReceivedRecord: SaveToReceivedRecord, user: User) {
    try {
      let record
      const receiveRecord = new ReceivedRecord()

      if (saveToReceivedRecord.acceptingRecord) {
        record = await this.acceptingRecordService.findOne(saveToReceivedRecord.acceptingRecord.toString())
        receiveRecord.receiver = record.receiver
        receiveRecord.unit = record.unit
        delete saveToReceivedRecord.acceptingRecord
        await this.acceptingRecordService.remove(record.id)
      }

      if (saveToReceivedRecord.dropOffRecord) {
        record = await this.dropOffService.findOne(saveToReceivedRecord.dropOffRecord.toString())

        const transaction = await this.transactionRepo.findOne({where: {id: record.transaction}})
        
        
        //update transaction receiver 
        await this.transactionRepo.update({
          id: transaction.id
        }, {
          receiver: user,
        })
        
        //update transaction status to accepted
        await this.statusRepository.update({
          id: transaction.transaction_status.id
        }, {
          accepted: true,
          pending: false
        })
  
        receiveRecord.receiver = user
        receiveRecord.unit = record.receiving_unit
        delete saveToReceivedRecord.dropOffRecord
        await this.dropOffService.remove(record.id)
      }

      // //Update the document origin info data if needed
      await this.documentRepo.update(record.documentOriginInfo.id, saveToReceivedRecord)

      //insert to receive record
      receiveRecord.documentOriginInfo = record.documentOriginInfo
      receiveRecord.acceptedDate = record.createdAt
      receiveRecord.sender = record.sender
      receiveRecord.fromUnit = record.sender.unit
      await this.receiveRepo.save(receiveRecord)

      return {
        message: "Record created successfully"
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findLatestRecord(user: User) {
    const count = await this.receiveRepo.count({
      where: {
        unit: {
          id: user.unit.id
        }
      },
    })

    if (count === 0) {
      const latestID = 1;
      return latestID;
    } else if (count > 0) {
      const latestID = count + 1;
      return latestID;
    }
  }


  async create(createReceivedRecordDto: CreateReceivedRecordDto, user: User) {
    try {
      //add to document origin info
      createReceivedRecordDto.created_by = user
      const documentOriginInfo = await this.documentRepo.save(createReceivedRecordDto)

      //insert to receive record
      const receiveRecord = new ReceivedRecord()
      receiveRecord.documentOriginInfo = documentOriginInfo
      receiveRecord.unit = user.unit
      if(createReceivedRecordDto.fromUnit){
        receiveRecord.fromUnit = createReceivedRecordDto.fromUnit
      }
      await this.receiveRepo.save(receiveRecord)

      return {
        message: "Record created successfully"
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }


  async receiveRecord(receiveRecordDto: ReceiveRecordDto, user: User) {
    const { pin } = receiveRecordDto
    if (!pin) {
      throw new BadRequestException({
        message: "Pin is required."
      })
    }

    try {

      //Check if pin is valid
      const transaction = await this.transactionRepo.findOne({
        where: {
          pin: pin
        }
      })

      if (!transaction) {
        throw new NotFoundException({
          message: "Pin is invalid."
        })
      }

      //Find the record that the user receive
      let record
      record = await this.selfRecordRepo.findOne({
        where: {
          transaction: {
            id: transaction.id
          }
        },
        relations: {
          documentOriginInfo: true
        }
      })

      if (!record) {
        record = await this.otherRecordRepo.findOne({
          where: {
            transaction: {
              id: transaction.id
            }
          },
          relations: {
            documentOriginInfo: true
          }
        })

      }


      //Update transaction
      await this.transactionRepo.update({
        id: transaction.id
      }, {
        receiving_unit: user.unit,
        receiver: user,
        pin: null
      })

      await this.statusRepository.update({
        id: transaction.transaction_status.id
      }, {
        accepted: true,
        pending: false
      })




      const count = await this.receiveRepo.count({
        where: {
          unit: {
            id: user.unit.id
          }
        },
      })

      const newSeuqence = count + 1

      //Create a new document origin info to seperate from the sender
      delete record.documentOriginInfo.id
      const doc_sequence_number = String(newSeuqence).padStart(6, '0');
      record.documentOriginInfo.doc_sequence_number = doc_sequence_number
      const res = await this.documentRepo.save(record.documentOriginInfo)


      await this.acceptingRecordService.create(res, user.unit, user, transaction.sender, transaction)

      return record
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findAll(user: User) {
    return await this.receiveRepo.find({
      where: {
        unit: {
          id: user.unit.id
        }
      },
      relations: {
        unit: true,
        documentOriginInfo: {
          created_by: true
        },
        sender: true,
        receiver: true
      }
    })
  }

  findOne(id: string) {
    return `This action returns a #${id} documentReceivedRecord`;
  }

  update(id: string, updateReceivedRecordDto: UpdateReceivedRecordDto) {
    console.log(updateReceivedRecordDto);
    return `This action updates a #${id} documentReceivedRecord`;
  }

  remove(id: string) {
    return `This action removes a #${id} documentReceivedRecord`;
  }
}
