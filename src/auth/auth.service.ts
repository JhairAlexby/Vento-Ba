import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(correo);
    if (user && await bcrypt.compare(pass, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.correo);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    
    const user = await this.usersService.create(createUserDto);
    const { contrasena, ...userWithoutPassword } = user;
    return this.login(userWithoutPassword);
  }

  async login(user: any) {
    const payload = { correo: user.correo, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        correo: user.correo
      }
    };
  }
}