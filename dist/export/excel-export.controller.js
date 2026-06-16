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
exports.ExcelExportController = void 0;
const common_1 = require("@nestjs/common");
const excel_export_service_1 = require("./excel-export.service");
const indicadores_tecnicos_service_1 = require("../indicadores-tecnicos/indicadores-tecnicos.service");
const registro_macromedidor_service_1 = require("../registro-macromedidor/registro-macromedidor.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
const filter_indicador_tecnico_dto_1 = require("../indicadores-tecnicos/dto/filter-indicador-tecnico.dto");
let ExcelExportController = class ExcelExportController {
    excelExportService;
    indicadoresService;
    macromedidorService;
    constructor(excelExportService, indicadoresService, macromedidorService) {
        this.excelExportService = excelExportService;
        this.indicadoresService = indicadoresService;
        this.macromedidorService = macromedidorService;
    }
    async exportIndicadores(filters, res) {
        try {
            const records = await this.indicadoresService.findAll(filters);
            const buffer = await this.excelExportService.exportIndicadores(records);
            const dateStr = new Date().toISOString().substring(0, 10);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=indicadores_tecnicos_${dateStr}.xlsx`);
            res.end(buffer);
        }
        catch (err) {
            throw new common_1.BadRequestException('Error al generar la exportación de indicadores técnicos: ' + err.message);
        }
    }
    async exportMacromedidor(fecha, fechaInicio, fechaFin, anioStr, mesStr, user, res) {
        try {
            let records = [];
            if (fechaInicio && fechaFin) {
                records = await this.macromedidorService.findByDateRange(fechaInicio, fechaFin);
            }
            else if (anioStr && mesStr) {
                const anio = parseInt(anioStr, 10);
                const mes = parseInt(mesStr, 10);
                if (isNaN(anio) || isNaN(mes)) {
                    throw new common_1.BadRequestException('El año y mes deben ser valores numéricos válidos.');
                }
                records = await this.macromedidorService.findByMonth(anio, mes);
            }
            else if (fecha) {
                records = await this.macromedidorService.findByDate(fecha);
            }
            else {
                records = await this.macromedidorService.findAll();
            }
            if (user.role === user_entity_1.UserRole.OPERARIO) {
                records = records.filter((r) => r.operario_id === user.id);
            }
            const buffer = await this.excelExportService.exportMacromedidor(records);
            const dateStr = new Date().toISOString().substring(0, 10);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=registro_macromedidor_${dateStr}.xlsx`);
            res.end(buffer);
        }
        catch (err) {
            throw new common_1.BadRequestException('Error al generar la exportación de macromedidor: ' + err.message);
        }
    }
};
exports.ExcelExportController = ExcelExportController;
__decorate([
    (0, common_1.Get)('indicadores-tecnicos'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.HIDRAULICO),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_indicador_tecnico_dto_1.FilterIndicadorTecnicoDto, Object]),
    __metadata("design:returntype", Promise)
], ExcelExportController.prototype, "exportIndicadores", null);
__decorate([
    (0, common_1.Get)('registro-macromedidor'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.HIDRAULICO, user_entity_1.UserRole.OPERARIO),
    __param(0, (0, common_1.Query)('fecha')),
    __param(1, (0, common_1.Query)('fechaInicio')),
    __param(2, (0, common_1.Query)('fechaFin')),
    __param(3, (0, common_1.Query)('anio')),
    __param(4, (0, common_1.Query)('mes')),
    __param(5, (0, get_user_decorator_1.GetUser)()),
    __param(6, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], ExcelExportController.prototype, "exportMacromedidor", null);
exports.ExcelExportController = ExcelExportController = __decorate([
    (0, common_1.Controller)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [excel_export_service_1.ExcelExportService,
        indicadores_tecnicos_service_1.IndicadoresTecnicosService,
        registro_macromedidor_service_1.RegistroMacromedidorService])
], ExcelExportController);
//# sourceMappingURL=excel-export.controller.js.map