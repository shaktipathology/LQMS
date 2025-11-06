import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities';
import argon2 from 'argon2';
import speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(email: string, password: string, totp?: string) {
    const user = await this.validateUser(email, password);
    if (user.totpEnabled) {
      if (!totp) {
        throw new UnauthorizedException('TOTP required');
      }
      const ok = speakeasy.totp.verify({
        secret: user.totpSecret!,
        token: totp,
        encoding: 'base32',
        window: 1,
      });
      if (!ok) {
        throw new UnauthorizedException('Invalid TOTP token');
      }
    }
    const payload = { sub: user.id, roleId: user.roleId };
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('jwt.secret'),
      expiresIn: this.config.get('jwt.expiresIn'),
    });
    return { token, user };
  }

  async setupTotp(userId: string, password: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException();
    const secret = speakeasy.generateSecret({ name: `LabQMS(${user.email})` });
    user.totpSecret = secret.base32;
    await this.users.save(user);
    return { otpauth: secret.otpauth_url };
  }

  async verifyTotp(userId: string, token: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || !user.totpSecret) throw new UnauthorizedException();
    const ok = speakeasy.totp.verify({
      secret: user.totpSecret,
      token,
      encoding: 'base32',
      window: 1,
    });
    if (!ok) throw new UnauthorizedException('Invalid token');
    user.totpEnabled = true;
    await this.users.save(user);
    return { enabled: true };
  }
}
