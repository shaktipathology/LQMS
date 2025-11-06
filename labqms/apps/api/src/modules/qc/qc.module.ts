import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterDefinition, RegisterEntry } from '../../common/entities';
import { QcService } from './qc.service';
import { QcController } from './qc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterDefinition, RegisterEntry])],
  controllers: [QcController],
  providers: [QcService],
})
export class QcModule {}
