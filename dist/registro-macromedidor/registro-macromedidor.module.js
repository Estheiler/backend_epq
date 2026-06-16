"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroMacromedidorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const registro_macromedidor_entity_1 = require("./entities/registro-macromedidor.entity");
const registro_macromedidor_service_1 = require("./registro-macromedidor.service");
const registro_macromedidor_controller_1 = require("./registro-macromedidor.controller");
let RegistroMacromedidorModule = class RegistroMacromedidorModule {
};
exports.RegistroMacromedidorModule = RegistroMacromedidorModule;
exports.RegistroMacromedidorModule = RegistroMacromedidorModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([registro_macromedidor_entity_1.RegistroMacromedidor])],
        controllers: [registro_macromedidor_controller_1.RegistroMacromedidorController],
        providers: [registro_macromedidor_service_1.RegistroMacromedidorService],
        exports: [registro_macromedidor_service_1.RegistroMacromedidorService],
    })
], RegistroMacromedidorModule);
//# sourceMappingURL=registro-macromedidor.module.js.map