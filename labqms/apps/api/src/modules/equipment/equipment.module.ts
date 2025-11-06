import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calibration, Equipment } from '../../common/entities';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment, Calibration]), AuditLogModule],
  providers: [EquipmentService],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
