import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentType } from 'src/libs/database/entities';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypesRepository: Repository<DocumentType>,
  ) { }

  async create(createDto: CreateDocumentTypeDto) {
    try {
      const newDocType = await this.documentTypesRepository.save(createDto)
      return {
        data: newDocType,
        message: "Document Type Created Successfully."
      };
    } catch (error) {
      console.log(error);
      if (error?.code === '23505') {
        throw new ForbiddenException({
          message: "Document Type is already taken."
        })
      }
      throw error
    }

  }

  async findAll() {
    return await this.documentTypesRepository.find()
  }

  async findOne(id: string) {
    const docType = await this.documentTypesRepository.findOne({
      where: {
        id: id
      }
    })
    if (!docType) {
      throw new NotFoundException({
        message: "Document Type Not Found."
      })
    }
    return docType;
  }

  async update(id: string, updateDto: UpdateDocumentTypeDto) {
    try {
      console.log(updateDto);
      await this.documentTypesRepository.update({
        id
      }, updateDto)
      return {
        message: "Document Type updated successfully."
      }
    } catch (error) {
      console.log(error);
      if (error?.code === '23505') {
        throw new ForbiddenException({
          message: "Doc Type is already exists."
        })
      }
      throw error
    }
  }

  remove(id: string) {
    return `This action removes a #${id} documentType`;
  }
}
