import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(private readonly config: ConfigService) {
    this.client = new Client({
      endPoint: this.config.get('minio.endPoint'),
      port: this.config.get('minio.port'),
      useSSL: this.config.get('minio.useSSL'),
      accessKey: this.config.get('minio.accessKey'),
      secretKey: this.config.get('minio.secretKey'),
    });
    this.bucket = this.config.get('minio.bucket');
    void this.ensureBucket();
  }

  private async ensureBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, '');
      }
    } catch (error) {
      this.logger.warn(`Bucket check failed: ${error}`);
    }
  }

  async uploadObject(key: string, data: Buffer, contentType: string) {
    await this.client.putObject(this.bucket, key, data, {
      'Content-Type': contentType,
    });
    return {
      key,
      url: `${this.config.get('minio.useSSL') ? 'https' : 'http'}://${this.config.get('minio.endPoint')}:${this.config.get('minio.port')}/${this.bucket}/${key}`,
    };
  }
}
