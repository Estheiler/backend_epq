import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('indicadores_tecnicos')
export class IndicadorTecnico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: string; // YYYY-MM-DD

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cobertura_acueducto: number;

  @Column({ type: 'int', nullable: true })
  usuarios_acueducto: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  micromedicion_nominal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  micromedicion_real: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  irca: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ianc_promedio: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  produccion_acueducto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  consumo_acueducto: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  continuidad_acueducto: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cobertura_alcantarillado: number;

  @Column({ type: 'int', nullable: true })
  usuarios_alcantarillado: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cobertura_aseo: number;

  @Column({ type: 'int', nullable: true })
  usuarios_aseo: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  barrido_km: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  continuidad_aseo: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  produccion_residuos_ton: number;

  @Column({ type: 'int', name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ type: 'int', name: 'deleted_by', nullable: true })
  deletedBy: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

