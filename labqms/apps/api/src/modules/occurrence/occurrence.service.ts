import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capa, Occurrence } from '../../common/entities';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class OccurrenceService {
  constructor(
    @InjectRepository(Occurrence)
    private readonly occurrences: Repository<Occurrence>,
    @InjectRepository(Capa)
    private readonly capas: Repository<Capa>,
    private readonly audit: AuditLogService,
  ) {}

  listOccurrences() {
    return this.occurrences.find();
  }

  async createOccurrence(data: Partial<Occurrence>, actorId: string, ctx: any) {
    const occurrence = this.occurrences.create({
      ...data,
      rootCause: data.rootCause || {},
    });
    occurrence.status = 'open';
    const saved = await this.occurrences.save(occurrence);
    await this.audit.log({
      actorId,
      action: 'occurrence.create',
      payload: { occurrenceId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  listCapas() {
    return this.capas.find();
  }

  async createCapa(data: Partial<Capa>, actorId: string, ctx: any) {
    const occurrence = await this.occurrences.findOne({ where: { id: data.occurrenceId || '' } });
    if (!occurrence) throw new NotFoundException('Occurrence not found');
    const capa = this.capas.create({
      ...data,
      actionPlan: data.actionPlan || {},
      status: 'open',
    });
    const saved = await this.capas.save(capa);
    await this.audit.log({
      actorId,
      action: 'capa.create',
      payload: { capaId: saved.id, occurrenceId: occurrence.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }
}
