import { Module } from '@nestjs/common';
import { MinioService } from './storage/minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class CommonModule {}
