import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterDefinition, RegisterEntry, User } from '../../common/entities';
import { RegistersService } from './registers.service';
import { RegistersController } from './registers.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterDefinition, RegisterEntry, User]), AuditLogModule],
  controllers: [RegistersController],
  providers: [RegistersService],
})
export class RegistersModule {}
