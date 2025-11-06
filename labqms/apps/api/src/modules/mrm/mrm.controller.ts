import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MrmService } from './mrm.service';

@UseGuards(AuthGuard('jwt'))
@Controller('mrm')
export class MrmController {
  constructor(private readonly mrm: MrmService) {}

  @Get()
  list() {
    return this.mrm.list();
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.mrm.create(body, req.user.userId, req);
  }
}
