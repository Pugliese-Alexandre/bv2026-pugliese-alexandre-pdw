import { HttpStatus } from '@nestjs/common';
import { ApiCodeResponse, ApiException } from '@common/api';

export class AuthSecurityException extends ApiException<null> {
  constructor(
    code: string = ApiCodeResponse.AuthUnauthorized,
    statusCode: HttpStatus = HttpStatus.UNAUTHORIZED,
  ) {
    super({
      statusCode,
      code,
      logMessage: 'Authentication security validation failed',
    });
  }
}
