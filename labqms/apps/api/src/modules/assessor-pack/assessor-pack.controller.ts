import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssessorPackService } from './assessor-pack.service';

@UseGuards(AuthGuard('jwt'))
@Controller('assessor-pack')
export class AssessorPackController {
  constructor(private readonly pack: AssessorPackService) {}

  @Get()
  build(@Query('from') from: string, @Query('to') to: string, @Query('scope') scope: string) {
    return this.pack.build(from, to, scope);
  }
}
