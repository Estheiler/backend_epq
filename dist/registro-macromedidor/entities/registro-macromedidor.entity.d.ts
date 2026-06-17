import { User } from '../../users/entities/user.entity';
export declare class RegistroMacromedidor {
    id: number;
    fecha: string;
    hora: number;
    lectura_m3: number;
    consolidado_m3: number;
    consumo_acumulado_dia: number;
    operario_id: number;
    observaciones: string;
    createdBy: number;
    createdByUser?: User;
    updatedBy: number;
    created_at: Date;
    updatedAt: Date;
}
