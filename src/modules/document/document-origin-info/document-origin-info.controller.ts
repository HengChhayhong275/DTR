// document-origin-info.controller.ts


// import { Controller, Get, Query } from '@nestjs/common';
// import { DocumentOriginInfoService } from './document-origin-info.service';
// import { DocumentOriginInfo } from '../../../libs/database/entities/document-origin-info.entity';
// import { CreateDocumentOriginInfoDto } from './dto/create-document-origin-info.dto';

// @Controller('document-origin-info')
// export class DocumentOriginInfoController {
//   constructor(private readonly documentOriginInfoService: DocumentOriginInfoService) {}

//   @Get('filter')
//   async filterDocuments(@Query() filterDto: CreateDocumentOriginInfoDto): Promise<DocumentOriginInfo[]> {
//     return this.documentOriginInfoService.filterDocuments(filterDto);
//   }
// }

import { Controller, Get, Query, Param } from '@nestjs/common';
import { DocumentOriginInfoService } from './document-origin-info.service';

@Controller('documents')
export class DocumentOriginInfoController {
  constructor(private readonly documentOriginInfoService: DocumentOriginInfoService) {}

  @Get()
  async filterDocuments(
    @Query() filterDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { data, total } = await this.documentOriginInfoService.filterDocuments(filterDto, page, limit);
    return { data, total, page, limit };
  }
}

