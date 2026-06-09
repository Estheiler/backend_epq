import { IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class UpdateRegistroMacromedidorDto {
  @IsNumber({}, { message: 'La lectura debe ser un valor numérico.' })
  @Min(0, { message: 'La lectura debe ser un número positivo.' })
  @IsOptional()
  lectura_m3?: number;

  @IsString({ message: 'Las observaciones deben ser texto.' })
  @IsOptional()
  observaciones?: string;
}
