import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Error interno del servidor';
    let errors: string[] | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message = typeof exceptionResponse === 'object' 
        ? exceptionResponse.message || exceptionResponse 
        : exceptionResponse;
      
      // If validation error from class-validator
      if (typeof message === 'object' && Array.isArray(message)) {
        errors = message;
        message = 'Errores de validación en la petición';
      }
    } else {
      // Log unhandled non-HTTP exceptions (like database exceptions, programming errors)
      this.logger.error(`Excepción no controlada: ${exception.message || exception}`, exception.stack);
      
      // Customize message for common database errors
      if (exception.code === 'ER_DUP_ENTRY') {
        status = HttpStatus.CONFLICT;
        message = 'Ya existe un registro con esos datos únicos en el sistema.';
      } else if (exception.code === 'ECONNREFUSED') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'No se pudo conectar a la base de datos de Hostinger. Verifique la red y variables de entorno.';
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors && { errors }),
    });
  }
}
