import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from '../../common/entities';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Audit]), AuditLogModule],
  providers: [AuditService],
  controllers: [AuditController],
})
export class AuditModule {}
