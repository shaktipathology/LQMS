import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RegistersModule } from './modules/registers/registers.module';
import { QcModule } from './modules/qc/qc.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { OccurrenceModule } from './modules/occurrence/occurrence.module';
import { AuditModule } from './modules/audit/audit.module';
import { MrmModule } from './modules/mrm/mrm.module';
import { RetentionModule } from './modules/retention/retention.module';
import { AssessorPackModule } from './modules/assessor-pack/assessor-pack.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    DocumentsModule,
    RegistersModule,
    QcModule,
    EquipmentModule,
    OccurrenceModule,
    AuditModule,
    MrmModule,
    RetentionModule,
    AssessorPackModule,
    AuditLogModule,
    ComplianceModule,
  ],
})
export class AppModule {}
