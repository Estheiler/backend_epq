import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditoriaService: AuditoriaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      await this.auditoriaService.registrarAcceso(
        username,
        'LOGIN_FALLIDO',
        ip,
        userAgent,
        'Nombre de usuario o contraseña incorrectos.'
      );
      throw new UnauthorizedException('Nombre de usuario o contraseña incorrectos.');
    }

    if (!user.isActive) {
      await this.auditoriaService.registrarAcceso(
        username,
        'LOGIN_FALLIDO',
        ip,
        userAgent,
        'Cuenta desactivada.'
      );
      throw new UnauthorizedException('Su cuenta está desactivada. Contacte al administrador.');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    
    await this.auditoriaService.registrarAcceso(
      user.username,
      'LOGIN_EXITOSO',
      ip,
      userAgent,
      `Inicio de sesión exitoso. Rol: ${user.role}`
    );

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async logout(username: string, ip: string, userAgent: string) {
    await this.auditoriaService.registrarAcceso(
      username,
      'LOGOUT',
      ip,
      userAgent,
      'Cierre de sesión del usuario.'
    );
  }
}

