import { IsString } from 'class-validator';

export class SignEntryDto {
  @IsString()
  meaning: string;

  @IsString()
  pin: string;
}
