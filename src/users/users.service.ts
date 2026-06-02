import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private auditoriaService: AuditoriaService,
  ) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  // Validate hierarchy before allowing actions
  private validateHierarchy(executor: User, target: User) {
    if (executor.role === UserRole.SUPERADMIN) {
      return; // Superadmin can manage anyone
    }
    
    if (executor.role === UserRole.ADMIN) {
      // Admin cannot manage Superadmin or other Admin accounts
      if (target.role === UserRole.SUPERADMIN || target.role === UserRole.ADMIN) {
        throw new ForbiddenException(
          `No tiene permisos para modificar o gestionar a este usuario (${target.username}) con rol de nivel superior o igual.`
        );
      }
      return;
    }

    // Operarios and Hidraulicos cannot manage anyone
    throw new ForbiddenException('No tiene permisos para gestionar usuarios.');
  }

  async create(createUserDto: CreateUserDto, executor: User): Promise<User> {
    const { username, password, role } = createUserDto;

    // Check hierarchy: Admin cannot create Superadmin or Admin
    if (executor.role === UserRole.ADMIN && (role === UserRole.SUPERADMIN || role === UserRole.ADMIN)) {
      throw new ForbiddenException(
        `Un Administrador no puede crear usuarios con rol ${role}.`
      );
    }

    const existing = await this.findOneByUsername(username);
    if (existing) {
      throw new ConflictException(`El usuario '${username}' ya está registrado.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
      createdBy: executor.id,
    });

    const saved = await this.usersRepository.save(newUser);

    // Write to audit log
    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'CREACION',
      executor.id,
      executor.username,
      `Usuario creado con rol: ${role}`
    );

    delete saved.password;
    return saved;
  }

  async update(id: number, data: { username?: string }, executor: User): Promise<User> {
    const target = await this.usersRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    this.validateHierarchy(executor, target);

    if (data.username && data.username !== target.username) {
      const existing = await this.findOneByUsername(data.username);
      if (existing) {
        throw new ConflictException(`El nombre de usuario '${data.username}' ya está en uso.`);
      }
      target.username = data.username;
    }

    target.updatedBy = executor.id;
    const saved = await this.usersRepository.save(target);

    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'ACTUALIZACION_DATOS',
      executor.id,
      executor.username,
      `Datos actualizados. Nuevo username: ${saved.username}`
    );

    delete saved.password;
    return saved;
  }

  async activate(id: number, executor: User): Promise<User> {
    const target = await this.usersRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    this.validateHierarchy(executor, target);

    target.isActive = true;
    target.updatedBy = executor.id;
    const saved = await this.usersRepository.save(target);

    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'ACTIVACION',
      executor.id,
      executor.username,
      'Usuario activado en el sistema.'
    );

    delete saved.password;
    return saved;
  }

  async deactivate(id: number, executor: User): Promise<User> {
    const target = await this.usersRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    this.validateHierarchy(executor, target);

    target.isActive = false;
    target.updatedBy = executor.id;
    const saved = await this.usersRepository.save(target);

    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'DESACTIVACION',
      executor.id,
      executor.username,
      'Usuario desactivado en el sistema.'
    );

    delete saved.password;
    return saved;
  }

  async updateRole(id: number, newRole: UserRole, executor: User): Promise<User> {
    const target = await this.usersRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    this.validateHierarchy(executor, target);

    // Admin cannot elevate to Superadmin or Admin
    if (executor.role === UserRole.ADMIN && (newRole === UserRole.SUPERADMIN || newRole === UserRole.ADMIN)) {
      throw new ForbiddenException('Un Administrador no puede asignar roles SUPERADMIN o ADMIN.');
    }

    const oldRole = target.role;
    target.role = newRole;
    target.updatedBy = executor.id;
    const saved = await this.usersRepository.save(target);

    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'CAMBIO_ROL',
      executor.id,
      executor.username,
      `Rol cambiado de ${oldRole} a ${newRole}`
    );

    delete saved.password;
    return saved;
  }

  async resetPassword(id: number, newPass: string, executor: User): Promise<User> {
    const target = await this.usersRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    this.validateHierarchy(executor, target);

    const hashedPassword = await bcrypt.hash(newPass, 10);
    target.password = hashedPassword;
    target.updatedBy = executor.id;
    const saved = await this.usersRepository.save(target);

    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'RESTABLECIMIENTO_CONTRASENA',
      executor.id,
      executor.username,
      'Contraseña restablecida por un administrador.'
    );

    delete saved.password;
    return saved;
  }

  async softDelete(id: number, executor: User): Promise<void> {
    const target = await this.usersRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    this.validateHierarchy(executor, target);

    target.deletedBy = executor.id;
    // Save the deletedBy column first
    await this.usersRepository.save(target);
    // Execute soft delete
    await this.usersRepository.softRemove(target);

    await this.auditoriaService.registrarAccionUsuario(
      target.id,
      target.username,
      'ELIMINACION_LOGICA',
      executor.id,
      executor.username,
      'Usuario eliminado lógicamente (soft delete).'
    );
  }

  async listAll(executor: User): Promise<User[]> {
    // If executor is admin, list only non-admin and non-superadmin users (e.g. operarios and hidraulicos)
    // If executor is superadmin, list all users
    if (executor.role === UserRole.SUPERADMIN) {
      return this.usersRepository.find({
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        order: { id: 'ASC' },
      });
    }

    if (executor.role === UserRole.ADMIN) {
      return this.usersRepository.find({
        where: [
          { role: UserRole.OPERARIO },
          { role: UserRole.HIDRAULICO }
        ],
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        order: { id: 'ASC' },
      });
    }

    return [];
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  async seed(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    
    const saved = await this.usersRepository.save(newUser);
    
    await this.auditoriaService.registrarAccionUsuario(
      saved.id,
      saved.username,
      'CREACION',
      null,
      'SISTEMA',
      'Sembrado de usuario inicial por el sistema'
    );
    
    delete saved.password;
    return saved;
  }
}


