import { ExcelExportService } from './excel-export.service';
import { IndicadoresTecnicosService } from '../indicadores-tecnicos/indicadores-tecnicos.service';
import { RegistroMacromedidorService } from '../registro-macromedidor/registro-macromedidor.service';
import { User } from '../users/entities/user.entity';
import { FilterIndicadorTecnicoDto } from '../indicadores-tecnicos/dto/filter-indicador-tecnico.dto';
export declare class ExcelExportController {
    private readonly excelExportService;
    private readonly indicadoresService;
    private readonly macromedidorService;
    constructor(excelExportService: ExcelExportService, indicadoresService: IndicadoresTecnicosService, macromedidorService: RegistroMacromedidorService);
    exportIndicadores(filters: FilterIndicadorTecnicoDto, res: any): Promise<void>;
    exportMacromedidor(fecha: string, fechaInicio: string, fechaFin: string, anioStr: string, mesStr: string, user: User, res: any): Promise<void>;
}
