import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { IndicadoresTecnicosService } from './indicadores-tecnicos.service';
import { CreateIndicadorTecnicoDto } from './dto/create-indicador-tecnico.dto';
import { UpdateIndicadorTecnicoDto } from './dto/update-indicador-tecnico.dto';
import { FilterIndicadorTecnicoDto } from './dto/filter-indicador-tecnico.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('indicadores-tecnicos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IndicadoresTecnicosController {
  constructor(private readonly service: IndicadoresTecnicosService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async create(
    @Body() createDto: CreateIndicadorTecnicoDto,
    @GetUser('id') userId: number,
  ) {
    const data = await this.service.create(createDto, userId);
    return {
      success: true,
      message: 'Indicador técnico creado exitosamente.',
      data,
    };
  }

  @Get()
  async findAll(@Query() filters: FilterIndicadorTecnicoDto) {
    const data = await this.service.findAll(filters);
    return {
      success: true,
      data,
    };
  }

  @Get('filtros-disponibles')
  async getAvailableFilters() {
    const data = await this.service.getAvailableFilters();
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return {
      success: true,
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIndicadorTecnicoDto,
    @GetUser('id') userId: number,
  ) {
    const data = await this.service.update(id, updateDto, userId);
    return {
      success: true,
      message: 'Indicador técnico actualizado exitosamente.',
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
      message: 'Indicador técnico eliminado exitosamente.',
    };
  }
}
