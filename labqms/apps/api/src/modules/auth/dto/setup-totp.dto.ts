import { IsString } from 'class-validator';

export class SetupTotpDto {
  @IsString()
  password: string;
}
