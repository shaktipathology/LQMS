import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit, Capa, Document, RegisterEntry } from '../../common/entities';
import { AssessorPackService } from './assessor-pack.service';
import { AssessorPackController } from './assessor-pack.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      RegisterEntry,
      Capa,
      Audit,
    ]),
  ],
  providers: [AssessorPackService],
  controllers: [AssessorPackController],
})
export class AssessorPackModule {}
