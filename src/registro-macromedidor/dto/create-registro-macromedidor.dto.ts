import { IsDateString, IsNotEmpty, IsInt, Min, Max, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRegistroMacromedidorDto {
  @IsDateString({}, { message: 'La fecha debe tener un formato de fecha válido (AAAA-MM-DD).' })
  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  fecha: string;

  @IsInt({ message: 'La hora debe ser un número entero.' })
  @Min(1, { message: 'La hora debe estar entre 1 y 24.' })
  @Max(24, { message: 'La hora debe estar entre 1 y 24.' })
  @IsNotEmpty({ message: 'La hora es obligatoria.' })
  hora: number;

  @IsNumber({}, { message: 'La lectura debe ser un valor numérico.' })
  @Min(0, { message: 'La lectura debe ser un número positivo.' })
  @IsNotEmpty({ message: 'La lectura en m3 es obligatoria.' })
  lectura_m3: number;

  @IsString({ message: 'Las observaciones deben ser texto.' })
  @IsOptional()
  observaciones?: string;
}
