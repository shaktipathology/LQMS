import { IsDateString, IsString } from 'class-validator';

export class UpdateLifecycleDto {
  @IsString()
  lifecycle: 'reviewed' | 'approved' | 'effective' | 'obsolete';

  @IsDateString()
  effectiveFrom: string;
}
