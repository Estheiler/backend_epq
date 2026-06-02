import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditoriaUsuario } from './entities/auditoria-usuario.entity';
import { AuditoriaAcceso } from './entities/auditoria-acceso.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(AuditoriaUsuario)
    private readonly userAuditRepository: Repository<AuditoriaUsuario>,
    @InjectRepository(AuditoriaAcceso)
    private readonly accessAuditRepository: Repository<AuditoriaAcceso>,
  ) {}

  async registrarAccionUsuario(
    usuarioAfectadoId: number,
    usuarioAfectadoUsername: string,
    accion: string,
    ejecutorId: number | null,
    ejecutorUsername: string | null,
    detalles?: string,
  ): Promise<AuditoriaUsuario> {
    const log = this.userAuditRepository.create({
      usuarioAfectadoId,
      usuarioAfectadoUsername,
      accion,
      ejecutorId,
      ejecutorUsername,
      detalles,
    });
    return this.userAuditRepository.save(log);
  }

  async registrarAcceso(
    username: string,
    accion: string,
    ip: string,
    userAgent: string,
    detalles?: string,
  ): Promise<AuditoriaAcceso> {
    const log = this.accessAuditRepository.create({
      username,
      accion,
      ip,
      userAgent,
      detalles,
    });
    return this.accessAuditRepository.save(log);
  }

  async listarAuditoriaUsuarios(role: UserRole): Promise<AuditoriaUsuario[]> {
    if (role === UserRole.SUPERADMIN) {
      return this.userAuditRepository.find({
        order: { fecha: 'DESC' },
      });
    }

    if (role === UserRole.ADMIN) {
      // Return logs where the affected user role is OPERARIO or HIDRAULICO
      return this.userAuditRepository
        .createQueryBuilder('audit')
        .innerJoin(User, 'user', 'audit.usuario_afectado_id = user.id')
        .where('user.role IN (:...roles)', { roles: [UserRole.OPERARIO, UserRole.HIDRAULICO] })
        .orderBy('audit.fecha', 'DESC')
        .getMany();
    }

    return [];
  }

  async listarAuditoriaAccesos(role: UserRole): Promise<AuditoriaAcceso[]> {
    if (role === UserRole.SUPERADMIN) {
      return this.accessAuditRepository.find({
        order: { fecha: 'DESC' },
      });
    }

    if (role === UserRole.ADMIN) {
      // Return access logs for users with roles OPERARIO or HIDRAULICO
      return this.accessAuditRepository
        .createQueryBuilder('audit')
        .innerJoin(User, 'user', 'audit.username = user.username')
        .where('user.role IN (:...roles)', { roles: [UserRole.OPERARIO, UserRole.HIDRAULICO] })
        .orderBy('audit.fecha', 'DESC')
        .getMany();
    }

    return [];
  }
}
