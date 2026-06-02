import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const result = await this.authService.login(loginDto, ip, userAgent);
    return {
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      success: true,
      data: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await this.authService.logout(req.user.username, ip, userAgent);
    return {
      success: true,
      message: 'Sesión cerrada exitosamente.',
    };
  }

  @Post('seed-first-admin')
  async seedFirstAdmin() {
    const count = await this.usersService.count();
    if (count > 0) {
      throw new ForbiddenException(
        'El sembrado inicial ya no está disponible porque ya existen usuarios registrados en el sistema.'
      );
    }

    const defaultSuperAdmin = await this.usersService.seed({
      username: 'superadmin',
      password: 'superadminCiudadela123',
      role: UserRole.SUPERADMIN,
    });

    return {
      success: true,
      message: 'Superadministrador inicial creado exitosamente.',
      data: {
        username: defaultSuperAdmin.username,
        role: defaultSuperAdmin.role,
        temp_password: 'superadminCiudadela123',
        warning: 'Por favor, cambie la contraseña después de iniciar sesión por primera vez.',
      },
    };
  }
}

