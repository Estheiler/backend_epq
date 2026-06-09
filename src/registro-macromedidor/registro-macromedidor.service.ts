import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroMacromedidor } from './entities/registro-macromedidor.entity';
import { CreateRegistroMacromedidorDto } from './dto/create-registro-macromedidor.dto';
import { UpdateRegistroMacromedidorDto } from './dto/update-registro-macromedidor.dto';


@Injectable()
export class RegistroMacromedidorService {
  constructor(
    @InjectRepository(RegistroMacromedidor)
    private readonly repository: Repository<RegistroMacromedidor>,
  ) {}

  async create(createDto: CreateRegistroMacromedidorDto, operarioId: number): Promise<RegistroMacromedidor> {
    const { fecha, hora, lectura_m3 } = createDto;

    // 1. Controlled duplicate check
    const existing = await this.repository.findOne({ where: { fecha, hora } });
    if (existing) {
      throw new ConflictException(
        `Ya existe una lectura registrada para la fecha ${fecha} a la hora ${hora}.`
      );
    }

    // 2. Find chronologically previous reading
    const previous = await this.repository.createQueryBuilder('registro')
      .where('registro.fecha < :fecha OR (registro.fecha = :fecha AND registro.hora < :hora)', { fecha, hora })
      .orderBy('registro.fecha', 'DESC')
      .addOrderBy('registro.hora', 'DESC')
      .getOne();

    // 3. Calculate consolidado_m3
    const consolidadoM3 = previous ? Number((lectura_m3 - previous.lectura_m3).toFixed(2)) : 0;

    // 4. Calculate consumo_acumulado_dia
    const sameDayPrevious = await this.repository.createQueryBuilder('registro')
      .select('SUM(registro.consolidado_m3)', 'total')
      .where('registro.fecha = :fecha AND registro.hora < :hora', { fecha, hora })
      .getRawOne();

    const sameDaySum = sameDayPrevious?.total ? Number(sameDayPrevious.total) : 0;
    const consumoAcumuladoDia = Number((sameDaySum + consolidadoM3).toFixed(2));

    // 5. Create and save new reading
    const newRecord = this.repository.create({
      ...createDto,
      consolidado_m3: consolidadoM3,
      consumo_acumulado_dia: consumoAcumuladoDia,
      operario_id: operarioId,
      createdBy: operarioId,
    });

    const savedRecord = await this.repository.save(newRecord);

    // 6. Recalculate out-of-order inserts if any
    await this.handleSubsequentRecalculation(fecha, hora, savedRecord);

    return savedRecord;
  }

  private async handleSubsequentRecalculation(fecha: string, hora: number, savedRecord: RegistroMacromedidor): Promise<void> {
    // A. Find chronologically immediate next reading
    const nextReading = await this.repository.createQueryBuilder('registro')
      .where('registro.fecha > :fecha OR (registro.fecha = :fecha AND registro.hora > :hora)', { fecha, hora })
      .orderBy('registro.fecha', 'ASC')
      .addOrderBy('registro.hora', 'ASC')
      .getOne();

    if (nextReading) {
      nextReading.consolidado_m3 = Number((nextReading.lectura_m3 - savedRecord.lectura_m3).toFixed(2));
      await this.repository.save(nextReading);
    }

    // B. Recalculate daily acumulados for all readings of this date, ordered by hour
    const dayReadings = await this.repository.createQueryBuilder('registro')
      .where('registro.fecha = :fecha', { fecha })
      .orderBy('registro.hora', 'ASC')
      .getMany();

    let runningSum = 0;
    for (const reg of dayReadings) {
      runningSum = Number((runningSum + Number(reg.consolidado_m3)).toFixed(2));
      reg.consumo_acumulado_dia = runningSum;
      await this.repository.save(reg);
    }
  }

  async findAll(): Promise<RegistroMacromedidor[]> {
    return this.repository.find({
      order: { fecha: 'DESC', hora: 'DESC' },
    });
  }

