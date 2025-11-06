import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EquipmentService } from './equipment.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class EquipmentController {
  constructor(private readonly equipment: EquipmentService) {}

  @Get('equipment')
  listEquipment() {
    return this.equipment.listEquipment();
  }

  @Post('equipment')
  createEquipment(@Req() req: any, @Body() body: any) {
    return this.equipment.createEquipment(body, req.user.userId, req);
  }

  @Get('calibrations')
  listCalibrations(@Query('equipmentId') equipmentId?: string) {
    return this.equipment.listCalibrations(equipmentId);
  }

  @Post('calibrations')
  addCalibration(@Req() req: any, @Body() body: any) {
    return this.equipment.addCalibration(body.equipmentId, body, req.user.userId, req);
  }
}
