import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaUsuario } from './entities/auditoria-usuario.entity';
import { AuditoriaAcceso } from './entities/auditoria-acceso.entity';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditoriaUsuario, AuditoriaAcceso]),
  ],
  providers: [AuditoriaService],
  controllers: [AuditoriaController],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
