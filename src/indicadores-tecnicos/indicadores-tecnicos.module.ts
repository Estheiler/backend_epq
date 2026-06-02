import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicadorTecnico } from './entities/indicador-tecnico.entity';
import { IndicadoresTecnicosService } from './indicadores-tecnicos.service';
import { IndicadoresTecnicosController } from './indicadores-tecnicos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IndicadorTecnico])],
  controllers: [IndicadoresTecnicosController],
  providers: [IndicadoresTecnicosService],
  exports: [IndicadoresTecnicosService],
})
export class IndicadoresTecnicosModule {}
