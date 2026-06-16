import { Repository } from 'typeorm';
import { RegistroMacromedidor } from './entities/registro-macromedidor.entity';
import { CreateRegistroMacromedidorDto } from './dto/create-registro-macromedidor.dto';
import { UpdateRegistroMacromedidorDto } from './dto/update-registro-macromedidor.dto';
export declare class RegistroMacromedidorService {
    private readonly repository;
    constructor(repository: Repository<RegistroMacromedidor>);
    create(createDto: CreateRegistroMacromedidorDto, operarioId: number): Promise<RegistroMacromedidor>;
    private handleSubsequentRecalculation;
    findAll(): Promise<RegistroMacromedidor[]>;
    findByDate(fecha: string): Promise<RegistroMacromedidor[]>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<RegistroMacromedidor[]>;
    findByMonth(anio: number, mes: number): Promise<RegistroMacromedidor[]>;
    getCurvesData(fechaInicio: string, fechaFin: string): Promise<any[]>;
    remove(id: number, userId: number): Promise<void>;
    update(id: number, updateDto: UpdateRegistroMacromedidorDto, userId: number): Promise<RegistroMacromedidor>;
}
