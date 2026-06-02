import { Module } from '@nestjs/common';
import { ExcelExportService } from './excel-export.service';
import { ExcelExportController } from './excel-export.controller';
import { IndicadoresTecnicosModule } from '../indicadores-tecnicos/indicadores-tecnicos.module';
import { RegistroMacromedidorModule } from '../registro-macromedidor/registro-macromedidor.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    IndicadoresTecnicosModule,
    RegistroMacromedidorModule,
    UsersModule,
  ],
  providers: [ExcelExportService],
  controllers: [ExcelExportController],
})
export class ExcelExportModule {}
