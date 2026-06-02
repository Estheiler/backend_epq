import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('auditoria_usuarios')
export class AuditoriaUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_afectado_id' })
  usuarioAfectadoId: number;

  @Column({ name: 'usuario_afectado_username' })
  usuarioAfectadoUsername: string;

  @Column()
  accion: string; // e.g. CREACION, ACTUALIZACION, CAMBIO_ROL, DESACTIVACION, ACTIVACION, BORRADO_LOGICO, RESTABLECIMIENTO_CONTRASENA

  @Column({ type: 'int', name: 'ejecutor_id', nullable: true })
  ejecutorId: number | null;

  @Column({ type: 'varchar', name: 'ejecutor_username', nullable: true })
  ejecutorUsername: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  detalles: string;
}
