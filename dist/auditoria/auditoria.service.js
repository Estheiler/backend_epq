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
exports.AuditoriaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auditoria_usuario_entity_1 = require("./entities/auditoria-usuario.entity");
const auditoria_acceso_entity_1 = require("./entities/auditoria-acceso.entity");
const user_entity_1 = require("../users/entities/user.entity");
let AuditoriaService = class AuditoriaService {
    userAuditRepository;
    accessAuditRepository;
    constructor(userAuditRepository, accessAuditRepository) {
        this.userAuditRepository = userAuditRepository;
        this.accessAuditRepository = accessAuditRepository;
    }
    async registrarAccionUsuario(usuarioAfectadoId, usuarioAfectadoUsername, accion, ejecutorId, ejecutorUsername, detalles) {
        const log = this.userAuditRepository.create({
            usuarioAfectadoId,
            usuarioAfectadoUsername,
            accion,
            ejecutorId,
            ejecutorUsername,
            detalles,
        });
        return this.userAuditRepository.save(log);
    }
    async registrarAcceso(username, accion, ip, userAgent, detalles) {
        const log = this.accessAuditRepository.create({
            username,
            accion,
            ip,
            userAgent,
            detalles,
        });
        return this.accessAuditRepository.save(log);
    }
    async listarAuditoriaUsuarios(role) {
        if (role === user_entity_1.UserRole.SUPERADMIN) {
            return this.userAuditRepository.find({
                order: { fecha: 'DESC' },
            });
        }
        if (role === user_entity_1.UserRole.ADMIN) {
            return this.userAuditRepository
                .createQueryBuilder('audit')
                .innerJoin(user_entity_1.User, 'user', 'audit.usuario_afectado_id = user.id')
                .where('user.role IN (:...roles)', { roles: [user_entity_1.UserRole.OPERARIO, user_entity_1.UserRole.HIDRAULICO] })
                .orderBy('audit.fecha', 'DESC')
                .getMany();
        }
        return [];
    }
    async listarAuditoriaAccesos(role) {
        if (role === user_entity_1.UserRole.SUPERADMIN) {
            return this.accessAuditRepository.find({
                order: { fecha: 'DESC' },
            });
        }
        if (role === user_entity_1.UserRole.ADMIN) {
            return this.accessAuditRepository
                .createQueryBuilder('audit')
                .innerJoin(user_entity_1.User, 'user', 'audit.username = user.username')
                .where('user.role IN (:...roles)', { roles: [user_entity_1.UserRole.OPERARIO, user_entity_1.UserRole.HIDRAULICO] })
                .orderBy('audit.fecha', 'DESC')
                .getMany();
        }
        return [];
    }
};
exports.AuditoriaService = AuditoriaService;
exports.AuditoriaService = AuditoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auditoria_usuario_entity_1.AuditoriaUsuario)),
    __param(1, (0, typeorm_1.InjectRepository)(auditoria_acceso_entity_1.AuditoriaAcceso)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuditoriaService);
//# sourceMappingURL=auditoria.service.js.map