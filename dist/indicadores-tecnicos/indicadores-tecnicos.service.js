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
exports.IndicadoresTecnicosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const indicador_tecnico_entity_1 = require("./entities/indicador-tecnico.entity");
let IndicadoresTecnicosService = class IndicadoresTecnicosService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(createDto, userId) {
        const newRecord = this.repository.create({
            ...createDto,
            createdBy: userId,
        });
        return this.repository.save(newRecord);
    }
    async findAll(filters) {
        const { anio, mes, fechaInicio, fechaFin } = filters;
        const queryBuilder = this.repository.createQueryBuilder('indicador');
        if (anio) {
            queryBuilder.andWhere('YEAR(indicador.fecha) = :anio', { anio });
        }
        if (mes) {
            queryBuilder.andWhere('MONTH(indicador.fecha) = :mes', { mes });
        }
        if (fechaInicio && fechaFin) {
            queryBuilder.andWhere('indicador.fecha BETWEEN :fechaInicio AND :fechaFin', {
                fechaInicio,
                fechaFin,
            });
        }
        else if (fechaInicio) {
            queryBuilder.andWhere('indicador.fecha >= :fechaInicio', { fechaInicio });
        }
        else if (fechaFin) {
            queryBuilder.andWhere('indicador.fecha <= :fechaFin', { fechaFin });
        }
        queryBuilder.orderBy('indicador.fecha', 'DESC');
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const record = await this.repository.findOne({ where: { id } });
        if (!record) {
            throw new common_1.NotFoundException(`No se encontró el indicador técnico con ID ${id}`);
        }
        return record;
    }
    async update(id, updateDto, userId) {
        const record = await this.findOne(id);
        const updated = this.repository.merge(record, {
            ...updateDto,
            updatedBy: userId,
        });
        return this.repository.save(updated);
    }
    async remove(id, userId) {
        const record = await this.findOne(id);
        record.deletedBy = userId;
        await this.repository.save(record);
        await this.repository.softRemove(record);
    }
    async getAvailableFilters() {
        const raw = await this.repository
            .createQueryBuilder('indicador')
            .select('DISTINCT YEAR(indicador.fecha)', 'anio')
            .addSelect('MONTH(indicador.fecha)', 'mes')
            .orderBy('anio', 'DESC')
            .addOrderBy('mes', 'ASC')
            .getRawMany();
        const grouped = {};
        raw.forEach((row) => {
            const year = Number(row.anio);
            const month = Number(row.mes);
            if (!year || isNaN(year) || !month || isNaN(month))
                return;
            if (!grouped[year]) {
                grouped[year] = [];
            }
            if (!grouped[year].includes(month)) {
                grouped[year].push(month);
            }
        });
        return Object.keys(grouped).map((year) => ({
            anio: Number(year),
            meses: grouped[Number(year)],
        }));
    }
};
exports.IndicadoresTecnicosService = IndicadoresTecnicosService;
exports.IndicadoresTecnicosService = IndicadoresTecnicosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(indicador_tecnico_entity_1.IndicadorTecnico)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IndicadoresTecnicosService);
//# sourceMappingURL=indicadores-tecnicos.service.js.map