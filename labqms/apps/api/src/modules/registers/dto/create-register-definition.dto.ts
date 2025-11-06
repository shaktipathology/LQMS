import { IsBoolean, IsObject, IsString } from 'class-validator';

export class CreateRegisterDefinitionDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  stack: string;

  @IsObject()
  schema: Record<string, any>;

  @IsObject()
  workflow: Record<string, any>;

  @IsObject()
  retention: Record<string, any>;

  @IsBoolean()
  active: boolean;
}
