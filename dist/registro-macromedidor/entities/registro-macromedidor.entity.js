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
exports.RegistroMacromedidor = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let RegistroMacromedidor = class RegistroMacromedidor {
    id;
    fecha;
    hora;
    lectura_m3;
    consolidado_m3;
    consumo_acumulado_dia;
    operario_id;
    observaciones;
    createdBy;
    createdByUser;
    updatedBy;
    deletedBy;
    created_at;
    updatedAt;
    deletedAt;
};
exports.RegistroMacromedidor = RegistroMacromedidor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], RegistroMacromedidor.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "hora", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "lectura_m3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "consolidado_m3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "consumo_acumulado_dia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "operario_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RegistroMacromedidor.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], RegistroMacromedidor.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'deleted_by', nullable: true }),
    __metadata("design:type", Number)
], RegistroMacromedidor.prototype, "deletedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_at' }),
    __metadata("design:type", Date)
], RegistroMacromedidor.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], RegistroMacromedidor.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', name: 'deleted_at', nullable: true }),
    __metadata("design:type", Date)
], RegistroMacromedidor.prototype, "deletedAt", void 0);
exports.RegistroMacromedidor = RegistroMacromedidor = __decorate([
    (0, typeorm_1.Entity)('registro_macromedidor'),
    (0, typeorm_1.Unique)(['fecha', 'hora'])
], RegistroMacromedidor);
//# sourceMappingURL=registro-macromedidor.entity.js.map