export interface RegisterWorkflowStep {
  name: string;
  role: string;
  transitions: string[];
}

export interface RetentionRule {
  retentionMonths: number;
  legalHold: boolean;
  archival: { target: string; location: string }[];
}

export interface RegisterDefinitionConfig {
  code: string;
  name: string;
  stack: string;
  schema: Record<string, any>;
  workflow: {
    initial: string;
    steps: RegisterWorkflowStep[];
  };
  retention: RetentionRule;
  sampleEntries: Record<string, any>[];
}

export const HEMATOLOGY_REGISTERS: RegisterDefinitionConfig[] = [
  {
    code: 'HEM-IQC-D-01',
    name: 'IQC Daily Log',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['date', 'level', 'analyte', 'value', 'mean', 'sd'],
      properties: {
        date: { type: 'string', format: 'date' },
        level: { type: 'string', enum: ['Level 1', 'Level 2'] },
        analyte: { type: 'string' },
        value: { type: 'number' },
        mean: { type: 'number' },
        sd: { type: 'number', minimum: 0.1 },
        instrument: { type: 'string' },
        comments: { type: 'string' },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Technologist', transitions: ['submitted'] },
        { name: 'submitted', role: 'Section Lead', transitions: ['verified'] },
        { name: 'verified', role: 'Quality Manager', transitions: ['signed'] },
        { name: 'signed', role: 'Quality Manager', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 36,
      legalHold: false,
      archival: [{ target: 'minio', location: 'iqc/daily' }],
    },
    sampleEntries: [
      {
        date: '2024-04-01',
        level: 'Level 1',
        analyte: 'Hemoglobin',
        value: 13.5,
        mean: 13.8,
        sd: 0.4,
        instrument: 'Sysmex XN-1000',
        comments: 'Within 1SD',
      },
    ],
  },
  {
    code: 'HEM-EQA-CYCLE',
    name: 'External Quality Assessment',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['cycle', 'provider', 'score', 'reportDate'],
      properties: {
        cycle: { type: 'string' },
        provider: { type: 'string' },
        score: { type: 'string' },
        reportDate: { type: 'string', format: 'date' },
        actions: { type: 'string' },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Technologist', transitions: ['submitted'] },
        { name: 'submitted', role: 'Section Lead', transitions: ['verified'] },
        { name: 'verified', role: 'Quality Manager', transitions: ['signed'] },
        { name: 'signed', role: 'Quality Manager', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 60,
      legalHold: false,
      archival: [{ target: 'minio', location: 'eqa' }],
    },
    sampleEntries: [
      {
        cycle: 'Q1 2024',
        provider: 'AIIMS-EQA',
        score: 'Satisfactory',
        reportDate: '2024-03-15',
        actions: 'No action required',
      },
    ],
  },
  {
    code: 'EQPT-MAINT-D',
    name: 'Equipment Maintenance',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['date', 'equipmentId', 'activity', 'performedBy', 'status'],
      properties: {
        date: { type: 'string', format: 'date' },
        equipmentId: { type: 'string' },
        activity: { type: 'string' },
        performedBy: { type: 'string' },
        status: { type: 'string', enum: ['OK', 'Requires Follow-up'] },
        remarks: { type: 'string' },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Technologist', transitions: ['submitted'] },
        { name: 'submitted', role: 'Section Lead', transitions: ['verified'] },
        { name: 'verified', role: 'Quality Manager', transitions: ['signed'] },
        { name: 'signed', role: 'Quality Manager', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 120,
      legalHold: true,
      archival: [{ target: 'minio', location: 'equipment/maintenance' }],
    },
    sampleEntries: [
      {
        date: '2024-04-02',
        equipmentId: 'XN1000-001',
        activity: 'Monthly clean',
        performedBy: 'Technologist A',
        status: 'OK',
        remarks: 'All checks passed',
      },
    ],
  },
  {
    code: 'NC-CAPA',
    name: 'Nonconformity & CAPA',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['date', 'description', 'rootCause', 'action', 'dueDate'],
      properties: {
        date: { type: 'string', format: 'date' },
        description: { type: 'string' },
        rootCause: { type: 'string' },
        action: { type: 'string' },
        dueDate: { type: 'string', format: 'date' },
        effectiveness: { type: 'string' },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Technologist', transitions: ['submitted'] },
        { name: 'submitted', role: 'Quality Manager', transitions: ['verified'] },
        { name: 'verified', role: 'Quality Manager', transitions: ['signed'] },
        { name: 'signed', role: 'Quality Manager', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 84,
      legalHold: true,
      archival: [{ target: 'minio', location: 'capa' }],
    },
    sampleEntries: [
      {
        date: '2024-03-20',
        description: 'Sample mislabeling',
        rootCause: 'Training gap',
        action: 'Conduct retraining using 5-Why analysis',
        dueDate: '2024-04-05',
        effectiveness: 'Pending review',
      },
    ],
  },
  {
    code: 'AUDIT-INT',
    name: 'Internal Audit Findings',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['auditDate', 'auditor', 'clause', 'finding', 'status'],
      properties: {
        auditDate: { type: 'string', format: 'date' },
        auditor: { type: 'string' },
        clause: { type: 'string' },
        finding: { type: 'string' },
        status: { type: 'string', enum: ['Open', 'Closed'] },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Auditor', transitions: ['submitted'] },
        { name: 'submitted', role: 'Quality Manager', transitions: ['verified'] },
        { name: 'verified', role: 'Quality Manager', transitions: ['signed'] },
        { name: 'signed', role: 'Quality Manager', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 72,
      legalHold: false,
      archival: [{ target: 'minio', location: 'audits/internal' }],
    },
    sampleEntries: [
      {
        auditDate: '2024-02-11',
        auditor: 'Dr. Sharma',
        clause: 'ISO 15189:2022 - 8.3',
        finding: 'Controlled copy register missing signature',
        status: 'Open',
      },
    ],
  },
  {
    code: 'MRM-MINUTES',
    name: 'Management Review Minutes',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['meetingDate', 'agenda', 'actions'],
      properties: {
        meetingDate: { type: 'string', format: 'date' },
        agenda: {
          type: 'array',
          items: { type: 'object', properties: { topic: { type: 'string' }, owner: { type: 'string' } } },
        },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              action: { type: 'string' },
              owner: { type: 'string' },
              dueDate: { type: 'string', format: 'date' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Quality Manager', transitions: ['submitted'] },
        { name: 'submitted', role: 'Lab Director', transitions: ['signed'] },
        { name: 'signed', role: 'Lab Director', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 120,
      legalHold: true,
      archival: [{ target: 'minio', location: 'mrm' }],
    },
    sampleEntries: [
      {
        meetingDate: '2024-01-31',
        agenda: [
          { topic: 'Review IQC trends', owner: 'Section Lead' },
          { topic: 'Assess CAPA effectiveness', owner: 'Quality Manager' },
        ],
        actions: [
          {
            action: 'Deploy refresher training for hematology bench',
            owner: 'Technologist Lead',
            dueDate: '2024-03-01',
            status: 'In progress',
          },
        ],
      },
    ],
  },
  {
    code: 'TRAIN-COMP',
    name: 'Training & Competency',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['staff', 'training', 'trainer', 'date', 'status'],
      properties: {
        staff: { type: 'string' },
        training: { type: 'string' },
        trainer: { type: 'string' },
        date: { type: 'string', format: 'date' },
        status: { type: 'string', enum: ['Scheduled', 'Completed'] },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Quality Manager', transitions: ['submitted'] },
        { name: 'submitted', role: 'Lab Director', transitions: ['signed'] },
        { name: 'signed', role: 'Lab Director', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 84,
      legalHold: false,
      archival: [{ target: 'minio', location: 'training' }],
    },
    sampleEntries: [
      {
        staff: 'Technologist B',
        training: 'Westgard rules refresher',
        trainer: 'Quality Manager',
        date: '2024-02-05',
        status: 'Completed',
      },
    ],
  },
  {
    code: 'COMPLAINTS',
    name: 'Complaint Handling',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['date', 'complainant', 'issue', 'resolution'],
      properties: {
        date: { type: 'string', format: 'date' },
        complainant: { type: 'string' },
        issue: { type: 'string' },
        resolution: { type: 'string' },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Quality Manager', transitions: ['submitted'] },
        { name: 'submitted', role: 'Lab Director', transitions: ['signed'] },
        { name: 'signed', role: 'Lab Director', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 60,
      legalHold: true,
      archival: [{ target: 'minio', location: 'complaints' }],
    },
    sampleEntries: [
      {
        date: '2024-04-01',
        complainant: 'Ward 5',
        issue: 'Delayed CBC report',
        resolution: 'Root cause identified as analyzer downtime; backup plan triggered',
      },
    ],
  },
  {
    code: 'REF-LAB',
    name: 'Referral Laboratory Tracking',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['date', 'test', 'refLab', 'reason', 'tat'],
      properties: {
        date: { type: 'string', format: 'date' },
        test: { type: 'string' },
        refLab: { type: 'string' },
        reason: { type: 'string' },
        tat: { type: 'number', minimum: 0 },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Technologist', transitions: ['submitted'] },
        { name: 'submitted', role: 'Section Lead', transitions: ['signed'] },
        { name: 'signed', role: 'Section Lead', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 36,
      legalHold: false,
      archival: [{ target: 'minio', location: 'ref-lab' }],
    },
    sampleEntries: [
      {
        date: '2024-03-10',
        test: 'Flow cytometry',
        refLab: 'External Centre A',
        reason: 'Specialised equipment required',
        tat: 48,
      },
    ],
  },
  {
    code: 'TAT-DAILY',
    name: 'Daily Turnaround Time',
    stack: 'Hematology',
    schema: {
      type: 'object',
      required: ['date', 'samples', 'withinTat', 'outsideTat'],
      properties: {
        date: { type: 'string', format: 'date' },
        samples: { type: 'number', minimum: 0 },
        withinTat: { type: 'number', minimum: 0 },
        outsideTat: { type: 'number', minimum: 0 },
        comments: { type: 'string' },
      },
    },
    workflow: {
      initial: 'draft',
      steps: [
        { name: 'draft', role: 'Technologist', transitions: ['submitted'] },
        { name: 'submitted', role: 'Section Lead', transitions: ['signed'] },
        { name: 'signed', role: 'Section Lead', transitions: [] },
      ],
    },
    retention: {
      retentionMonths: 24,
      legalHold: false,
      archival: [{ target: 'minio', location: 'tat' }],
    },
    sampleEntries: [
      {
        date: '2024-04-05',
        samples: 120,
        withinTat: 115,
        outsideTat: 5,
        comments: 'Analyzer preventive maintenance caused minor delay',
      },
    ],
  },
];

export const DEFAULT_STACKS = ['Hematology'];
