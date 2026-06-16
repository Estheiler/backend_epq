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
exports.IndicadoresTecnicosController = void 0;
const common_1 = require("@nestjs/common");
const indicadores_tecnicos_service_1 = require("./indicadores-tecnicos.service");
const create_indicador_tecnico_dto_1 = require("./dto/create-indicador-tecnico.dto");
const update_indicador_tecnico_dto_1 = require("./dto/update-indicador-tecnico.dto");
const filter_indicador_tecnico_dto_1 = require("./dto/filter-indicador-tecnico.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
let IndicadoresTecnicosController = class IndicadoresTecnicosController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(createDto, userId) {
        const data = await this.service.create(createDto, userId);
        return {
            success: true,
            message: 'Indicador técnico creado exitosamente.',
            data,
        };
    }
    async findAll(filters) {
        const data = await this.service.findAll(filters);
        return {
            success: true,
            data,
        };
    }
    async getAvailableFilters() {
        const data = await this.service.getAvailableFilters();
        return {
            success: true,
            data,
        };
    }
    async findOne(id) {
        const data = await this.service.findOne(id);
        return {
            success: true,
            data,
        };
    }
    async update(id, updateDto, userId) {
        const data = await this.service.update(id, updateDto, userId);
        return {
            success: true,
            message: 'Indicador técnico actualizado exitosamente.',
            data,
        };
    }
    async remove(id, userId) {
        await this.service.remove(id, userId);
        return {
            success: true,
            message: 'Indicador técnico eliminado exitosamente.',
        };
    }
};
exports.IndicadoresTecnicosController = IndicadoresTecnicosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_indicador_tecnico_dto_1.CreateIndicadorTecnicoDto, Number]),
    __metadata("design:returntype", Promise)
], IndicadoresTecnicosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_indicador_tecnico_dto_1.FilterIndicadorTecnicoDto]),
    __metadata("design:returntype", Promise)
], IndicadoresTecnicosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filtros-disponibles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndicadoresTecnicosController.prototype, "getAvailableFilters", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IndicadoresTecnicosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_indicador_tecnico_dto_1.UpdateIndicadorTecnicoDto, Number]),
    __metadata("design:returntype", Promise)
], IndicadoresTecnicosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IndicadoresTecnicosController.prototype, "remove", null);
exports.IndicadoresTecnicosController = IndicadoresTecnicosController = __decorate([
    (0, common_1.Controller)('indicadores-tecnicos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [indicadores_tecnicos_service_1.IndicadoresTecnicosService])
], IndicadoresTecnicosController);
//# sourceMappingURL=indicadores-tecnicos.controller.js.map