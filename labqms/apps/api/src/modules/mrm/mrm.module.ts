import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MrmMinute } from '../../common/entities';
import { MrmService } from './mrm.service';
import { MrmController } from './mrm.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([MrmMinute]), AuditLogModule],
  providers: [MrmService],
  controllers: [MrmController],
})
export class MrmModule {}
