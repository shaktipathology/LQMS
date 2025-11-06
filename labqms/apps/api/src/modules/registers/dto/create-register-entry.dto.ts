import { IsObject } from 'class-validator';

export class CreateRegisterEntryDto {
  @IsObject()
  data: Record<string, any>;
}
