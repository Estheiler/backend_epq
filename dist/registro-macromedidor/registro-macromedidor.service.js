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
exports.RegistroMacromedidorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registro_macromedidor_entity_1 = require("./entities/registro-macromedidor.entity");
let RegistroMacromedidorService = class RegistroMacromedidorService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(createDto, operarioId) {
        const { fecha, hora, lectura_m3 } = createDto;
        const existing = await this.repository.findOne({ where: { fecha, hora } });
        if (existing) {
            throw new common_1.ConflictException(`Ya existe una lectura registrada para la fecha ${fecha} a la hora ${hora}.`);
        }
        const lecturaM3 = Number((lectura_m3 * 10).toFixed(2));
        const previous = await this.repository.createQueryBuilder('registro')
            .where('registro.fecha < :fecha OR (registro.fecha = :fecha AND registro.hora < :hora)', { fecha, hora })
            .orderBy('registro.fecha', 'DESC')
            .addOrderBy('registro.hora', 'DESC')
            .getOne();
        const consolidadoM3 = previous ? Number((lecturaM3 - previous.lectura_m3).toFixed(2)) : 0;
        const sameDayPrevious = await this.repository.createQueryBuilder('registro')
            .select('SUM(registro.consolidado_m3)', 'total')
            .where('registro.fecha = :fecha AND registro.hora < :hora', { fecha, hora })
            .getRawOne();
        const sameDaySum = sameDayPrevious?.total ? Number(sameDayPrevious.total) : 0;
        const consumoAcumuladoDia = Number((sameDaySum + consolidadoM3).toFixed(2));
        const newRecord = this.repository.create({
            ...createDto,
            lectura_m3: lecturaM3,
            consolidado_m3: consolidadoM3,
            consumo_acumulado_dia: consumoAcumuladoDia,
            operario_id: operarioId,
            createdBy: operarioId,
        });
        const savedRecord = await this.repository.save(newRecord);
        await this.handleSubsequentRecalculation(fecha, hora, savedRecord);
        return (await this.repository.findOne({ where: { id: savedRecord.id } }));
    }
    async handleSubsequentRecalculation(fecha, hora, savedRecord) {
        const nextReading = await this.repository.createQueryBuilder('registro')
            .where('registro.fecha > :fecha OR (registro.fecha = :fecha AND registro.hora > :hora)', { fecha, hora })
            .orderBy('registro.fecha', 'ASC')
            .addOrderBy('registro.hora', 'ASC')
            .getOne();
        if (nextReading) {
            nextReading.consolidado_m3 = Number((nextReading.lectura_m3 - savedRecord.lectura_m3).toFixed(2));
            await this.repository.save(nextReading);
        }
        const dayReadings = await this.repository.createQueryBuilder('registro')
            .where('registro.fecha = :fecha', { fecha })
            .orderBy('registro.hora', 'ASC')
            .getMany();
        let runningSum = 0;
        for (const reg of dayReadings) {
            runningSum = Number((runningSum + Number(reg.consolidado_m3)).toFixed(2));
            reg.consumo_acumulado_dia = runningSum;
            await this.repository.save(reg);
        }
    }
    async findAll() {
        return this.repository.find({
            relations: { createdByUser: true },
            order: { fecha: 'DESC', hora: 'DESC' },
        });
    }
    async findByDate(fecha) {
        return this.repository.find({
            where: { fecha },
            relations: { createdByUser: true },
            order: { hora: 'ASC' },
        });
    }
    async findByDateRange(fechaInicio, fechaFin) {
        return this.repository.createQueryBuilder('registro')
            .leftJoinAndSelect('registro.createdByUser', 'user')
            .where('registro.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .orderBy('registro.fecha', 'ASC')
            .addOrderBy('registro.hora', 'ASC')
            .getMany();
    }
    async findByMonth(anio, mes) {
        return this.repository.createQueryBuilder('registro')
            .leftJoinAndSelect('registro.createdByUser', 'user')
            .where('YEAR(registro.fecha) = :anio AND MONTH(registro.fecha) = :mes', { anio, mes })
            .orderBy('registro.fecha', 'ASC')
            .addOrderBy('registro.hora', 'ASC')
            .getMany();
    }
    async getCurvesData(fechaInicio, fechaFin) {
        const data = await this.findByDateRange(fechaInicio, fechaFin);
        return data.map((r) => ({
            id: r.id,
            fecha: r.fecha,
            hora: r.hora,
            timestamp: `${r.fecha} ${String(r.hora).padStart(2, '0')}:00`,
            lectura: Number(r.lectura_m3),
            consolidado: Number(r.consolidado_m3),
            acumulado: Number(r.consumo_acumulado_dia),
            observaciones: r.observaciones,
        }));
    }
    async remove(id, userId) {
        const record = await this.repository.findOne({ where: { id } });
        if (!record) {
            throw new common_1.NotFoundException(`No se encontró el registro con ID ${id}`);
        }
        const { fecha, hora } = record;
        await this.repository.remove(record);
        const nextReading = await this.repository.createQueryBuilder('registro')
            .where('registro.fecha > :fecha OR (registro.fecha = :fecha AND registro.hora > :hora)', { fecha, hora })
            .orderBy('registro.fecha', 'ASC')
            .addOrderBy('registro.hora', 'ASC')
            .getOne();
        if (nextReading) {
            const newPrev = await this.repository.createQueryBuilder('registro')
                .where('registro.fecha < :f OR (registro.fecha = :f AND registro.hora < :h)', { f: nextReading.fecha, h: nextReading.hora })
                .orderBy('registro.fecha', 'DESC')
                .addOrderBy('registro.hora', 'DESC')
                .getOne();
            nextReading.consolidado_m3 = newPrev ? Number((nextReading.lectura_m3 - newPrev.lectura_m3).toFixed(2)) : 0;
            await this.repository.save(nextReading);
        }
        const dayReadings = await this.repository.createQueryBuilder('registro')
            .where('registro.fecha = :fecha', { fecha })
            .orderBy('registro.hora', 'ASC')
            .getMany();
        let runningSum = 0;
        for (const reg of dayReadings) {
            runningSum = Number((runningSum + Number(reg.consolidado_m3)).toFixed(2));
            reg.consumo_acumulado_dia = runningSum;
            await this.repository.save(reg);
        }
    }
    async update(id, updateDto, userId) {
        const record = await this.repository.findOne({ where: { id } });
        if (!record) {
            throw new common_1.NotFoundException(`No se encontró el registro con ID ${id}`);
        }
        const { lectura_m3, observaciones } = updateDto;
        if (observaciones !== undefined) {
            record.observaciones = observaciones;
        }
        let lecturaChanged = false;
        if (lectura_m3 !== undefined) {
            const lecturaM3 = Number((lectura_m3 * 10).toFixed(2));
            if (Number(lecturaM3) !== Number(record.lectura_m3)) {
                lecturaChanged = true;
                record.lectura_m3 = lecturaM3;
            }
        }
        record.updatedBy = userId;
        if (lecturaChanged) {
            const previous = await this.repository.createQueryBuilder('registro')
                .where('registro.fecha < :fecha OR (registro.fecha = :fecha AND registro.hora < :hora)', { fecha: record.fecha, hora: record.hora })
                .orderBy('registro.fecha', 'DESC')
                .addOrderBy('registro.hora', 'DESC')
                .getOne();
            record.consolidado_m3 = previous ? Number((record.lectura_m3 - previous.lectura_m3).toFixed(2)) : 0;
        }
        const savedRecord = await this.repository.save(record);
        if (lecturaChanged) {
            await this.handleSubsequentRecalculation(record.fecha, record.hora, savedRecord);
        }
        return (await this.repository.findOne({ where: { id } }));
    }
};
exports.RegistroMacromedidorService = RegistroMacromedidorService;
exports.RegistroMacromedidorService = RegistroMacromedidorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_macromedidor_entity_1.RegistroMacromedidor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RegistroMacromedidorService);
//# sourceMappingURL=registro-macromedidor.service.js.map