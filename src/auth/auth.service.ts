import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string): Promise<any> {
    if (!correo || !contrasena) {
      throw new BadRequestException('Correo y contraseña son requeridos');
    }

    try {
      const user = await this.usersService.findByEmail(correo);
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isPasswordValid) {
        return null;
      }

      const { contrasena: _, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Error en la validación del usuario');
    }
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.correo);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    
    try {
      const user = await this.usersService.create(createUserDto);
      const { contrasena, ...userWithoutPassword } = user;
      return this.login(userWithoutPassword);
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async login(user: any) {
    if (!user || !user.id || !user.correo) {
      throw new UnauthorizedException('Datos de usuario inválidos');
    }

    try {
      const payload = { correo: user.correo, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          nombreCompleto: user.nombreCompleto,
          correo: user.correo
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Error al generar el token de acceso');
    }
  }

  async getProfile(userId: string) {
    try {
      return await this.usersService.findOne(userId);
    } catch (error) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
  }
}