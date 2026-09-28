import { HttpStatus } from '@nestjs/common';
import { ApiCodeResponse, ApiException } from '@common/api';

/**
 * Exception utilisée lorsqu'un contrôle de sécurité
 * lié à l'authentification échoue.
 *
 * Par défaut, elle renvoie une erreur HTTP 401 (Unauthorized),
 * mais le code et le statut peuvent être adaptés selon le cas.
 */

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
