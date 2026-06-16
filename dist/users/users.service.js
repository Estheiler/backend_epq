"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
let UsersService = class UsersService {
    usersRepository;
    auditoriaService;
    constructor(usersRepository, auditoriaService) {
        this.usersRepository = usersRepository;
        this.auditoriaService = auditoriaService;
    }
    async findOneByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async findOneById(id) {
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
    validateHierarchy(executor, target) {
        if (executor.role === user_entity_1.UserRole.SUPERADMIN) {
            return;
        }
        if (executor.role === user_entity_1.UserRole.ADMIN) {
            if (target.role === user_entity_1.UserRole.SUPERADMIN || target.role === user_entity_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException(`No tiene permisos para modificar o gestionar a este usuario (${target.username}) con rol de nivel superior o igual.`);
            }
            return;
        }
        throw new common_1.ForbiddenException('No tiene permisos para gestionar usuarios.');
    }
    async create(createUserDto, executor) {
        const { username, password, role } = createUserDto;
        if (executor.role === user_entity_1.UserRole.ADMIN && (role === user_entity_1.UserRole.SUPERADMIN || role === user_entity_1.UserRole.ADMIN)) {
            throw new common_1.ForbiddenException(`Un Administrador no puede crear usuarios con rol ${role}.`);
        }
        const existing = await this.findOneByUsername(username);
        if (existing) {
            throw new common_1.ConflictException(`El usuario '${username}' ya está registrado.`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({
            username,
            password: hashedPassword,
            role,
            createdBy: executor.id,
        });
        const saved = await this.usersRepository.save(newUser);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'CREACION', executor.id, executor.username, `Usuario creado con rol: ${role}`);
        delete saved.password;
        return saved;
    }
    async update(id, data, executor) {
        const target = await this.usersRepository.findOne({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        this.validateHierarchy(executor, target);
        if (data.username && data.username !== target.username) {
            const existing = await this.findOneByUsername(data.username);
            if (existing) {
                throw new common_1.ConflictException(`El nombre de usuario '${data.username}' ya está en uso.`);
            }
            target.username = data.username;
        }
        target.updatedBy = executor.id;
        const saved = await this.usersRepository.save(target);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'ACTUALIZACION_DATOS', executor.id, executor.username, `Datos actualizados. Nuevo username: ${saved.username}`);
        delete saved.password;
        return saved;
    }
    async activate(id, executor) {
        const target = await this.usersRepository.findOne({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        this.validateHierarchy(executor, target);
        target.isActive = true;
        target.updatedBy = executor.id;
        const saved = await this.usersRepository.save(target);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'ACTIVACION', executor.id, executor.username, 'Usuario activado en el sistema.');
        delete saved.password;
        return saved;
    }
    async deactivate(id, executor) {
        const target = await this.usersRepository.findOne({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        this.validateHierarchy(executor, target);
        target.isActive = false;
        target.updatedBy = executor.id;
        const saved = await this.usersRepository.save(target);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'DESACTIVACION', executor.id, executor.username, 'Usuario desactivado en el sistema.');
        delete saved.password;
        return saved;
    }
    async updateRole(id, newRole, executor) {
        const target = await this.usersRepository.findOne({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        this.validateHierarchy(executor, target);
        if (executor.role === user_entity_1.UserRole.ADMIN && (newRole === user_entity_1.UserRole.SUPERADMIN || newRole === user_entity_1.UserRole.ADMIN)) {
            throw new common_1.ForbiddenException('Un Administrador no puede asignar roles SUPERADMIN o ADMIN.');
        }
        const oldRole = target.role;
        target.role = newRole;
        target.updatedBy = executor.id;
        const saved = await this.usersRepository.save(target);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'CAMBIO_ROL', executor.id, executor.username, `Rol cambiado de ${oldRole} a ${newRole}`);
        delete saved.password;
        return saved;
    }
    async resetPassword(id, newPass, executor) {
        const target = await this.usersRepository.findOne({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        this.validateHierarchy(executor, target);
        const hashedPassword = await bcrypt.hash(newPass, 10);
        target.password = hashedPassword;
        target.updatedBy = executor.id;
        const saved = await this.usersRepository.save(target);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'RESTABLECIMIENTO_CONTRASENA', executor.id, executor.username, 'Contraseña restablecida por un administrador.');
        delete saved.password;
        return saved;
    }
    async softDelete(id, executor) {
        const target = await this.usersRepository.findOne({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        this.validateHierarchy(executor, target);
        target.deletedBy = executor.id;
        await this.usersRepository.save(target);
        await this.usersRepository.softRemove(target);
        await this.auditoriaService.registrarAccionUsuario(target.id, target.username, 'ELIMINACION_LOGICA', executor.id, executor.username, 'Usuario eliminado lógicamente (soft delete).');
    }
    async listAll(executor) {
        if (executor.role === user_entity_1.UserRole.SUPERADMIN) {
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
        if (executor.role === user_entity_1.UserRole.ADMIN) {
            return this.usersRepository.find({
                where: [
                    { role: user_entity_1.UserRole.OPERARIO },
                    { role: user_entity_1.UserRole.HIDRAULICO }
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
    async count() {
        return this.usersRepository.count();
    }
    async seed(createUserDto) {
        const { username, password, role } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({
            username,
            password: hashedPassword,
            role,
        });
        const saved = await this.usersRepository.save(newUser);
        await this.auditoriaService.registrarAccionUsuario(saved.id, saved.username, 'CREACION', null, 'SISTEMA', 'Sembrado de usuario inicial por el sistema');
        delete saved.password;
        return saved;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auditoria_service_1.AuditoriaService])
], UsersService);
//# sourceMappingURL=users.service.js.map