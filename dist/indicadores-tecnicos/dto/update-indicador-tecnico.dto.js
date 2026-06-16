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
exports.UpdateIndicadorTecnicoDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateIndicadorTecnicoDto {
    fecha;
    cobertura_acueducto;
    usuarios_acueducto;
    micromedicion_nominal;
    micromedicion_real;
    irca;
    ianc_promedio;
    produccion_acueducto;
    consumo_acueducto;
    continuidad_acueducto;
    cobertura_alcantarillado;
    usuarios_alcantarillado;
    cobertura_aseo;
    usuarios_aseo;
    barrido_km;
    continuidad_aseo;
    produccion_residuos_ton;
}
exports.UpdateIndicadorTecnicoDto = UpdateIndicadorTecnicoDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe ser un formato de fecha válido (AAAA-MM-DD).' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIndicadorTecnicoDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La cobertura de acueducto debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "cobertura_acueducto", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Los usuarios de acueducto deben ser un número entero.' }),
    (0, class_validator_1.Min)(0, { message: 'Los usuarios de acueducto no pueden ser negativos.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "usuarios_acueducto", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La micromedición nominal debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "micromedicion_nominal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La micromedición real debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "micromedicion_real", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El IRCA debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "irca", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El IANC promedio debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "ianc_promedio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La producción de acueducto debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "produccion_acueducto", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El consumo de acueducto debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "consumo_acueducto", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La continuidad de acueducto debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "continuidad_acueducto", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La cobertura de alcantarillado debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "cobertura_alcantarillado", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Los usuarios de alcantarillado deben ser un número entero.' }),
    (0, class_validator_1.Min)(0, { message: 'Los usuarios de alcantarillado no pueden ser negativos.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "usuarios_alcantarillado", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La cobertura de aseo debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "cobertura_aseo", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Los usuarios de aseo deben ser un número entero.' }),
    (0, class_validator_1.Min)(0, { message: 'Los usuarios de aseo no pueden ser negativos.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "usuarios_aseo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El barrido en km debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "barrido_km", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La continuidad de aseo debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "continuidad_aseo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La producción de residuos en toneladas debe ser un número.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateIndicadorTecnicoDto.prototype, "produccion_residuos_ton", void 0);
//# sourceMappingURL=update-indicador-tecnico.dto.js.map