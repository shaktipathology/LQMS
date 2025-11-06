import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calibration, Equipment } from '../../common/entities';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
    @InjectRepository(Calibration)
    private readonly calibrationRepo: Repository<Calibration>,
    private readonly audit: AuditLogService,
  ) {}

  listEquipment() {
    return this.equipmentRepo.find();
  }

  async createEquipment(data: Partial<Equipment>, actorId: string, ctx: any) {
    const equipment = this.equipmentRepo.create(data);
    const saved = await this.equipmentRepo.save(equipment);
    await this.audit.log({
      actorId,
      action: 'equipment.create',
      payload: { equipmentId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  async addCalibration(
    equipmentId: string,
    data: Partial<Calibration>,
    actorId: string,
    ctx: any,
  ) {
    const equipment = await this.equipmentRepo.findOne({ where: { id: equipmentId } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    const calibration = this.calibrationRepo.create({
      ...data,
      equipmentId,
    });
    const saved = await this.calibrationRepo.save(calibration);
    await this.audit.log({
      actorId,
      action: 'equipment.calibration.add',
      payload: { equipmentId, calibrationId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  listCalibrations(equipmentId?: string) {
    if (equipmentId) {
      return this.calibrationRepo.find({ where: { equipmentId } });
    }
    return this.calibrationRepo.find();
  }
}
