import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
export class AuditoriaController {
  constructor(private readonly service: AuditoriaService) {}

  @Get('usuarios')
  async getUsuariosAudit(@Request() req: any) {
    const data = await this.service.listarAuditoriaUsuarios(req.user.role);
    return {
      success: true,
      data,
    };
  }

  @Get('accesos')
  async getAccesosAudit(@Request() req: any) {
    const data = await this.service.listarAuditoriaAccesos(req.user.role);
    return {
      success: true,
      data,
    };
  }
}
