import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IndicadoresTecnicosModule } from './indicadores-tecnicos/indicadores-tecnicos.module';
import { RegistroMacromedidorModule } from './registro-macromedidor/registro-macromedidor.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { ExcelExportModule } from './export/excel-export.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Global environment variables configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    
    // Asynchronous TypeORM connection setup
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    // Global rate limiting (throttler)
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // max 100 requests per minute
    }]),
    
    // Core Modules
    CommonModule,
    AuthModule,
    UsersModule,
    IndicadoresTecnicosModule,
    RegistroMacromedidorModule,
    AuditoriaModule,
    ExcelExportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
