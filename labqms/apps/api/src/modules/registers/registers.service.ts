import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import argon2 from 'argon2';
import {
  RegisterDefinition,
  RegisterEntry,
  User,
} from '../../common/entities';
import { Repository } from 'typeorm';
import { CreateRegisterDefinitionDto } from './dto/create-register-definition.dto';
import { CreateRegisterEntryDto } from './dto/create-register-entry.dto';
import { SignEntryDto } from './dto/sign-entry.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

@Injectable()
export class RegistersService {
  constructor(
    @InjectRepository(RegisterDefinition)
    private readonly definitions: Repository<RegisterDefinition>,
    @InjectRepository(RegisterEntry)
    private readonly entries: Repository<RegisterEntry>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly audit: AuditLogService,
  ) {}

  listDefinitions() {
    return this.definitions.find();
  }

  async createDefinition(dto: CreateRegisterDefinitionDto, actorId: string, ctx: any) {
    const definition = this.definitions.create(dto);
    const saved = await this.definitions.save(definition);
    await this.audit.log({
      actorId,
      action: 'register.definition.create',
      payload: { definitionId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  async listEntries(definitionId: string) {
    return this.entries.find({ where: { definitionId } });
  }

  async createEntry(
    definitionId: string,
    dto: CreateRegisterEntryDto,
    actorId: string,
    ctx: any,
  ) {
    const definition = await this.definitions.findOne({ where: { id: definitionId } });
    if (!definition) throw new NotFoundException('Register not found');
    const validate = ajv.compile(definition.schema);
    if (!validate(dto.data)) {
      throw new BadRequestException(`Validation failed: ${ajv.errorsText(validate.errors)}`);
    }
    const entry = this.entries.create({
      definitionId,
      data: dto.data,
      status: 'draft',
    });
    const saved = await this.entries.save(entry);
    await this.audit.log({
      actorId,
      action: 'register.entry.create',
      payload: { definitionId, entryId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  async updateStatus(entryId: string, status: string, actorId: string, ctx: any) {
    const entry = await this.entries.findOne({ where: { id: entryId } });
    if (!entry) throw new NotFoundException('Entry not found');
    entry.status = status;
    await this.entries.save(entry);
    await this.audit.log({
      actorId,
      action: `register.entry.${status}`,
      payload: { entryId },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return entry;
  }

  async signEntry(entryId: string, actorId: string, dto: SignEntryDto, ctx: any) {
    const entry = await this.entries.findOne({ where: { id: entryId } });
    if (!entry) throw new NotFoundException('Entry not found');
    const user = await this.users.findOne({ where: { id: actorId }, relations: ['role'] });
    if (!user) throw new UnauthorizedException();
    const valid = await argon2.verify(user.passwordHash, dto.pin);
    if (!valid) throw new UnauthorizedException('Invalid PIN');
    entry.signatures = [
      ...(entry.signatures || []),
      {
        userId: actorId,
        role: user.role?.name || 'User',
        signedAt: new Date().toISOString(),
        meaning: dto.meaning,
      },
    ];
    entry.status = 'signed';
    await this.entries.save(entry);
    await this.audit.log({
      actorId,
      action: 'register.entry.sign',
      payload: { entryId, meaning: dto.meaning },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return entry;
  }
}
