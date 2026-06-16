"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicadoresTecnicosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const indicador_tecnico_entity_1 = require("./entities/indicador-tecnico.entity");
const indicadores_tecnicos_service_1 = require("./indicadores-tecnicos.service");
const indicadores_tecnicos_controller_1 = require("./indicadores-tecnicos.controller");
let IndicadoresTecnicosModule = class IndicadoresTecnicosModule {
};
exports.IndicadoresTecnicosModule = IndicadoresTecnicosModule;
exports.IndicadoresTecnicosModule = IndicadoresTecnicosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([indicador_tecnico_entity_1.IndicadorTecnico])],
        controllers: [indicadores_tecnicos_controller_1.IndicadoresTecnicosController],
        providers: [indicadores_tecnicos_service_1.IndicadoresTecnicosService],
        exports: [indicadores_tecnicos_service_1.IndicadoresTecnicosService],
    })
], IndicadoresTecnicosModule);
//# sourceMappingURL=indicadores-tecnicos.module.js.map