import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { IndicadorTecnico } from '../indicadores-tecnicos/entities/indicador-tecnico.entity';
import { RegistroMacromedidor } from '../registro-macromedidor/entities/registro-macromedidor.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExcelExportService {
  constructor(private readonly usersService: UsersService) {}

  async exportIndicadores(data: IndicadorTecnico[]): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Indicadores Técnicos');

    // Define columns
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Cobertura Acueducto (%)', key: 'cobertura_acueducto', width: 25 },
      { header: 'Usuarios Acueducto', key: 'usuarios_acueducto', width: 20 },
      { header: 'Micromedición Nominal (%)', key: 'micromedicion_nominal', width: 25 },
      { header: 'Micromedición Real (%)', key: 'micromedicion_real', width: 25 },
      { header: 'IRCA (%)', key: 'irca', width: 12 },
      { header: 'IANC Promedio (%)', key: 'ianc_promedio', width: 20 },
      { header: 'Producción Acueducto (m³)', key: 'produccion_acueducto', width: 25 },
      { header: 'Consumo Acueducto (m³)', key: 'consumo_acueducto', width: 22 },
      { header: 'Continuidad Acueducto (Hrs)', key: 'continuidad_acueducto', width: 25 },
      { header: 'Cobertura Alcantarillado (%)', key: 'cobertura_alcantarillado', width: 28 },
      { header: 'Usuarios Alcantarillado', key: 'usuarios_alcantarillado', width: 24 },
      { header: 'Cobertura Aseo (%)', key: 'cobertura_aseo', width: 20 },
      { header: 'Usuarios Aseo', key: 'usuarios_aseo', width: 18 },
      { header: 'Barrido (Km)', key: 'barrido_km', width: 15 },
      { header: 'Continuidad Aseo (%)', key: 'continuidad_aseo', width: 22 },
      { header: 'Producción Residuos (Ton)', key: 'produccion_residuos_ton', width: 25 },
    ];

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Segoe UI', size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1F4E78' }, // Dark Blue Professional
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    // Populate data
    data.forEach((row, index) => {
      const addedRow = worksheet.addRow({
        fecha: row.fecha,
        cobertura_acueducto: row.cobertura_acueducto !== null ? Number(row.cobertura_acueducto) / 100 : null,
        usuarios_acueducto: row.usuarios_acueducto,
        micromedicion_nominal: row.micromedicion_nominal !== null ? Number(row.micromedicion_nominal) / 100 : null,
        micromedicion_real: row.micromedicion_real !== null ? Number(row.micromedicion_real) / 100 : null,
        irca: row.irca !== null ? Number(row.irca) / 100 : null,
        ianc_promedio: row.ianc_promedio !== null ? Number(row.ianc_promedio) / 100 : null,
        produccion_acueducto: row.produccion_acueducto !== null ? Number(row.produccion_acueducto) : null,
        consumo_acueducto: row.consumo_acueducto !== null ? Number(row.consumo_acueducto) : null,
        continuidad_acueducto: row.continuidad_acueducto !== null ? Number(row.continuidad_acueducto) : null,
        cobertura_alcantarillado: row.cobertura_alcantarillado !== null ? Number(row.cobertura_alcantarillado) / 100 : null,
        usuarios_alcantarillado: row.usuarios_alcantarillado,
        cobertura_aseo: row.cobertura_aseo !== null ? Number(row.cobertura_aseo) / 100 : null,
        usuarios_aseo: row.usuarios_aseo,
        barrido_km: row.barrido_km !== null ? Number(row.barrido_km) : null,
        continuidad_aseo: row.continuidad_aseo !== null ? Number(row.continuidad_aseo) / 100 : null,
        produccion_residuos_ton: row.produccion_residuos_ton !== null ? Number(row.produccion_residuos_ton) : null,
      });

      // Zebra striping and standard styling
      const isEven = index % 2 === 0;
      addedRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9 };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
          top: { style: 'thin', color: { argb: 'D3D3D3' } },
          left: { style: 'thin', color: { argb: 'D3D3D3' } },
          right: { style: 'thin', color: { argb: 'D3D3D3' } },
        };
        if (isEven) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' },
          };
        }

        // Alignments and number formats
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'center' };
        } else if ([2, 4, 5, 6, 7, 11, 13, 16].includes(colNumber)) { // Percentage columns
          cell.numFmt = '0.00%';
          cell.alignment = { horizontal: 'right' };
        } else if ([3, 12, 14].includes(colNumber)) { // Integers
          cell.numFmt = '#,##0';
          cell.alignment = { horizontal: 'right' };
        } else { // Decimals
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        }
      });
    });

    return workbook.xlsx.writeBuffer();
  }

  async exportMacromedidor(data: RegistroMacromedidor[]): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lecturas Macromedidor');

    // Fetch all users to map operario_id to username
    const users = await this.usersService.listAll({ role: 'superadmin' } as any);
    const userMap = new Map<number, string>();
    users.forEach((u) => userMap.set(u.id, u.username));

    // Define columns
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Hora (1-24)', key: 'hora', width: 15 },
      { header: 'Lectura (m³)', key: 'lectura_m3', width: 18 },
      { header: 'Consolidado (m³)', key: 'consolidado_m3', width: 18 },
      { header: 'Acumulado Diario (m³)', key: 'consumo_acumulado_dia', width: 22 },
      { header: 'Operario Responsable', key: 'operario', width: 24 },
      { header: 'Observaciones', key: 'observaciones', width: 35 },
      { header: 'Fecha Registro', key: 'created_at', width: 22 },
    ];

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Segoe UI', size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2E75B6' }, // Light Blue Professional
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    // Populate data
    data.forEach((row, index) => {
      const operarioName = userMap.get(row.operario_id) || `Operario #${row.operario_id}`;
      const createdAtFormatted = row.created_at
        ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 19)
        : '';

      const addedRow = worksheet.addRow({
        fecha: row.fecha,
        hora: row.hora,
        lectura_m3: row.lectura_m3 !== null ? Number(row.lectura_m3) : null,
        consolidado_m3: row.consolidado_m3 !== null ? Number(row.consolidado_m3) : null,
        consumo_acumulado_dia: row.consumo_acumulado_dia !== null ? Number(row.consumo_acumulado_dia) : null,
        operario: operarioName,
        observaciones: row.observaciones || '',
        created_at: createdAtFormatted,
      });

      // Zebra striping and standard styling
      const isEven = index % 2 === 0;
      addedRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9 };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
          top: { style: 'thin', color: { argb: 'D3D3D3' } },
          left: { style: 'thin', color: { argb: 'D3D3D3' } },
          right: { style: 'thin', color: { argb: 'D3D3D3' } },
        };
        if (isEven) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F9FBFD' }, // Very light blue/gray
          };
        }

        // Alignments and formatting
        if ([1, 2, 8].includes(colNumber)) {
          cell.alignment = { horizontal: 'center' };
        } else if ([3, 4, 5].includes(colNumber)) {
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        } else {
          cell.alignment = { horizontal: 'left' };
        }
      });
    });

    return workbook.xlsx.writeBuffer();
  }
}
