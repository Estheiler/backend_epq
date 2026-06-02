import { Controller, Get, Query, UseGuards, Res, BadRequestException } from '@nestjs/common';
import { ExcelExportService } from './excel-export.service';
import { IndicadoresTecnicosService } from '../indicadores-tecnicos/indicadores-tecnicos.service';
import { RegistroMacromedidorService } from '../registro-macromedidor/registro-macromedidor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { FilterIndicadorTecnicoDto } from '../indicadores-tecnicos/dto/filter-indicador-tecnico.dto';

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExcelExportController {
  constructor(
    private readonly excelExportService: ExcelExportService,
    private readonly indicadoresService: IndicadoresTecnicosService,
    private readonly macromedidorService: RegistroMacromedidorService,
  ) {}

  @Get('indicadores-tecnicos')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HIDRAULICO)
  async exportIndicadores(
    @Query() filters: FilterIndicadorTecnicoDto,
    @Res() res: any,
  ) {
    try {
      const records = await this.indicadoresService.findAll(filters);
      const buffer = await this.excelExportService.exportIndicadores(records);

      const dateStr = new Date().toISOString().substring(0, 10);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=indicadores_tecnicos_${dateStr}.xlsx`);
      res.end(buffer);
    } catch (err) {
      throw new BadRequestException('Error al generar la exportación de indicadores técnicos: ' + err.message);
    }
  }

  @Get('registro-macromedidor')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HIDRAULICO, UserRole.OPERARIO)
  async exportMacromedidor(
    @Query('fecha') fecha: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('anio') anioStr: string,
    @Query('mes') mesStr: string,
    @GetUser() user: User,
    @Res() res: any,
  ) {
    try {
      let records: any[] = [];

      // Determine query route dynamically based on parameters passed
      if (fechaInicio && fechaFin) {
        records = await this.macromedidorService.findByDateRange(fechaInicio, fechaFin);
      } else if (anioStr && mesStr) {
        const anio = parseInt(anioStr, 10);
        const mes = parseInt(mesStr, 10);
        if (isNaN(anio) || isNaN(mes)) {
          throw new BadRequestException('El año y mes deben ser valores numéricos válidos.');
        }
        records = await this.macromedidorService.findByMonth(anio, mes);
      } else if (fecha) {
        records = await this.macromedidorService.findByDate(fecha);
      } else {
        records = await this.macromedidorService.findAll();
      }

      // Filter by own operator ID if user has OPERARIO role
      if (user.role === UserRole.OPERARIO) {
        records = records.filter((r) => r.operario_id === user.id);
      }

      const buffer = await this.excelExportService.exportMacromedidor(records);

      const dateStr = new Date().toISOString().substring(0, 10);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=registro_macromedidor_${dateStr}.xlsx`);
      res.end(buffer);
    } catch (err) {
      throw new BadRequestException('Error al generar la exportación de macromedidor: ' + err.message);
    }
  }
}
