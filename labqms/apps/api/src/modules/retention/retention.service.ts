import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchivalEvent, RetentionPolicy } from '../../common/entities';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class RetentionService {
  constructor(
    @InjectRepository(RetentionPolicy)
    private readonly policies: Repository<RetentionPolicy>,
    @InjectRepository(ArchivalEvent)
    private readonly events: Repository<ArchivalEvent>,
    private readonly audit: AuditLogService,
  ) {}

  listPolicies() {
    return this.policies.find();
  }

  async createPolicy(data: Partial<RetentionPolicy>, actorId: string, ctx: any) {
    const policy = this.policies.create(data);
    const saved = await this.policies.save(policy);
    await this.audit.log({
      actorId,
      action: 'retention.policy.create',
      payload: { policyId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  listEvents() {
    return this.events.find();
  }

  async archiveRecord(data: Partial<ArchivalEvent>, actorId: string, ctx: any) {
    const event = this.events.create({
      ...data,
      archivedAt: new Date(),
    });
    const saved = await this.events.save(event);
    await this.audit.log({
      actorId,
      action: 'retention.archive',
      payload: { eventId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  async destroyRecord(id: string, actorId: string, ctx: any) {
    const event = await this.events.findOne({ where: { id } });
    if (!event) {
      return null;
    }
    event.destructionCertificate = {
      destroyedAt: new Date().toISOString(),
      approvedBy: actorId,
    };
    event.destroyedBy = actorId;
    await this.events.save(event);
    await this.audit.log({
      actorId,
      action: 'retention.destroy',
      payload: { eventId: event.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return event;
  }
}
