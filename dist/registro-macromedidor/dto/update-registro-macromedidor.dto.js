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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRegistroMacromedidorDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateRegistroMacromedidorDto {
    lectura_m3;
    observaciones;
}
exports.UpdateRegistroMacromedidorDto = UpdateRegistroMacromedidorDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La lectura debe ser un valor numérico.' }),
    (0, class_validator_1.Min)(0, { message: 'La lectura debe ser un número positivo.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRegistroMacromedidorDto.prototype, "lectura_m3", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Las observaciones deben ser texto.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRegistroMacromedidorDto.prototype, "observaciones", void 0);
//# sourceMappingURL=update-registro-macromedidor.dto.js.map