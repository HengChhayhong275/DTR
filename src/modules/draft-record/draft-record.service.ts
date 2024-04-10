import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDraftRecordDto } from './dto/create-draft-record.dto';
import { UpdateDraftRecordDto } from './dto/update-draft-record.dto';
import { Repository } from 'typeorm';
import { DraftRecord } from 'src/libs/database/entities/draft-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DocumentOriginInfo,
  OtherRegisteredRecord,
  SelfRegisteredRecord,
  Status,
  User,
} from 'src/libs/database/entities';
import { DraftType } from 'src/libs/database/data-type';
import { RequestService } from '../document/request/request.service';
import { RequestTransaction } from 'src/libs/database/entities/request-transaction.entity';
import { SelfRegisteredRecordService } from '../document/self-registered-record/self-registered-record.service';
import { GetCurrentUser } from 'src/common/decorator';

@Injectable()
export class DraftRecordService {
  constructor(
    // Repository
    @InjectRepository(DraftRecord)
    private readonly draftRecordRepository: Repository<DraftRecord>,
    @InjectRepository(DocumentOriginInfo)
    private readonly documentOriginInfoRepository: Repository<DocumentOriginInfo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SelfRegisteredRecord)
    private readonly selfRegisteredRepository: Repository<SelfRegisteredRecord>,
    @InjectRepository(OtherRegisteredRecord)
    private readonly otherRegisteredRepository: Repository<OtherRegisteredRecord>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(RequestTransaction)
    private readonly requestTransactionRepository: Repository<RequestTransaction>,

