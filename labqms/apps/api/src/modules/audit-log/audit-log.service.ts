import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntry } from '../../common/entities';
import { computeHash } from '../../common/utils/hash-chain';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntry)
    private readonly repo: Repository<AuditLogEntry>,
  ) {}

  async log(options: {
    actorId: string;
    action: string;
    payload: Record<string, any>;
    ipAddress: string;
    userAgent: string;
  }): Promise<AuditLogEntry> {
    const lastEntry = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    const previousHash = lastEntry[0]?.hash;
    const timestamp = new Date().toISOString();
    const hash = computeHash({
      actorId: options.actorId,
      action: options.action,
      payload: options.payload,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      timestamp,
      previousHash,
    });

    const entry = this.repo.create({
      actorId: options.actorId,
      action: options.action,
      payload: options.payload,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      previousHash,
      hash,
    });
    return this.repo.save(entry);
  }
}
