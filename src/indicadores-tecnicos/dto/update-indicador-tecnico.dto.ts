import { IsDateString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateIndicadorTecnicoDto {
  @IsDateString({}, { message: 'La fecha debe ser un formato de fecha válido (AAAA-MM-DD).' })
  @IsOptional()
  fecha?: string;

  @IsNumber({}, { message: 'La cobertura de acueducto debe ser un número.' })
  @IsOptional()
  cobertura_acueducto?: number;

  @IsInt({ message: 'Los usuarios de acueducto deben ser un número entero.' })
  @Min(0, { message: 'Los usuarios de acueducto no pueden ser negativos.' })
  @IsOptional()
  usuarios_acueducto?: number;

  @IsNumber({}, { message: 'La micromedición nominal debe ser un número.' })
  @IsOptional()
  micromedicion_nominal?: number;

  @IsNumber({}, { message: 'La micromedición real debe ser un número.' })
  @IsOptional()
  micromedicion_real?: number;

  @IsNumber({}, { message: 'El IRCA debe ser un número.' })
  @IsOptional()
  irca?: number;

  @IsNumber({}, { message: 'El IANC promedio debe ser un número.' })
  @IsOptional()
  ianc_promedio?: number;

  @IsNumber({}, { message: 'La producción de acueducto debe ser un número.' })
  @IsOptional()
  produccion_acueducto?: number;

  @IsNumber({}, { message: 'El consumo de acueducto debe ser un número.' })
  @IsOptional()
  consumo_acueducto?: number;

  @IsNumber({}, { message: 'La continuidad de acueducto debe ser un número.' })
  @IsOptional()
  continuidad_acueducto?: number;

  @IsNumber({}, { message: 'La cobertura de alcantarillado debe ser un número.' })
  @IsOptional()
  cobertura_alcantarillado?: number;

  @IsInt({ message: 'Los usuarios de alcantarillado deben ser un número entero.' })
  @Min(0, { message: 'Los usuarios de alcantarillado no pueden ser negativos.' })
  @IsOptional()
  usuarios_alcantarillado?: number;

  @IsNumber({}, { message: 'La cobertura de aseo debe ser un número.' })
  @IsOptional()
  cobertura_aseo?: number;

  @IsInt({ message: 'Los usuarios de aseo deben ser un número entero.' })
  @Min(0, { message: 'Los usuarios de aseo no pueden ser negativos.' })
  @IsOptional()
  usuarios_aseo?: number;

  @IsNumber({}, { message: 'El barrido en km debe ser un número.' })
  @IsOptional()
  barrido_km?: number;

  @IsNumber({}, { message: 'La continuidad de aseo debe ser un número.' })
  @IsOptional()
  continuidad_aseo?: number;

  @IsNumber({}, { message: 'La producción de residuos en toneladas debe ser un número.' })
  @IsOptional()
  produccion_residuos_ton?: number;
}
