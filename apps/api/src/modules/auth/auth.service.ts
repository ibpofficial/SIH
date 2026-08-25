import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginInput, RegisterInput, AuthResponse } from '@freightiq/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async login(loginDto: LoginInput): Promise<{ authResponse: AuthResponse; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.toLowerCase() },
      include: { organization: true }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    const passwordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, org: user.organizationId };
    const accessToken = this.jwtService.sign(payload);

    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
      'freightiq_super_secret_jwt_refresh_key_2026_sih26006'
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshTokenSecret,
      expiresIn: '7d'
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshTokenHash }
    });

    return {
      authResponse: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
          organizationId: user.organizationId,
          organizationName: user.organization.name
        }
      },
      refreshToken
    };
  }

  async register(registerDto: RegisterInput): Promise<{ authResponse: AuthResponse; refreshToken: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() }
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: registerDto.organizationId }
    });
    if (!org) {
      throw new BadRequestException('Specified organization does not exist');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase(),
        passwordHash,
        fullName: registerDto.fullName,
        role: registerDto.role,
        organizationId: registerDto.organizationId
      },
      include: { organization: true }
    });

    return this.login({ email: user.email, password: registerDto.password });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const refreshTokenSecret = this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
        'freightiq_super_secret_jwt_refresh_key_2026_sih26006'
      );
      const payload = this.jwtService.verify(refreshToken, { secret: refreshTokenSecret });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { organization: true }
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid session');
      }

      const isMatching = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatching) {
        throw new UnauthorizedException('Refresh token rotation check failed');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role, org: user.organizationId };
      const accessToken = this.jwtService.sign(newPayload);

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
          organizationId: user.organizationId,
          organizationName: user.organization.name
        }
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }
}
