import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RetentionService } from './retention.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class RetentionController {
  constructor(private readonly retention: RetentionService) {}

  @Get('retention-policies')
  listPolicies() {
    return this.retention.listPolicies();
  }

  @Post('retention-policies')
  createPolicy(@Req() req: any, @Body() body: any) {
    return this.retention.createPolicy(body, req.user.userId, req);
  }

  @Get('retention-events')
  listEvents() {
    return this.retention.listEvents();
  }

  @Post('records/archive')
  archive(@Req() req: any, @Body() body: any) {
    return this.retention.archiveRecord(body, req.user.userId, req);
  }

  @Post('records/destroy')
  destroy(@Req() req: any, @Body('id') id: string) {
    return this.retention.destroyRecord(id, req.user.userId, req);
  }
}
