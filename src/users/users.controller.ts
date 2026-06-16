import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from './entities/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() executor: User,
  ) {
    const user = await this.usersService.create(createUserDto, executor);
    return {
      success: true,
      message: 'Usuario creado exitosamente.',
      data: user,
    };
  }

  @Get()
  async listAll(@GetUser() executor: User) {
    const users = await this.usersService.listAll(executor);
    return {
      success: true,
      data: users,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { username?: string },
    @GetUser() executor: User,
  ) {
    const user = await this.usersService.update(id, body, executor);
    return {
      success: true,
      message: 'Usuario actualizado exitosamente.',
      data: user,
    };
  }

  @Post(':id/activate')
  async activate(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() executor: User,
  ) {
    const user = await this.usersService.activate(id, executor);
    return {
      success: true,
      message: 'Usuario activado exitosamente.',
      data: user,
    };
  }

  @Post(':id/deactivate')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() executor: User,
  ) {
    const user = await this.usersService.deactivate(id, executor);
    return {
      success: true,
      message: 'Usuario desactivado exitosamente.',
      data: user,
    };
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: UserRole,
    @GetUser() executor: User,
  ) {
    const user = await this.usersService.updateRole(id, role, executor);
    return {
      success: true,
      message: 'Rol de usuario actualizado exitosamente.',
      data: user,
    };
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('password') password: string,
    @GetUser() executor: User,
  ) {
    const user = await this.usersService.resetPassword(id, password, executor);
    return {
      success: true,
      message: 'Contraseña restablecida exitosamente.',
      data: user,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() executor: User,
  ) {
    await this.usersService.softDelete(id, executor);
    return {
      success: true,
      message: 'Usuario eliminado (borrado lógico) exitosamente.',
    };
  }
}

