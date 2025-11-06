import { IsString } from 'class-validator';

export class VerifyTotpDto {
  @IsString()
  token: string;
}
