import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type Response } from 'express';
import { JwtPayload } from './types/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_TOKEN_TTL: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET');
    this.JWT_TOKEN_TTL = configService.getOrThrow<string>('JWT_TOKEN_TTL');
  }

  // регистрация
  async register(dto: RegisterDto) {
    const { email, name, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new NotFoundException('Пользователь с такой почтой уже существует');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: await hash(password),
      },
    });

    return {
      email: user.email,
      name: user.name,
    };
  }

  // логин в аккаунт
  async login(res: Response, dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      throw new NotFoundException('Пользователь не найден');
    }

    // const { password: _, ...safeUser } = user;
    // return safeUser as Omit<typeof user, 'password'>;
    return this.auth(res, user);
  }

  async validate(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async changeAvartar(avatar: string, user: User) {
    console.log(user.id);
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar,
      },
      omit: {
        password: true,
      },
    });

    return updatedUser;
  }

  private auth(res: Response, user: User) {
    const { token } = this.generateToken(user.id);
    this.setCookie(res, token);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.createdAt,
        updatedd_at: user.updateddAt,
      },
    };
  }

  private generateToken(id: number) {
    const payload: JwtPayload = { id };

    const token = this.jwtService.sign(payload, {
      expiresIn: this.JWT_TOKEN_TTL,
    });

    return { token };
  }

  private setCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
      secure: false,
      sameSite: 'lax',
    });
  }
}
