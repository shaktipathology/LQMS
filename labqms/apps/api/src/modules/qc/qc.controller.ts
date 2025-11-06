import { Controller, Get, Param, Query } from '@nestjs/common';
import { QcService } from './qc.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('iqc')
export class QcController {
  constructor(private readonly qc: QcService) {}

  @Get(':registerId/chart')
  chart(
    @Param('registerId') registerId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('param') param?: string,
  ) {
    return this.qc.buildChart(registerId, from, to, param);
  }
}
