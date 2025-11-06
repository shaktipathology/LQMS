import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntry } from '../../common/entities';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntry])],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
