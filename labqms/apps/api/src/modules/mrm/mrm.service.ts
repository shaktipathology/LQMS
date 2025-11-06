import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MrmMinute } from '../../common/entities';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class MrmService {
  constructor(
    @InjectRepository(MrmMinute)
    private readonly mrm: Repository<MrmMinute>,
    private readonly audit: AuditLogService,
  ) {}

  list() {
    return this.mrm.find();
  }

  async create(data: Partial<MrmMinute>, actorId: string, ctx: any) {
    const record = this.mrm.create(data);
    const saved = await this.mrm.save(record);
    await this.audit.log({
      actorId,
      action: 'mrm.create',
      payload: { meetingId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }
}
