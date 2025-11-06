import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SetupTotpDto } from './dto/setup-totp.dto';
import { VerifyTotpDto } from './dto/verify-totp.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password, dto.totp);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('totp/setup')
  async setup(@Req() req: any, @Body() dto: SetupTotpDto) {
    return this.auth.setupTotp(req.user.userId, dto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('totp/verify')
  async verify(@Req() req: any, @Body() dto: VerifyTotpDto) {
    return this.auth.verifyTotp(req.user.userId, dto.token);
  }
}
