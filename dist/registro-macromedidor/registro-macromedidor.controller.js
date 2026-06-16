"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroMacromedidorController = void 0;
const common_1 = require("@nestjs/common");
const registro_macromedidor_service_1 = require("./registro-macromedidor.service");
const create_registro_macromedidor_dto_1 = require("./dto/create-registro-macromedidor.dto");
const update_registro_macromedidor_dto_1 = require("./dto/update-registro-macromedidor.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
let RegistroMacromedidorController = class RegistroMacromedidorController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(createDto, operarioId) {
        const data = await this.service.create(createDto, operarioId);
        return {
            success: true,
            message: 'Lectura de macromedidor registrada exitosamente.',
            data,
        };
    }
    async findAll() {
        const data = await this.service.findAll();
        return {
            success: true,
            data,
        };
    }
    async findByDate(fecha) {
        if (!fecha) {
            throw new common_1.BadRequestException('El parámetro query "fecha" es obligatorio.');
        }
        const data = await this.service.findByDate(fecha);
        return {
            success: true,
            data,
        };
    }
    async findByDateRange(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) {
            throw new common_1.BadRequestException('Los parámetros "fechaInicio" y "fechaFin" son obligatorios.');
        }
        const data = await this.service.findByDateRange(fechaInicio, fechaFin);
        return {
            success: true,
            data,
        };
    }
    async findByMonth(anioStr, mesStr) {
        if (!anioStr || !mesStr) {
            throw new common_1.BadRequestException('Los parámetros "anio" y "mes" son obligatorios.');
        }
        const anio = parseInt(anioStr, 10);
        const mes = parseInt(mesStr, 10);
        if (isNaN(anio) || isNaN(mes)) {
            throw new common_1.BadRequestException('El año y mes deben ser números válidos.');
        }
        const data = await this.service.findByMonth(anio, mes);
        return {
            success: true,
            data,
        };
    }
    async getCurvesData(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) {
            throw new common_1.BadRequestException('Los parámetros "fechaInicio" y "fechaFin" son obligatorios.');
        }
        const data = await this.service.getCurvesData(fechaInicio, fechaFin);
        return {
            success: true,
            data,
        };
    }
    async remove(id, userId) {
        await this.service.remove(id, userId);
        return {
            success: true,
            message: 'Lectura de macromedidor eliminada y consumos recalculados exitosamente.',
        };
    }
    async update(id, updateDto, userId) {
        const data = await this.service.update(id, updateDto, userId);
        return {
            success: true,
            message: 'Lectura de macromedidor actualizada y consumos recalculados exitosamente.',
            data,
        };
    }
};
exports.RegistroMacromedidorController = RegistroMacromedidorController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.OPERARIO),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_registro_macromedidor_dto_1.CreateRegistroMacromedidorDto, Number]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('fecha'),
    __param(0, (0, common_1.Query)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)('rango'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('mes'),
    __param(0, (0, common_1.Query)('anio')),
    __param(1, (0, common_1.Query)('mes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "findByMonth", null);
__decorate([
    (0, common_1.Get)('curvas'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "getCurvesData", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_registro_macromedidor_dto_1.UpdateRegistroMacromedidorDto, Number]),
    __metadata("design:returntype", Promise)
], RegistroMacromedidorController.prototype, "update", null);
exports.RegistroMacromedidorController = RegistroMacromedidorController = __decorate([
    (0, common_1.Controller)('registro-macromedidor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [registro_macromedidor_service_1.RegistroMacromedidorService])
], RegistroMacromedidorController);
//# sourceMappingURL=registro-macromedidor.controller.js.map