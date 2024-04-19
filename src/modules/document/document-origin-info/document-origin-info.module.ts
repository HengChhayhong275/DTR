// document-origin-info.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentOriginInfo } from '../../../libs/database/entities/document-origin-info.entity';
import { DocumentOriginInfoService } from './document-origin-info.service';
import { DocumentOriginInfoController } from './document-origin-info.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DocumentOriginInfo])],
    providers: [DocumentOriginInfoService],
    controllers: [DocumentOriginInfoController], // Declare the controller
    exports: [DocumentOriginInfoService],
  })
  export class DocumentOriginInfoModule {}
