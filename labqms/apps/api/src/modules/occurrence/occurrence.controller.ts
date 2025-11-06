import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OccurrenceService } from './occurrence.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class OccurrenceController {
  constructor(private readonly occurrence: OccurrenceService) {}

  @Get('occurrences')
  listOccurrences() {
    return this.occurrence.listOccurrences();
  }

  @Post('occurrences')
  createOccurrence(@Req() req: any, @Body() body: any) {
    return this.occurrence.createOccurrence(body, req.user.userId, req);
  }

  @Get('capas')
  listCapas() {
    return this.occurrence.listCapas();
  }

  @Post('capas')
  createCapa(@Req() req: any, @Body() body: any) {
    return this.occurrence.createCapa(body, req.user.userId, req);
  }
}
