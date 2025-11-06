import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capa, Occurrence } from '../../common/entities';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceController } from './occurrence.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence, Capa]), AuditLogModule],
  providers: [OccurrenceService],
  controllers: [OccurrenceController],
})
export class OccurrenceModule {}
