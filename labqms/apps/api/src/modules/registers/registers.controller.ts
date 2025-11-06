import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistersService } from './registers.service';
import { CreateRegisterDefinitionDto } from './dto/create-register-definition.dto';
import { CreateRegisterEntryDto } from './dto/create-register-entry.dto';
import { SignEntryDto } from './dto/sign-entry.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class RegistersController {
  constructor(private readonly registers: RegistersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('registers')
  listDefinitions() {
    return this.registers.listDefinitions();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('registers')
  createDefinition(@Req() req: any, @Body() dto: CreateRegisterDefinitionDto) {
    return this.registers.createDefinition(dto, req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('registers/:id/entries')
  listEntries(@Param('id') id: string) {
    return this.registers.listEntries(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('registers/:id/entries')
  createEntry(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CreateRegisterEntryDto,
  ) {
    return this.registers.createEntry(id, dto, req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('entries/:id/submit')
  submit(@Param('id') id: string, @Req() req: any) {
    return this.registers.updateStatus(id, 'submitted', req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('entries/:id/verify')
  verify(@Param('id') id: string, @Req() req: any) {
    return this.registers.updateStatus(id, 'verified', req.user.userId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('entries/:id/sign')
  sign(@Param('id') id: string, @Req() req: any, @Body() dto: SignEntryDto) {
    return this.registers.signEntry(id, req.user.userId, dto, req);
  }
}
