import { IsOptional, IsInt, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterIndicadorTecnicoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El año debe ser un número entero.' })
  @Min(2000, { message: 'El año debe ser mayor a 2000.' })
  anio?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El mes debe ser un número entero.' })
  @Min(1, { message: 'El mes debe estar entre 1 y 12.' })
  @Max(12, { message: 'El mes debe estar entre 1 y 12.' })
  mes?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser un formato de fecha válido (AAAA-MM-DD).' })
  fechaInicio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser un formato de fecha válido (AAAA-MM-DD).' })
  fechaFin?: string;
}
