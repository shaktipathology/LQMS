import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, RegisterEntry, Capa, Audit } from '../../common/entities';
import { assessorPackSummary, clauseEvidence } from '@labqms/compliance';

@Injectable()
export class AssessorPackService {
  constructor(
    @InjectRepository(Document)
    private readonly documents: Repository<Document>,
    @InjectRepository(RegisterEntry)
    private readonly entries: Repository<RegisterEntry>,
    @InjectRepository(Capa)
    private readonly capas: Repository<Capa>,
    @InjectRepository(Audit)
    private readonly audits: Repository<Audit>,
  ) {}

  async build(from: string, to: string, scope: string) {
    const docs = await this.documents.find({ relations: ['versions'] });
    const filteredDocs = docs.filter((doc) =>
      doc.versions.some((version) => {
        const effective = version.effectiveFrom || version.createdAt.toISOString();
        return (!from || effective >= from) && (!to || effective <= to);
      }),
    );

    const registerEntries = await this.entries.find();
    const entriesWithinRange = registerEntries.filter((entry) => {
      const date = entry.data.date || entry.createdAt.toISOString();
      return (!from || date >= from) && (!to || date <= to);
    });

    const capas = await this.capas.find();
    const audits = await this.audits.find();

    const summary = assessorPackSummary([scope], {
      documents: filteredDocs.map((doc) => ({
        id: doc.id,
        type: 'document',
        reference: doc.code,
        description: doc.title,
        updatedAt: doc.updatedAt.toISOString(),
      })),
      registers: entriesWithinRange.map((entry) => ({
        id: entry.id,
        type: 'register-entry',
        reference: entry.definitionId,
        description: JSON.stringify(entry.data),
        updatedAt: entry.updatedAt.toISOString(),
      })),
      trainings: [],
      capas: capas.map((capa) => ({
        id: capa.id,
        type: 'capa',
        reference: capa.occurrenceId,
        description: JSON.stringify(capa.actionPlan),
        updatedAt: capa.updatedAt?.toISOString?.() || capa.createdAt.toISOString(),
      })),
    });

    return {
      from,
      to,
      scope,
      documents: filteredDocs,
      registers: entriesWithinRange,
      capas,
      audits,
      evidenceIndex: summary,
      clauseLibrary: clauseEvidence,
    };
  }
}
