import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { RegistroMacromedidorService } from './registro-macromedidor.service';
import { CreateRegistroMacromedidorDto } from './dto/create-registro-macromedidor.dto';
import { UpdateRegistroMacromedidorDto } from './dto/update-registro-macromedidor.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('registro-macromedidor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistroMacromedidorController {
  constructor(private readonly service: RegistroMacromedidorService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.OPERARIO)
  async create(
    @Body() createDto: CreateRegistroMacromedidorDto,
    @GetUser('id') operarioId: number,
  ) {
    const data = await this.service.create(createDto, operarioId);
    return {
      success: true,
      message: 'Lectura de macromedidor registrada exitosamente.',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return {
      success: true,
      data,
    };
  }

  @Get('fecha')
  async findByDate(@Query('fecha') fecha: string) {
    if (!fecha) {
      throw new BadRequestException('El parámetro query "fecha" es obligatorio.');
    }
    const data = await this.service.findByDate(fecha);
    return {
      success: true,
      data,
    };
  }

  @Get('rango')
  async findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    if (!fechaInicio || !fechaFin) {
      throw new BadRequestException('Los parámetros "fechaInicio" y "fechaFin" son obligatorios.');
    }
    const data = await this.service.findByDateRange(fechaInicio, fechaFin);
    return {
      success: true,
      data,
    };
  }

  @Get('mes')
  async findByMonth(
    @Query('anio') anioStr: string,
    @Query('mes') mesStr: string,
  ) {
    if (!anioStr || !mesStr) {
      throw new BadRequestException('Los parámetros "anio" y "mes" son obligatorios.');
    }
    const anio = parseInt(anioStr, 10);
    const mes = parseInt(mesStr, 10);
    if (isNaN(anio) || isNaN(mes)) {
      throw new BadRequestException('El año y mes deben ser números válidos.');
    }
    const data = await this.service.findByMonth(anio, mes);
    return {
      success: true,
      data,
    };
  }

  @Get('curvas')
  async getCurvesData(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    if (!fechaInicio || !fechaFin) {
      throw new BadRequestException('Los parámetros "fechaInicio" y "fechaFin" son obligatorios.');
    }
    const data = await this.service.getCurvesData(fechaInicio, fechaFin);
    return {
      success: true,
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    await this.service.remove(id, userId);
    return {
      success: true,
      message: 'Lectura de macromedidor eliminada y consumos recalculados exitosamente.',
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRegistroMacromedidorDto,
    @GetUser('id') userId: number,
  ) {
    const data = await this.service.update(id, updateDto, userId);
    return {
      success: true,
      message: 'Lectura de macromedidor actualizada y consumos recalculados exitosamente.',
      data,
    };
  }
}
