import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ControlledCopy,
  Document,
  DocumentVersion,
} from '../../common/entities';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ControlledCopyService } from './controlled-copy.service';
import { CommonModule } from '../../common/common.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, DocumentVersion, ControlledCopy]),
    CommonModule,
    AuditLogModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, ControlledCopyService],
})
export class DocumentsModule {}
