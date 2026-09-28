import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiCodeResponse } from '../enum/api-code-response.enum';
import { ApiResponse } from '../model/api-response';
import { ApiValidationError } from '../model/api-validation-error';

export type ApiExceptionOptions<T = unknown> = {
  statusCode?: HttpStatus;
  code?: string;
  data?: T | null;
  validationErrors?: ApiValidationError[];
  logMessage?: string;
};

export class ApiException<T = unknown> extends HttpException {
  readonly apiCode: string;
  readonly apiData: T | null;
  readonly apiValidationErrors: ApiValidationError[];
  readonly logMessage?: string;

  constructor(options: ApiExceptionOptions<T> = {}) {
    const statusCode = options.statusCode ?? HttpStatus.BAD_REQUEST;

    const response = ApiResponse.error<T>({
      code: options.code ?? ApiCodeResponse.CommonError,
      data: options.data ?? null,
      validationErrors: options.validationErrors ?? [],
    });

    super(response, statusCode);

    this.apiCode = response.code;
    this.apiData = response.data;
    this.apiValidationErrors = response.validationErrors;
    this.logMessage = options.logMessage;
  }
}
