import { Controller, Post, Body, UseGuards, Request, UsePipes, ValidationPipe, UseFilters, Res, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthExceptionFilter } from './auth-exception.filter';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(createUserDto);
    
    // Configurar cookie segura para cross-origin
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cambio importante
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // Retornar solo la información del usuario (sin el token)
    return {
      message: 'Usuario registrado exitosamente',
      user: result.user
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Request() req, @Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(req.user);
    
    // Configurar cookie segura para cross-origin
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cambio importante
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // Retornar solo la información del usuario (sin el token)
    return {
      message: 'Inicio de sesión exitoso',
      user: result.user
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    // Limpiar la cookie con las mismas opciones que se usaron para crearla
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cambio importante
      path: '/'
    });
    
    return { 
      message: 'Sesión cerrada exitosamente',
      authenticated: false,
      timestamp: new Date().toISOString()
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout/secure')
  @HttpCode(HttpStatus.OK)
  async secureLogout(@Request() req, @Res({ passthrough: true }) response: Response) {
    const userInfo = {
      userId: req.user.userId,
      correo: req.user.correo
    };

    // Limpiar la cookie con las mismas opciones que se usaron para crearla
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cambio importante
      path: '/'
    });
    
    return { 
      message: 'Sesión cerrada exitosamente',
      authenticated: false,
      lastUser: userInfo,
      timestamp: new Date().toISOString()
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user.userId);
    return {
      user,
      authenticated: true
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async checkAuthStatus(@Request() req) {
    return {
      authenticated: true,
      userId: req.user.userId,
      correo: req.user.correo
    };
  }
}