import { IndicadoresTecnicosService } from './indicadores-tecnicos.service';
import { CreateIndicadorTecnicoDto } from './dto/create-indicador-tecnico.dto';
import { UpdateIndicadorTecnicoDto } from './dto/update-indicador-tecnico.dto';
import { FilterIndicadorTecnicoDto } from './dto/filter-indicador-tecnico.dto';
export declare class IndicadoresTecnicosController {
    private readonly service;
    constructor(service: IndicadoresTecnicosService);
    create(createDto: CreateIndicadorTecnicoDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/indicador-tecnico.entity").IndicadorTecnico;
    }>;
    findAll(filters: FilterIndicadorTecnicoDto): Promise<{
        success: boolean;
        data: import("./entities/indicador-tecnico.entity").IndicadorTecnico[];
    }>;
    getAvailableFilters(): Promise<{
        success: boolean;
        data: {
            anio: number;
            meses: number[];
        }[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: import("./entities/indicador-tecnico.entity").IndicadorTecnico;
    }>;
    update(id: number, updateDto: UpdateIndicadorTecnicoDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/indicador-tecnico.entity").IndicadorTecnico;
    }>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
