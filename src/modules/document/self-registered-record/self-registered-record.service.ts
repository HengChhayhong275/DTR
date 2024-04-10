import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DocumentOriginInfo,
  SelfRegisteredRecord,
  Status, Unit,
  User,
} from 'src/libs/database/entities';
import { CreateSelfRegisteredRecordDto } from './dto/create-self-registered-record.dto';
import { UpdateSelfRegisteredRecordDto } from './dto/update-self-registered-record.dto';
import { DispatchService } from '../dispatch/dispatch.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { CreateDropOffDto } from './dto/create-drop-off.dto';
import { DispatchTransaction } from 'src/libs/database/entities/dispatch-transaction.entity';
import { MethodType } from 'src/libs/database/data-type/method.type';
import { DropOffRecordService } from '../drop-off-record/drop-off-record.service';

@Injectable()
export class SelfRegisteredRecordService {
  constructor(
    @InjectRepository(SelfRegisteredRecord)
    private readonly selfRecordRepository: Repository<SelfRegisteredRecord>,
    @InjectRepository(DocumentOriginInfo)
    private readonly documentOriginInfoRepository: Repository<DocumentOriginInfo>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
    @InjectRepository(DispatchTransaction)
    private readonly transactionRepo: Repository<DispatchTransaction>,

    // Service
    private readonly dispatchService: DispatchService,
    private readonly dropOffService: DropOffRecordService
  ) { }

  async dropOffSelf(createDropOffDto: CreateDropOffDto, user: User) {
    try {
      const unit = await this.unitRepo.findOne({
        where: { unitPin: createDropOffDto.unit_pin }
      })
      if (!unit) {
        throw new NotFoundException({
          message: "Invalid Unit Pin."
        })
      }

      const selfRecord = await this.selfRecordRepository.findOne({
        where: { id: createDropOffDto.document_id }, relations: {
          documentOriginInfo: true,
          transaction: true
        }
      })
      if (!selfRecord) {
        throw new NotFoundException({
          message: "Record Not Found."
        })
      }

      //Update Transaction to Drop off method and clear pin code
      await this.transactionRepo.update({
        id: selfRecord.transaction.id
      }, {
        method: MethodType.DROP_OFF,
        pin: null,
        receiving_unit: unit
      })

      await this.dropOffService.create(selfRecord.documentOriginInfo, unit, user, selfRecord.transaction.id)
      return {
        message: "Document Drop Off Sucessfully."
      }
    } catch (error) {
      throw error
    }
  }

  async getDispatchedRecord(user: User) {
    return await this.selfRecordRepository.find({
      where: {
        record_status: {
          dispatched: true,
        },
        owner_unit: {
          id: user.unit.id,
        },
      },
      relations: {
        documentOriginInfo: true,
        transaction: true,
        record_status: true,
      },
    });
  }

  async docGivenNumber(unit: Unit) {
    try {
      // Find Current User's unit abbreviation
      const abbre_name = unit.abbre_name;

      // Find Document Sequence Number of Unit's Self Registered Record
      const current_doc_sequence = await this.selfRecordRepository.count({
        where: {
          owner_unit: {
            id: unit.id,
          },
        },
      });
      const next_doc_sequence = current_doc_sequence + 1;

      // Current Document Sequence
      const doc_sequence_number = String(next_doc_sequence).padStart(6, '0');

      // Generate Document Sequence Number, Format 6 digits; 000001, 000002, 00003
      const doc_given_number = abbre_name + doc_sequence_number;

      return {
        doc_sequence_number,
        doc_given_number,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(createDto: CreateSelfRegisteredRecordDto, user: User) {
    try {
      console.log('Create DTO: ');
      console.log(createDto);
      const unit = user.unit
      const ID = await this.docGivenNumber(unit);

      // Add to Document Origin Info
      const documentOriginInfo = await this.documentOriginInfoRepository.save({
        ...createDto,
        doc_sequence_number: ID.doc_sequence_number,
        doc_given_number: ID.doc_given_number,
        created_by: user,
      });

      console.log(documentOriginInfo);

      // Add to Self Registered Record
      const selfRecord = new SelfRegisteredRecord();
      selfRecord.documentOriginInfo = documentOriginInfo;

      //Set the status to draft
      const status = await this.statusRepository.save({ draft: true });

      selfRecord.owner_unit = user.unit;
      selfRecord.record_status = status;
      await this.selfRecordRepository.save(selfRecord);

      return selfRecord;
    } catch (error) {
      throw error;
    }
  }

  async dispatch(createDispatchDto: CreateDispatchDto, user: User) {
    try {
      //create transaction
      const dispatchTransaction =
        await this.dispatchService.dispatchRecord(user);

      //Find reacord
      const record = await this.selfRecordRepository.findOne({
        where: { id: createDispatchDto.record },
      });

      if (!record) {
        throw new NotFoundException({
          message: 'Record Not Found.',
        });
      }

      //update record status
      await this.statusRepository.update(
        {
          id: record.record_status.id,
        },
        {
          dispatched: true,
          draft: false,
        },
      );

      //update record
      await this.selfRecordRepository.update(
        {
          id: createDispatchDto.record,
        },
        {
          transaction: dispatchTransaction,
        },
      );

      return {
        message: 'Document Dispatch Successfully.',
        pin: dispatchTransaction.pin,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(user: User) {
    try {
      const selfRecord = await this.selfRecordRepository.find({
        order: {
          createdAt: 'ASC', //sort by registered date oldest at the top
        },
        where: {
          isDeleted: false,
          owner_unit: {
            id: user.unit.id,
          },
        },
        relations: {
          documentOriginInfo: true,
          transaction: true,
        },
      });

      if(!selfRecord) {
        throw new NotFoundException("List is empty !")
      }

      return selfRecord
      
    } catch (error) {
      throw error
    }
  }

  async findLatestRecord() {
    const latestRecord = await this.selfRecordRepository.find({
      order: {
        id: 'DESC',
      },
    });

    if (latestRecord.length === 0) {
      const latestID = 1;
      return latestID;
    } else if (latestRecord.length > 0) {
      const latestID = latestRecord.length + 1;
      return latestID;
    }
  }

  async findOne(id: string) {
    try {
      const document = await this.selfRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
        },
      });

      if (!document) {
        throw new NotFoundException('Document not found!');
      }

      return document;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateSelfRegisteredRecordDto) {
    try {
      // Search for specific Record
      const selfRegistered = await this.selfRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          owner_unit: true,
        },
      });
      if (!selfRegistered) {
        throw new NotFoundException('Self Registered Record not found !');
      }

      const {
        // doc_given_number,
        created_by,
        published_date,
        summary,
        num_of_copies,
        // referral_doc_file,
        // main_doc_file,
        other,
      } = updateDto;

      const { documentOriginInfo } = selfRegistered;
      // documentOriginInfo.doc_given_number = doc_given_number;
      documentOriginInfo.created_by = created_by;
      documentOriginInfo.published_date = published_date;
      documentOriginInfo.summary = summary;
      documentOriginInfo.num_of_copies = num_of_copies;
      // documentOriginInfo.main_doc_file = main_doc_file,
      // documentOriginInfo.referral_doc_file = referral_doc_file,
      documentOriginInfo.other = other;

      const updated = await this.selfRecordRepository.save(selfRegistered);

      return {
        message: 'Self Registered Record updated successfully !',
        updated,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const document = await this.selfRecordRepository.findOne({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException('Document not found!');
      }

      await this.selfRecordRepository.update(id, {
        isDeleted: true,
      });
      return { message: 'Document Successfully Deleted !' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
