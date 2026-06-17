import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('registro_macromedidor')
@Unique(['fecha', 'hora'])
export class RegistroMacromedidor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: string; // Stored as YYYY-MM-DD

  @Column({ type: 'int' })
  hora: number; // 1-24

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lectura_m3: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  consolidado_m3: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  consumo_acumulado_dia: number;

  @Column({ type: 'int', nullable: true })
  operario_id: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'int', name: 'created_by', nullable: true })
  createdBy: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedBy: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
}