    // Service
    private readonly requestService: RequestService,
    private readonly selfRecordService: SelfRegisteredRecordService,
  ) {}

  // --------------- Self ---------------
  async createDraftSelf(createDto: CreateDraftRecordDto, user: User) {
    try {
      delete createDto.doc_given_number
      // Add to Document Origin Info
      const documentOriginInfo = await this.documentOriginInfoRepository.save({
        ...createDto,
        created_by: user,
      });
      console.log(documentOriginInfo)

      const draftSelf = new DraftRecord();
      // Find Unit via user
      draftSelf.owner_unit = user.unit;
      draftSelf.documentOriginInfo = documentOriginInfo;
      draftSelf.draft_type = DraftType.Self;

      const status = await this.statusRepository.save({ draft: true });
      draftSelf.status = status;

      const uploaded = await this.draftRecordRepository.save(draftSelf);
      console.log(uploaded);
      return {
        message: 'Self Draft Record created successfully !',
        uploaded,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllSelf(user: User) {
    try {
      const draftSelfRecord = await this.draftRecordRepository.find({
        where: {
          owner_unit: {
            id: user.unit.id,
          },
          draft_type: DraftType.Self,
        },
        relations: {
          documentOriginInfo: true,
          request_transaction: true,
        },
      });
      if (!draftSelfRecord) {
        throw new NotFoundException('Draf Self Record not found !');
      }
      return draftSelfRecord;
    } catch (error) {
      throw error;
    }
  }

  async findOneSelf(id: string) {
    try {
      const draftSelfRecord = await this.draftRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          owner_unit: true,
          request_transaction: {
            requested_by: true,
          },
        },
      });
      if (!draftSelfRecord) {
        throw new NotFoundException('Draft Self Record not found !');
      }
      return draftSelfRecord;
    } catch (error) {
      throw error;
    }
  }

  async updateSelf(id: string, updateDto: UpdateDraftRecordDto) {
    try {
      // Search for specific Draft Self Registered Record
      const draftSelf = await this.draftRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          owner_unit: true,
        },
      });
      if (!draftSelf) {
        throw new NotFoundException('Draft Self Registered Record not found !');
      }

      await this.documentOriginInfoRepository.update(
        {
          id: draftSelf.documentOriginInfo.id,
        },
        updateDto,
      );

      return {
        message: 'Draft Self Registered Record updated successfully !',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeSelf(id: string) {
    try {
      const draftSelf = await this.draftRecordRepository.findOne({
        where: { id },
      });
      if (!draftSelf) {
        throw new NotFoundException('Draft Self Record not found !');
      }

      await this.draftRecordRepository.remove(draftSelf);
    } catch (error) {
      throw error;
    }
  }

  async saveDraftSelfToSelfRegisteredRecord(id: string, user: User) {
    try {
      // Find Draft Self
      const draftSelf = await this.draftRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          owner_unit: true,
        },
      });
      if (!draftSelf) {
        throw new NotFoundException('Draft Self Record not found !');
      }

      const unit = user.unit
      const ID = await this.selfRecordService.docGivenNumber(unit);

      // Save the Draft Self Record to Self Registered Record
      const selfRecord = new SelfRegisteredRecord();
      selfRecord.documentOriginInfo = draftSelf.documentOriginInfo;
      selfRecord.documentOriginInfo.doc_given_number = ID.doc_given_number
      selfRecord.documentOriginInfo.doc_sequence_number = ID.doc_sequence_number
      selfRecord.owner_unit = draftSelf.owner_unit;

      //Set the status to draft
      const status = await this.statusRepository.save({ draft: true });
      selfRecord.record_status = status;

      await this.selfRegisteredRepository.save(selfRecord);

      // After save to Self Registered Record, Delete from Draft Self Record
      await this.draftRecordRepository.remove(draftSelf);

      return {
        message: 'Draft Self saved to Self Registered successfully !',
      };
    } catch (error) {
      throw error;
    }
  }

  // handle accept ID request
  async acceptRequest(id: string, acceptDto: CreateDraftRecordDto, user: User) {
    try {
      const requestRecord = await this.draftRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          request_transaction: {
            transaction_status: true,
            requested_by: true,
            requested_from: true,
          },
        },
      });

      if (!requestRecord) {
        throw new NotFoundException('Record not found !');
      }

      // // get accepted status
      const acceptStatus = new Status();
      acceptStatus.accepted = true;
      await this.statusRepository.insert(acceptStatus);

      // // updated transaction status to accepted
      const transaction_id = requestRecord.request_transaction.id;
      await this.requestTransactionRepository.update(transaction_id, {
        transaction_status: acceptStatus,
      });

      // get self draft status
      const selfDraftStatus = new Status();
      selfDraftStatus.draft = true;
      await this.statusRepository.insert(selfDraftStatus);

      // Get the ID to approve
      const unit = user.unit
      const ID = await this.selfRecordService.docGivenNumber(unit)

      // // Store to self registered of owner
      const selfRegisteredRecord = new SelfRegisteredRecord();
      selfRegisteredRecord.documentOriginInfo =
        requestRecord.documentOriginInfo;
      selfRegisteredRecord.documentOriginInfo.doc_given_number = ID.doc_given_number,
      selfRegisteredRecord.documentOriginInfo.doc_sequence_number = ID.doc_sequence_number,
      selfRegisteredRecord.requested_by =
        requestRecord.request_transaction.requested_by;
      selfRegisteredRecord.owner_unit =
        requestRecord.request_transaction.requested_from;
      selfRegisteredRecord.record_status = selfDraftStatus;
      selfRegisteredRecord.transaction = null;
      await this.selfRegisteredRepository.save(selfRegisteredRecord);

      // get other draft status
      const otherDraftStatus = new Status();
      otherDraftStatus.draft = true;
      await this.statusRepository.insert(otherDraftStatus);

      // store to other registered of requestor, docOrigin remain the same of requestor
      const otherRegisteredRecord = new OtherRegisteredRecord();
      otherRegisteredRecord.documentOriginInfo =
        requestRecord.documentOriginInfo;
      otherRegisteredRecord.requested_from =
        requestRecord.request_transaction.requested_from;
      otherRegisteredRecord.owner_unit =
        requestRecord.request_transaction.requested_by;
      otherRegisteredRecord.record_status = otherDraftStatus;
      otherRegisteredRecord.transaction = null;
      await this.otherRegisteredRepository.save(otherRegisteredRecord);

      console.log(otherRegisteredRecord);

      // delete from draft self of owner
      await this.removeSelf(id);

      // delete from draft other of requestor
      // First Find the ID of Draft Other via Document Origin Info
      const draftOther = await this.draftRecordRepository.findOne({
        where: {
          documentOriginInfo: {
            id: requestRecord.documentOriginInfo.id,
          },
        },
      });
      await this.removeOther(draftOther.id);

      // return await this.requestService.accept();

      return {
        message: 'Successful !',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // handle reject ID request
  async rejectRequest(id: string) {
    try {
      // return await this.requestService.reject(id);

      // Check for specific document record
      const record = await this.draftRecordRepository.findOne({
        where: { id },
        relations: {
          documentOriginInfo: true,
          request_transaction: {
            transaction_status: true,
          },
        },
      });

      if (!record) {
        throw new NotFoundException('Record not found !');
      }

      // // Get transaction id via draft self record
      const transaction_status_id = record.request_transaction.transaction_status.id;

      // update the status of draft other of requestor to rejected
      await this.statusRepository.update(transaction_status_id, {
        pending: false,
        rejected: true
      })

      // // delete the record from draf self of id owner
      await this.removeSelf(id);

      return {
        message: 'Successful !',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // --------------- Other ---------------
  async createOtherDraft(createDto: CreateDraftRecordDto) {
    try {
      // Add to Document Origin Info
      const documentOriginInfo =
        await this.documentOriginInfoRepository.save(createDto);

      // Find Unit via user
      const user = await this.userRepository.findOne({
        where: {
          id: documentOriginInfo.created_by.id,
        },
      });

      const draftOther = new DraftRecord();
      draftOther.owner_unit = user.unit;
      draftOther.documentOriginInfo = documentOriginInfo;
      draftOther.draft_type = DraftType.Other;

      const status = await this.statusRepository.save({ draft: true });
      draftOther.status = status;

      await this.draftRecordRepository.save(draftOther);

      return {
        message: 'Other Draft Record created successfully !',
        draftOther,
      };
    } catch (error) {}
  }

  async findAllOther(user: User) {
    try {
      const draftOtherRecord = await this.draftRecordRepository.find({
        where: {
          owner_unit: {
            id: user.unit.id,
          },
          draft_type: DraftType.Other,
        },
        relations: {
          documentOriginInfo: true,
          request_transaction: {
            transaction_status: true,
          },
        },
      });
      if (!draftOtherRecord) {
        throw new NotFoundException('Draf Other Record not found !');
      }
      return draftOtherRecord;
    } catch (error) {
      throw error;
    }
  }

  async findOneOther(id: string) {
    try {
      const draftOtherRecord = await this.draftRecordRepository.findOne({
        where: {
          id,
        },
        relations: {
          documentOriginInfo: true,
        },
      });
      if (!draftOtherRecord) {
        throw new NotFoundException('Draft Self Record not found !');
      }
      return draftOtherRecord;
    } catch (error) {
      throw error;
    }
  }

  updateOther(id: string, updateDraftRecordDto: UpdateDraftRecordDto) {
    return `This action updates a #${id} draftRecord`;
  }

  async removeOther(id: string) {
    try {
      const draftOther = await this.draftRecordRepository.findOne({
        where: { id },
      });
      if (!draftOther) {
        throw new NotFoundException('Draft Other Record not found !');
      }

      await this.draftRecordRepository.remove(draftOther);
    } catch (error) {
      throw error;
    }
  }
}
