import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDefinition, RegisterEntry } from '../../common/entities';
import { buildLeveyJenningsSeries, evaluateWestgardRules } from '@labqms/compliance';

@Injectable()
export class QcService {
  constructor(
    @InjectRepository(RegisterDefinition)
    private readonly definitions: Repository<RegisterDefinition>,
    @InjectRepository(RegisterEntry)
    private readonly entries: Repository<RegisterEntry>,
  ) {}

  async buildChart(registerCodeOrId: string, from: string, to: string, analyte?: string) {
    const definition = await this.definitions.findOne({
      where: [{ id: registerCodeOrId }, { code: registerCodeOrId }],
    });
    if (!definition) throw new NotFoundException('Register not found');

    const data = await this.entries.find({
      where: {
        definitionId: definition.id,
      },
      order: { createdAt: 'ASC' },
    });

    const filtered = data
      .map((entry) => ({ ...entry, date: entry.data.date }))
      .filter((entry) => (!from || entry.date >= from) && (!to || entry.date <= to));

    const seriesInput = filtered.map((entry) => ({
      date: entry.data.date,
      value: Number(entry.data.value),
      mean: Number(entry.data.mean || entry.data.target || 0),
      sd: Number(entry.data.sd || entry.data.standardDeviation || 1),
    }));

    const series = buildLeveyJenningsSeries(seriesInput);
    const violations = evaluateWestgardRules(seriesInput);

    return {
      definition: { id: definition.id, code: definition.code, name: definition.name },
      analyte,
      series,
      violations,
    };
  }
}
