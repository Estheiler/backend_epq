import { Repository } from 'typeorm';
import { IndicadorTecnico } from './entities/indicador-tecnico.entity';
import { CreateIndicadorTecnicoDto } from './dto/create-indicador-tecnico.dto';
import { UpdateIndicadorTecnicoDto } from './dto/update-indicador-tecnico.dto';
import { FilterIndicadorTecnicoDto } from './dto/filter-indicador-tecnico.dto';
export declare class IndicadoresTecnicosService {
    private readonly repository;
    constructor(repository: Repository<IndicadorTecnico>);
    create(createDto: CreateIndicadorTecnicoDto, userId: number): Promise<IndicadorTecnico>;
    findAll(filters: FilterIndicadorTecnicoDto): Promise<IndicadorTecnico[]>;
    findOne(id: number): Promise<IndicadorTecnico>;
    update(id: number, updateDto: UpdateIndicadorTecnicoDto, userId: number): Promise<IndicadorTecnico>;
    remove(id: number, userId: number): Promise<void>;
    getAvailableFilters(): Promise<{
        anio: number;
        meses: number[];
    }[]>;
}
