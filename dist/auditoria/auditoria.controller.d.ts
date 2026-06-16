import { AuditoriaService } from './auditoria.service';
export declare class AuditoriaController {
    private readonly service;
    constructor(service: AuditoriaService);
    getUsuariosAudit(req: any): Promise<{
        success: boolean;
        data: import("./entities/auditoria-usuario.entity").AuditoriaUsuario[];
    }>;
    getAccesosAudit(req: any): Promise<{
        success: boolean;
        data: import("./entities/auditoria-acceso.entity").AuditoriaAcceso[];
    }>;
}
