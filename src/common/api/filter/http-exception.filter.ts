import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { LogCategory } from '@common/logging';
import { ApiCodeResponse } from '../data/enum/api-code-response.enum';
import { ApiException } from '../data/exception/api-exception';
import { ApiResponse } from '../data/model/api-response';

/**
 * Filtre global chargé de gérer les exceptions HTTP de l'application.
 *
 * Transforme les erreurs dans le format standard de l'API,
 * choisit le bon statut HTTP et enregistre l'erreur dans les logs.
 */

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const statusCode = this.getStatusCode(exception);
    const body = this.toApiResponse(exception);

    this.logException(exception, request, statusCode, body.code);

    response.status(statusCode).json(body);
  }

  private getStatusCode(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private toApiResponse(exception: unknown): ApiResponse<unknown> {
    if (exception instanceof ApiException) {
      const apiException: ApiException<unknown> = exception;

      return ApiResponse.error({
        code: apiException.apiCode,
        data: apiException.apiData,
        validationErrors: apiException.apiValidationErrors,
      });
    }

    if (exception instanceof HttpException) {
      return ApiResponse.error({ code: ApiCodeResponse.CommonError });
    }

    return ApiResponse.error({ code: ApiCodeResponse.CommonError });
  }

  private logException(
    exception: unknown,
    request: Request,
    statusCode: HttpStatus,
    code: string,
  ): void {
    const requestId = typeof request.id === 'string' ? request.id : undefined;

    const exceptionName =
      exception instanceof Error
        ? exception.constructor.name
        : typeof exception;

    const context = {
      category: LogCategory.Error,
      requestId,
      code,
      statusCode,
      method: request.method,
      // Utilise uniquement le chemin sans les paramètres de l'URL
      // afin d'éviter d'enregistrer des données sensibles dans les logs.
      path: request.path,
      exceptionName,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        {
          ...context,
          event: 'error.request.unhandled',
          err: exception instanceof Error ? exception : undefined,
        },
        'Unhandled HTTP exception',
      );

      return;
    }

    this.logger.warn(
      { ...context, event: 'error.request.handled' },
      'Handled HTTP exception',
    );
  }
}
