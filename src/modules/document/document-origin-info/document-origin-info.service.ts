import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentOriginInfo } from '../../../libs/database/entities/document-origin-info.entity';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class DocumentOriginInfoService {
  constructor(
    @InjectRepository(DocumentOriginInfo)
    private readonly documentOriginInfoRepository: Repository<DocumentOriginInfo>,
  ) {}

  async filterDocuments(filterDto: FilterDto, page = 1, limit = 10): Promise<{ data: DocumentOriginInfo[]; total: number }> {
    const query = this.documentOriginInfoRepository.createQueryBuilder('document')
      .leftJoinAndSelect('document.documentType', 'documentType'); // Join with DocumentType

    if (filterDto.doc_given_number) {
      query.andWhere('(document.doc_given_number IS NULL OR document.doc_given_number = :doc_given_number)', { doc_given_number: filterDto.doc_given_number });
    }

    if (filterDto.summary) {
      query.andWhere('document.summary LIKE :summary', { summary: `%${filterDto.summary}%` });
    }

    if (filterDto.documentType) {
      query.andWhere('documentType.name IS NULL OR documentType.name = :documentType', { documentType: filterDto.documentType });
    }

    if (filterDto.createdAt) {
        query.andWhere('(document.createdAt >= :createdAt OR document.createdAt IS NULL)', { createdAt: filterDto.createdAt });
        query.orderBy('document.createdAt', 'DESC'); // Order by createdAt DESC
      }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}
