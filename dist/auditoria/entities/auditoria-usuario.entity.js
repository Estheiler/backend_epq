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
exports.AuditoriaUsuario = void 0;
const typeorm_1 = require("typeorm");
let AuditoriaUsuario = class AuditoriaUsuario {
    id;
    usuarioAfectadoId;
    usuarioAfectadoUsername;
    accion;
    ejecutorId;
    ejecutorUsername;
    fecha;
    detalles;
};
exports.AuditoriaUsuario = AuditoriaUsuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuditoriaUsuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_afectado_id' }),
    __metadata("design:type", Number)
], AuditoriaUsuario.prototype, "usuarioAfectadoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_afectado_username' }),
    __metadata("design:type", String)
], AuditoriaUsuario.prototype, "usuarioAfectadoUsername", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditoriaUsuario.prototype, "accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'ejecutor_id', nullable: true }),
    __metadata("design:type", Object)
], AuditoriaUsuario.prototype, "ejecutorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'ejecutor_username', nullable: true }),
    __metadata("design:type", Object)
], AuditoriaUsuario.prototype, "ejecutorUsername", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'fecha' }),
    __metadata("design:type", Date)
], AuditoriaUsuario.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditoriaUsuario.prototype, "detalles", void 0);
exports.AuditoriaUsuario = AuditoriaUsuario = __decorate([
    (0, typeorm_1.Entity)('auditoria_usuarios')
], AuditoriaUsuario);
//# sourceMappingURL=auditoria-usuario.entity.js.map