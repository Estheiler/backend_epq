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
exports.IndicadorTecnico = void 0;
const typeorm_1 = require("typeorm");
let IndicadorTecnico = class IndicadorTecnico {
    id;
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
    createdBy;
    updatedBy;
    deletedBy;
    created_at;
    updatedAt;
    deletedAt;
};
exports.IndicadorTecnico = IndicadorTecnico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], IndicadorTecnico.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "cobertura_acueducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "usuarios_acueducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "micromedicion_nominal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "micromedicion_real", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "irca", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "ianc_promedio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "produccion_acueducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "consumo_acueducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "continuidad_acueducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "cobertura_alcantarillado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "usuarios_alcantarillado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "cobertura_aseo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "usuarios_aseo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "barrido_km", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "continuidad_aseo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "produccion_residuos_ton", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'deleted_by', nullable: true }),
    __metadata("design:type", Number)
], IndicadorTecnico.prototype, "deletedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_at' }),
    __metadata("design:type", Date)
], IndicadorTecnico.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], IndicadorTecnico.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', name: 'deleted_at', nullable: true }),
    __metadata("design:type", Date)
], IndicadorTecnico.prototype, "deletedAt", void 0);
exports.IndicadorTecnico = IndicadorTecnico = __decorate([
    (0, typeorm_1.Entity)('indicadores_tecnicos')
], IndicadorTecnico);
//# sourceMappingURL=indicador-tecnico.entity.js.map