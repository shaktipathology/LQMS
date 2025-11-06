import dayjs from 'dayjs';

type EvidenceRecord = {
  id: string;
  type: string;
  reference: string;
  description: string;
  updatedAt: string;
};

type ClauseMap = Record<string, EvidenceRecord[]>;

export const clauseEvidence: ClauseMap = {
  'ISO 15189:2022 - 8.3 Document Control': [
    {
      id: 'doc-lifecycle',
      type: 'procedure',
      reference: 'SOP-DC-001',
      description: 'Document lifecycle approvals tracked in system',
      updatedAt: dayjs().toISOString(),
    },
  ],
  'ISO 15189:2022 - 8.4 Control of Records': [
    {
      id: 'retention-policy',
      type: 'record',
      reference: 'RET-001',
      description: 'Retention matrix for all hematology registers',
      updatedAt: dayjs().toISOString(),
    },
  ],
  'NABL medical testing requirements (latest)': [
    {
      id: 'capa-trace',
      type: 'record',
      reference: 'NC-CAPA',
      description: 'Corrective actions linked to internal audit findings',
      updatedAt: dayjs().toISOString(),
    },
  ],
};

export interface QcDataPoint {
  date: string;
  value: number;
  mean: number;
  sd: number;
}

type RuleResult = {
  rule: string;
  violated: boolean;
  points: number[];
  description: string;
};

const ruleDescriptions: Record<string, string> = {
  '1_2s': 'One point beyond 2 SD warning',
  '1_3s': 'One point beyond 3 SD rejection',
  '2_2s': 'Two consecutive beyond 2 SD on same side',
  R_4s: 'Range of two points is 4 SD (opposite sides)',
  '4_1s': 'Four consecutive beyond 1 SD same side',
  '10_x': 'Ten consecutive points on same side of mean',
};

export const evaluateWestgardRules = (data: QcDataPoint[]): RuleResult[] => {
  const results: RuleResult[] = [];
  const values = data.map((d) => ({
    value: d.value,
    mean: d.mean,
    sd: d.sd,
  }));

  const checkRule = (rule: string, violated: boolean, points: number[]) => {
    results.push({
      rule,
      violated,
      points,
      description: ruleDescriptions[rule],
    });
  };

  values.forEach((point, idx) => {
    const z = (point.value - point.mean) / point.sd;
    if (Math.abs(z) >= 3) {
      checkRule('1_3s', true, [idx]);
    } else if (Math.abs(z) >= 2) {
      checkRule('1_2s', true, [idx]);
    }
  });

  for (let i = 1; i < values.length; i++) {
    const current = (values[i].value - values[i].mean) / values[i].sd;
    const prev = (values[i - 1].value - values[i - 1].mean) / values[i - 1].sd;
    if (Math.abs(current) >= 2 && Math.abs(prev) >= 2 && Math.sign(current) === Math.sign(prev)) {
      checkRule('2_2s', true, [i - 1, i]);
    }
    if (Math.abs(current - prev) >= 4) {
      checkRule('R_4s', true, [i - 1, i]);
    }
  }

  for (let i = 3; i < values.length; i++) {
    const window = values.slice(i - 3, i + 1).map((p) => (p.value - p.mean) / p.sd);
    if (window.every((z) => Math.abs(z) >= 1 && Math.sign(z) === Math.sign(window[0]))) {
      checkRule('4_1s', true, [i - 3, i - 2, i - 1, i]);
    }
  }

  for (let i = 9; i < values.length; i++) {
    const window = values.slice(i - 9, i + 1).map((p) => (p.value - p.mean) / p.sd);
    const allPositive = window.every((z) => z > 0);
    const allNegative = window.every((z) => z < 0);
    if (allPositive || allNegative) {
      checkRule('10_x', true, Array.from({ length: 10 }, (_, j) => i - 9 + j));
    }
  }

  return results;
};

export const buildLeveyJenningsSeries = (data: QcDataPoint[]) => {
  return {
    data,
    meanSeries: data.map((point) => ({ date: point.date, value: point.mean })),
    plus1sd: data.map((point) => ({ date: point.date, value: point.mean + point.sd })),
    minus1sd: data.map((point) => ({ date: point.date, value: point.mean - point.sd })),
    plus2sd: data.map((point) => ({ date: point.date, value: point.mean + 2 * point.sd })),
    minus2sd: data.map((point) => ({ date: point.date, value: point.mean - 2 * point.sd })),
    plus3sd: data.map((point) => ({ date: point.date, value: point.mean + 3 * point.sd })),
    minus3sd: data.map((point) => ({ date: point.date, value: point.mean - 3 * point.sd })),
  };
};

export const assessorPackSummary = (
  scope: string[],
  data: {
    documents: EvidenceRecord[];
    registers: EvidenceRecord[];
    trainings: EvidenceRecord[];
    capas: EvidenceRecord[];
  },
) => {
  const report: Record<string, EvidenceRecord[]> = {};
  scope.forEach((clause) => {
    report[clause] = [
      ...(clauseEvidence[clause] || []),
      ...data.documents,
      ...data.registers,
      ...data.trainings,
      ...data.capas,
    ];
  });
  return report;
};

export type ClauseEvidenceIndex = ReturnType<typeof assessorPackSummary>;
