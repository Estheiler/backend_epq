import { RegistroMacromedidorService } from './registro-macromedidor.service';
import { CreateRegistroMacromedidorDto } from './dto/create-registro-macromedidor.dto';
import { UpdateRegistroMacromedidorDto } from './dto/update-registro-macromedidor.dto';
export declare class RegistroMacromedidorController {
    private readonly service;
    constructor(service: RegistroMacromedidorService);
    create(createDto: CreateRegistroMacromedidorDto, operarioId: number): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/registro-macromedidor.entity").RegistroMacromedidor;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./entities/registro-macromedidor.entity").RegistroMacromedidor[];
    }>;
    findByDate(fecha: string): Promise<{
        success: boolean;
        data: import("./entities/registro-macromedidor.entity").RegistroMacromedidor[];
    }>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<{
        success: boolean;
        data: import("./entities/registro-macromedidor.entity").RegistroMacromedidor[];
    }>;
    findByMonth(anioStr: string, mesStr: string): Promise<{
        success: boolean;
        data: import("./entities/registro-macromedidor.entity").RegistroMacromedidor[];
    }>;
    getCurvesData(fechaInicio: string, fechaFin: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    update(id: number, updateDto: UpdateRegistroMacromedidorDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/registro-macromedidor.entity").RegistroMacromedidor;
    }>;
}
