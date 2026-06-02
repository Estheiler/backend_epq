import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('auditoria_accesos')
export class AuditoriaAcceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  accion: string; // LOGIN_EXITOSO, LOGIN_FALLIDO, LOGOUT

  @Column()
  ip: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  detalles: string;
}
