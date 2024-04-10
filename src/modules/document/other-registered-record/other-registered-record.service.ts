/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOtherRegisteredRecordDto } from './dto/create-other-registered-record.dto';
import { UpdateOtherRegisteredRecordDto } from './dto/update-other-registered-record.dto';
import {
  DispatchTransaction,
  DocumentOriginInfo,
  OtherRegisteredRecord,
  Status,
  Unit,
  User,
} from 'src/libs/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DraftRecord } from 'src/libs/database/entities/draft-record.entity';
import { DraftType } from 'src/libs/database/data-type';
import { RequestService } from '../request/request.service';
import { SelfRegisteredRecordService } from '../self-registered-record/self-registered-record.service';
import { CreateDispatchDto } from '../self-registered-record/dto/create-dispatch.dto';
import { DispatchService } from '../dispatch/dispatch.service';
import { CreateDropOffDto } from '../self-registered-record/dto/create-drop-off.dto';
import { MethodType } from 'src/libs/database/data-type/method.type';
import { DropOffRecordService } from '../drop-off-record/drop-off-record.service';

@Injectable()
export class OtherRegisteredRecordService {
  constructor(
    @InjectRepository(OtherRegisteredRecord)
    private readonly otherRecordRepository: Repository<OtherRegisteredRecord>,
    @InjectRepository(DocumentOriginInfo)
    private readonly documentOriginInfoRepository: Repository<DocumentOriginInfo>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(DraftRecord)
    private readonly draftRecordRepository: Repository<DraftRecord>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(DispatchTransaction)
    private readonly transactionRepo: Repository<DispatchTransaction>,


    // Service
    private readonly requestService: RequestService,
    private readonly selfRecordService: SelfRegisteredRecordService,
    private readonly dispatchService: DispatchService,
    private readonly dropOffService: DropOffRecordService
  ) { }

  async dropOffOther(createDropOffDto: CreateDropOffDto, user: User) {
    try {
      const unit = await this.unitRepository.findOne({
        where: { unitPin: createDropOffDto.unit_pin }
      })
      if (!unit) {
        throw new NotFoundException({
          message: "Invalid Unit Pin."
        })
      }

      const otherRecord = await this.otherRecordRepository.findOne({
        where: { id: createDropOffDto.document_id }, relations: {
          documentOriginInfo: true,
          transaction: true
        }
      })
      if (!otherRecord) {
        throw new NotFoundException({
          message: "Record Not Found."
        })
      }

      //Update Transaction to Drop off method and clear pin code
      await this.transactionRepo.update({
        id: otherRecord.transaction.id
      }, {
        method: MethodType.DROP_OFF,
        pin: null,
        receiving_unit: unit
      })

      await this.dropOffService.create(otherRecord.documentOriginInfo, unit, user, otherRecord.transaction.id)
      return {
        message: "Document Drop Off Sucessfully."
      }
    } catch (error) {
      throw error
    }
  }

  async getDispatchedRecord(user: User) {
    return await this.otherRecordRepository.find({
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

  // this service is used for create other registered record by making request to ID owner 
  async create(createDto: CreateOtherRegisteredRecordDto, user: User) {
    try {
      // Firstly Store Document Detail in Document Origin Info
      const documentOriginInfo = await this.documentOriginInfoRepository.save({
        ...createDto,
        created_by: user,
      });

      // Requested From (ID's Owner)
      // Find ID Owner Unit
      const unit = await this.unitRepository.findOneBy({ id: String(createDto.requested_from) })

      // // Request Process
      const requestTransaction = await this.requestService.request(user, unit)

      // // Store Into our Draft Other with pending status
      const selfDraftOther = await this.draftRecordRepository.save({
        ...createDto,
        owner_unit: user.unit,
        documentOriginInfo: documentOriginInfo,
        draft_type: DraftType.Other,
        // status: ,
        request_transaction: requestTransaction,
        requested_from: unit,
      });
      // console.log(selfDraftOther);

      // // Show Document ID to the ID Owner
      const ID = await this.selfRecordService.docGivenNumber(unit)
      // console.log(ID)

      // // Store into Other's Draft Self
      const otherDraftSelf = new DraftRecord();
      otherDraftSelf.owner_unit = unit
      otherDraftSelf.documentOriginInfo = documentOriginInfo
      otherDraftSelf.documentOriginInfo.doc_given_number = ID.doc_given_number
      otherDraftSelf.documentOriginInfo.doc_sequence_number = ID.doc_sequence_number
      otherDraftSelf.draft_type = DraftType.Self
      otherDraftSelf.request_transaction = requestTransaction
      await this.draftRecordRepository.save(otherDraftSelf)

      // const otherDraftSelf = await this.draftRecordRepository.save({
      //   ...createDto,
      //   owner_unit: id_owner,
      //   documentOriginInfo: documentOriginInfo,
      //   draft_type: DraftType.Self,
      //   // status: ,
      //   request_transaction: requestTransaction,
      //   // requested_by: user,
      // });

      // console.log(otherDraftSelf);

      return {
        message: 'Successful make Request!',
        // documentOriginInfo,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async dispatch(createDispatchDto: CreateDispatchDto, user: User) {
    try {
      //create transaction
      const dispatchTransaction =
        await this.dispatchService.dispatchRecord(user);

      //Find reacord
      const record = await this.otherRecordRepository.findOne({
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
      await this.otherRecordRepository.update(
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
      const otherRecord = await this.otherRecordRepository.find({
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
          record_status: true,
          requested_from: true
        },
      });

      if (!otherRecord) {
        throw new NotFoundException("List is empty !")
      }

      return otherRecord

    } catch (error) {
      throw error
    }
  }


  async findOne(id: string) {
    try {
      const record = await this.otherRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          owner_unit: true,
          requested_from: true,
        },
      });
      if (!record) {
        throw new NotFoundException('Record not found!');
      }
      return record;
    } catch (error) {
      throw error;
    }
  }

  update(
    id: string,
    updateOtherRegisteredRecordDto: UpdateOtherRegisteredRecordDto,
  ) {
    return `This action updates a #${id} otherRegisteredRecord`;
  }

  async remove(id: string) {
    try {
      const document = await this.otherRecordRepository.findOne({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException('Document not found!');
      }

      await this.otherRecordRepository.update(id, {
        isDeleted: true,
      });
      return { message: 'Document Successfully Deleted !' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
