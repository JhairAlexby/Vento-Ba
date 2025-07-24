import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ 
      usernameField: 'correo',
      passwordField: 'contrasena'
    });
  }

  async validate(correo: string, contrasena: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(correo, contrasena);
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error en la autenticación');
    }
  }
}