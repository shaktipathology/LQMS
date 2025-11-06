import { IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  code: string;

  @IsString()
  content: string;
}