  async findByDate(fecha: string): Promise<RegistroMacromedidor[]> {
    return this.repository.find({
      where: { fecha },
      order: { hora: 'ASC' },
    });
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<RegistroMacromedidor[]> {
    return this.repository.createQueryBuilder('registro')
      .where('registro.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .orderBy('registro.fecha', 'ASC')
      .addOrderBy('registro.hora', 'ASC')
      .getMany();
  }

  async findByMonth(anio: number, mes: number): Promise<RegistroMacromedidor[]> {
    return this.repository.createQueryBuilder('registro')
      .where('YEAR(registro.fecha) = :anio AND MONTH(registro.fecha) = :mes', { anio, mes })
      .orderBy('registro.fecha', 'ASC')
      .addOrderBy('registro.hora', 'ASC')
      .getMany();
  }

  async getCurvesData(fechaInicio: string, fechaFin: string): Promise<any[]> {
    const data = await this.findByDateRange(fechaInicio, fechaFin);
    return data.map((r) => ({
      id: r.id,
      fecha: r.fecha,
      hora: r.hora,
      timestamp: `${r.fecha} ${String(r.hora).padStart(2, '0')}:00`,
      lectura: Number(r.lectura_m3),
      consolidado: Number(r.consolidado_m3),
      acumulado: Number(r.consumo_acumulado_dia),
      observaciones: r.observaciones,
    }));
  }

  async remove(id: number, userId: number): Promise<void> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const { fecha, hora } = record;
    record.deletedBy = userId;
    await this.repository.save(record);
    await this.repository.softRemove(record);

    // After deleting, recalculate chronology for subsequent records
    // A. Find next reading
    const nextReading = await this.repository.createQueryBuilder('registro')
      .where('registro.fecha > :fecha OR (registro.fecha = :fecha AND registro.hora > :hora)', { fecha, hora })
      .orderBy('registro.fecha', 'ASC')
      .addOrderBy('registro.hora', 'ASC')
      .getOne();

    if (nextReading) {
      // Find new previous of nextReading
      const newPrev = await this.repository.createQueryBuilder('registro')
        .where('registro.fecha < :f OR (registro.fecha = :f AND registro.hora < :h)', { f: nextReading.fecha, h: nextReading.hora })
        .orderBy('registro.fecha', 'DESC')
        .addOrderBy('registro.hora', 'DESC')
        .getOne();

      nextReading.consolidado_m3 = newPrev ? Number((nextReading.lectura_m3 - newPrev.lectura_m3).toFixed(2)) : 0;
      await this.repository.save(nextReading);
    }

    // B. Recalculate daily acumulados for that date
    const dayReadings = await this.repository.createQueryBuilder('registro')
      .where('registro.fecha = :fecha', { fecha })
      .orderBy('registro.hora', 'ASC')
      .getMany();

    let runningSum = 0;
    for (const reg of dayReadings) {
      runningSum = Number((runningSum + Number(reg.consolidado_m3)).toFixed(2));
      reg.consumo_acumulado_dia = runningSum;
      await this.repository.save(reg);
    }
  }

  async update(id: number, updateDto: UpdateRegistroMacromedidorDto, userId: number): Promise<RegistroMacromedidor> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const { lectura_m3, observaciones } = updateDto;

    if (observaciones !== undefined) {
      record.observaciones = observaciones;
    }

    let lecturaChanged = false;
    if (lectura_m3 !== undefined && Number(lectura_m3) !== Number(record.lectura_m3)) {
      lecturaChanged = true;
      record.lectura_m3 = lectura_m3;
    }

    record.updatedBy = userId;

    if (lecturaChanged) {
      // Find previous record to calculate new consolidado_m3
      const previous = await this.repository.createQueryBuilder('registro')
        .where('registro.fecha < :fecha OR (registro.fecha = :fecha AND registro.hora < :hora)', { fecha: record.fecha, hora: record.hora })
        .orderBy('registro.fecha', 'DESC')
        .addOrderBy('registro.hora', 'DESC')
        .getOne();

      record.consolidado_m3 = previous ? Number((record.lectura_m3 - previous.lectura_m3).toFixed(2)) : 0;
    }

    const savedRecord = await this.repository.save(record);

    if (lecturaChanged) {
      // Trigger subsequent recalculations for next readings and daily cumulative sums
      await this.handleSubsequentRecalculation(record.fecha, record.hora, savedRecord);
    }

    return savedRecord;
  }
}

