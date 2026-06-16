import { IndicadorTecnico } from '../indicadores-tecnicos/entities/indicador-tecnico.entity';
import { RegistroMacromedidor } from '../registro-macromedidor/entities/registro-macromedidor.entity';
import { UsersService } from '../users/users.service';
export declare class ExcelExportService {
    private readonly usersService;
    constructor(usersService: UsersService);
    exportIndicadores(data: IndicadorTecnico[]): Promise<any>;
    exportMacromedidor(data: RegistroMacromedidor[]): Promise<any>;
}
