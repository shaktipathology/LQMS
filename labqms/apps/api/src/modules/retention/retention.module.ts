import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivalEvent, RetentionPolicy } from '../../common/entities';
import { RetentionService } from './retention.service';
import { RetentionController } from './retention.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([RetentionPolicy, ArchivalEvent]), AuditLogModule],
  providers: [RetentionService],
  controllers: [RetentionController],
})
export class RetentionModule {}
