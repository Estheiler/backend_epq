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
exports.CreateRegistroMacromedidorDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRegistroMacromedidorDto {
    fecha;
    hora;
    lectura_m3;
    observaciones;
}
exports.CreateRegistroMacromedidorDto = CreateRegistroMacromedidorDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe tener un formato de fecha válido (AAAA-MM-DD).' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha es obligatoria.' }),
    __metadata("design:type", String)
], CreateRegistroMacromedidorDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'La hora debe ser un número entero.' }),
    (0, class_validator_1.Min)(1, { message: 'La hora debe estar entre 1 y 24.' }),
    (0, class_validator_1.Max)(24, { message: 'La hora debe estar entre 1 y 24.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora es obligatoria.' }),
    __metadata("design:type", Number)
], CreateRegistroMacromedidorDto.prototype, "hora", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La lectura debe ser un valor numérico.' }),
    (0, class_validator_1.Min)(0, { message: 'La lectura debe ser un número positivo.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La lectura en m3 es obligatoria.' }),
    __metadata("design:type", Number)
], CreateRegistroMacromedidorDto.prototype, "lectura_m3", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Las observaciones deben ser texto.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRegistroMacromedidorDto.prototype, "observaciones", void 0);
//# sourceMappingURL=create-registro-macromedidor.dto.js.map