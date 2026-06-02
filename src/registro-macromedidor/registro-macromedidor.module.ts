import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroMacromedidor } from './entities/registro-macromedidor.entity';
import { RegistroMacromedidorService } from './registro-macromedidor.service';
import { RegistroMacromedidorController } from './registro-macromedidor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroMacromedidor])],
  controllers: [RegistroMacromedidorController],
  providers: [RegistroMacromedidorService],
  exports: [RegistroMacromedidorService],
})
export class RegistroMacromedidorModule {}
