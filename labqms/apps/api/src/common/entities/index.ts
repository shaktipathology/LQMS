import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  permissions: Record<string, boolean>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  totpSecret?: string;

  @Column({ default: false })
  totpEnabled: boolean;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ default: 'Asia/Kolkata' })
  timezone: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata: Record<string, any>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DocumentVersion, (v) => v.document)
  versions: DocumentVersion[];
}

@Entity('document_versions')
@Index(['documentId', 'version'], { unique: true })
export class DocumentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @ManyToOne(() => Document, (doc) => doc.versions)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'date', nullable: true })
  effectiveFrom?: string;

  @Column({ type: 'date', nullable: true })
  obsoleteOn?: string;

  @Column({ default: 'draft' })
  lifecycle: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  acknowledgements: Array<{ userId: string; acknowledgedAt: string }>;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('controlled_copies')
export class ControlledCopy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_version_id' })
  documentVersionId: string;

  @ManyToOne(() => DocumentVersion)
  @JoinColumn({ name: 'document_version_id' })
  version: DocumentVersion;

  @Column()
  issuedTo: string;

  @Column({ type: 'text' })
  qrToken: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  issuedAt: Date;
}

@Entity('register_definitions')
export class RegisterDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  stack: string;

  @Column({ type: 'jsonb' })
  schema: Record<string, any>;

  @Column({ type: 'jsonb' })
  workflow: Record<string, any>;

  @Column({ type: 'jsonb' })
  retention: Record<string, any>;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('register_entries')
export class RegisterEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'definition_id' })
  definitionId: string;

  @ManyToOne(() => RegisterDefinition)
  @JoinColumn({ name: 'definition_id' })
  definition: RegisterDefinition;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  signatures: Array<{
    userId: string;
    role: string;
    signedAt: string;
    meaning: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  identifier: string;

  @Column({ type: 'date', nullable: true })
  commissionDate?: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata: Record<string, any>;

  @Column({ default: true })
  inService: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('calibrations')
export class Calibration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Equipment)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @Column({ name: 'equipment_id' })
  equipmentId: string;

  @Column({ type: 'date' })
  performedOn: string;

  @Column({ type: 'date' })
  nextDue: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  certificate: Record<string, any>;

  @Column({ default: 'in-tolerance' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('occurrences')
export class Occurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  rootCause: Record<string, any>;

  @Column({ default: 'open' })
  status: string;

  @CreateDateColumn()
  reportedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('capas')
export class Capa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Occurrence)
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: Occurrence;

  @Column({ name: 'occurrence_id' })
  occurrenceId: string;

  @Column({ type: 'jsonb' })
  actionPlan: Record<string, any>;

  @Column({ type: 'date', nullable: true })
  dueDate?: string;

  @Column({ type: 'date', nullable: true })
  closedOn?: string;

  @Column({ default: 'open' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scope: string;

  @Column({ type: 'date' })
  plannedOn: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  checklist: Array<{ clause: string; question: string }>;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  findings: Array<{
    severity: string;
    description: string;
    capaId?: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('mrm_minutes')
export class MrmMinute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  meetingDate: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  agenda: Array<{ topic: string; owner: string }>;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  actions: Array<{ action: string; owner: string; dueDate: string; status: string }>;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('retention_policies')
export class RetentionPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recordType: string;

  @Column({ type: 'int' })
  retentionMonths: number;

  @Column({ default: false })
  legalHold: boolean;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  archivalTargets: Array<{ type: string; location: string }>;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('archival_events')
export class ArchivalEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recordType: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'timestamp' })
  archivedAt: Date;

  @Column({ nullable: true })
  destroyedBy?: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  destructionCertificate?: Record<string, any>;
}

@Entity('audit_log')
export class AuditLogEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorId: string;

  @Column()
  action: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  payload: Record<string, any>;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ type: 'text', nullable: true })
  previousHash?: string;

  @Column({ type: 'text' })
  hash: string;

  @CreateDateColumn()
  createdAt: Date;
}

export const ENTITIES = [
  Role,
  User,
  Document,
  DocumentVersion,
  ControlledCopy,
  RegisterDefinition,
  RegisterEntry,
  Equipment,
  Calibration,
  Occurrence,
  Capa,
  Audit,
  MrmMinute,
  RetentionPolicy,
  ArchivalEvent,
  AuditLogEntry,
];
