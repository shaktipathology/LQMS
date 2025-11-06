import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ControlledCopy, Document, DocumentVersion } from '../../common/entities';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateLifecycleDto } from './dto/update-lifecycle.dto';
import { ControlledCopyService } from './controlled-copy.service';
import { MinioService } from '../../common/storage/minio.service';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documents: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private readonly versions: Repository<DocumentVersion>,
    @InjectRepository(ControlledCopy)
    private readonly copies: Repository<ControlledCopy>,
    private readonly pdfService: ControlledCopyService,
    private readonly storage: MinioService,
    private readonly audit: AuditLogService,
  ) {}

  async list() {
    return this.documents.find({ relations: ['versions'] });
  }

  async create(dto: CreateDocumentDto, ownerId: string, ctx: any) {
    const document = this.documents.create({
      title: dto.title,
      code: dto.code,
      ownerId,
      status: 'draft',
    });
    const saved = await this.documents.save(document);
    const version = this.versions.create({
      documentId: saved.id,
      version: 1,
      content: dto.content,
      lifecycle: 'draft',
    });
    await this.versions.save(version);
    await this.audit.log({
      actorId: ownerId,
      action: 'document.create',
      payload: { documentId: saved.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return saved;
  }

  async updateLifecycle(
    documentId: string,
    dto: UpdateLifecycleDto,
    actorId: string,
    ctx: any,
  ) {
    const version = await this.versions.findOne({
      where: { documentId },
      order: { version: 'DESC' },
      relations: ['document'],
    });
    if (!version) throw new NotFoundException('Document version not found');
    version.lifecycle = dto.lifecycle;
    version.effectiveFrom = dto.effectiveFrom;
    if (dto.lifecycle === 'obsolete') {
      version.obsoleteOn = new Date().toISOString().slice(0, 10);
    }
    await this.versions.save(version);
    await this.documents.update(documentId, { status: dto.lifecycle });
    await this.audit.log({
      actorId,
      action: 'document.lifecycle',
      payload: { documentId, lifecycle: dto.lifecycle },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return version;
  }

  async issueControlledCopy(
    documentId: string,
    issuedTo: string,
    actorId: string,
    ctx: any,
  ) {
    const version = await this.versions.findOne({
      where: { documentId },
      order: { version: 'DESC' },
      relations: ['document'],
    });
    if (!version) throw new NotFoundException('Document version not found');
    const pdf = await this.pdfService.renderPdf({
      documentTitle: version.document?.title || 'Document',
      documentCode: version.document?.code || version.documentId,
      version: version.version,
      lifecycle: version.lifecycle,
      content: version.content,
      issuedTo,
      issueDate: new Date().toISOString().slice(0, 10),
      canonicalUrl: `${process.env.PUBLIC_BASE_URL || 'http://localhost:4000'}/documents/${documentId}`,
    });
    const key = `controlled-copies/${documentId}/${Date.now()}.pdf`;
    const uploaded = await this.storage.uploadObject(key, pdf, 'application/pdf');
    const copy = this.copies.create({
      documentVersionId: version.id,
      issuedTo,
      qrToken: uploaded.url,
      active: true,
    });
    await this.copies.save(copy);
    await this.audit.log({
      actorId,
      action: 'document.issue',
      payload: { documentId, issuedTo, copyId: copy.id },
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent'] || 'n/a',
    });
    return { copy, pdfUrl: uploaded.url };
  }
}
