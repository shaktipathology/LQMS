import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditService } from './audit.service';

@UseGuards(AuthGuard('jwt'))
@Controller('audits')
export class AuditController {
  constructor(private readonly audits: AuditService) {}

  @Get()
  list() {
    return this.audits.list();
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.audits.create(body, req.user.userId, req);
  }
}
