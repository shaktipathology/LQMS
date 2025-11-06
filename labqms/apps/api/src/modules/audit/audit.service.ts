import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../../common/entities';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly audits: Repository<Audit>,
    private readonly auditLog: AuditLogService,
  ) {}

  list() {
    return this.audits.find();
  }

  async create(data: Partial<Audit>, actorId: string, ctx: any) {
    const audit = this.audits.create(data);
    const saved = await this.audits.save(audit);
    await this.auditLog.log({
      actorId,
      action: 'audit.create',
      payload: { auditId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }
}
