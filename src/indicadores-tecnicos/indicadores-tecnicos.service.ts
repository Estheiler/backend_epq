import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicadorTecnico } from './entities/indicador-tecnico.entity';
import { CreateIndicadorTecnicoDto } from './dto/create-indicador-tecnico.dto';
import { UpdateIndicadorTecnicoDto } from './dto/update-indicador-tecnico.dto';
import { FilterIndicadorTecnicoDto } from './dto/filter-indicador-tecnico.dto';

@Injectable()
export class IndicadoresTecnicosService {
  constructor(
    @InjectRepository(IndicadorTecnico)
    private readonly repository: Repository<IndicadorTecnico>,
  ) {}

  async create(createDto: CreateIndicadorTecnicoDto, userId: number): Promise<IndicadorTecnico> {
    const newRecord = this.repository.create({
      ...createDto,
      createdBy: userId,
    });
    return this.repository.save(newRecord);
  }

  async findAll(filters: FilterIndicadorTecnicoDto): Promise<IndicadorTecnico[]> {
    const { anio, mes, fechaInicio, fechaFin } = filters;
    const queryBuilder = this.repository.createQueryBuilder('indicador');

    if (anio) {
      queryBuilder.andWhere('YEAR(indicador.fecha) = :anio', { anio });
    }

    if (mes) {
      queryBuilder.andWhere('MONTH(indicador.fecha) = :mes', { mes });
    }

    if (fechaInicio && fechaFin) {
      queryBuilder.andWhere('indicador.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      });
    } else if (fechaInicio) {
      queryBuilder.andWhere('indicador.fecha >= :fechaInicio', { fechaInicio });
    } else if (fechaFin) {
      queryBuilder.andWhere('indicador.fecha <= :fechaFin', { fechaFin });
    }

    // Sort chronologically by date descending
    queryBuilder.orderBy('indicador.fecha', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<IndicadorTecnico> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`No se encontró el indicador técnico con ID ${id}`);
    }
    return record;
  }

  async update(id: number, updateDto: UpdateIndicadorTecnicoDto, userId: number): Promise<IndicadorTecnico> {
    const record = await this.findOne(id);
    const updated = this.repository.merge(record, {
      ...updateDto,
      updatedBy: userId,
    });
    return this.repository.save(updated);
  }

  async remove(id: number, userId: number): Promise<void> {
    const record = await this.findOne(id);
    record.deletedBy = userId;
    await this.repository.save(record);
    await this.repository.softRemove(record);
  }

  async getAvailableFilters(): Promise<{ anio: number; meses: number[] }[]> {
    const raw = await this.repository
      .createQueryBuilder('indicador')
      .select('DISTINCT YEAR(indicador.fecha)', 'anio')
      .addSelect('MONTH(indicador.fecha)', 'mes')
      .orderBy('anio', 'DESC')
      .addOrderBy('mes', 'ASC')
      .getRawMany();

    const grouped: { [year: number]: number[] } = {};

    raw.forEach((row) => {
      const year = Number(row.anio);
      const month = Number(row.mes);
      if (!year || isNaN(year) || !month || isNaN(month)) return;

      if (!grouped[year]) {
        grouped[year] = [];
      }
      if (!grouped[year].includes(month)) {
        grouped[year].push(month);
      }
    });

    return Object.keys(grouped).map((year) => ({
      anio: Number(year),
      meses: grouped[Number(year)],
    }));
  }
}
