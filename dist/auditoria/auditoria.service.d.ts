import { Repository } from 'typeorm';
import { AuditoriaUsuario } from './entities/auditoria-usuario.entity';
import { AuditoriaAcceso } from './entities/auditoria-acceso.entity';
import { UserRole } from '../users/entities/user.entity';
export declare class AuditoriaService {
    private readonly userAuditRepository;
    private readonly accessAuditRepository;
    constructor(userAuditRepository: Repository<AuditoriaUsuario>, accessAuditRepository: Repository<AuditoriaAcceso>);
    registrarAccionUsuario(usuarioAfectadoId: number, usuarioAfectadoUsername: string, accion: string, ejecutorId: number | null, ejecutorUsername: string | null, detalles?: string): Promise<AuditoriaUsuario>;
    registrarAcceso(username: string, accion: string, ip: string, userAgent: string, detalles?: string): Promise<AuditoriaAcceso>;
    listarAuditoriaUsuarios(role: UserRole): Promise<AuditoriaUsuario[]>;
    listarAuditoriaAccesos(role: UserRole): Promise<AuditoriaAcceso[]>;
}
