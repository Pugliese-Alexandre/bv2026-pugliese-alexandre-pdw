import { HttpStatus } from '@nestjs/common';
import { ApiCodeResponse, ApiException, ApiValidationError } from '@common/api';

/**
 * Exception déclenchée lorsqu'un mot de passe
 * ne respecte pas la politique de sécurité définie.
 *
 * Elle renvoie les erreurs de validation correspondantes
 * avec un statut HTTP 422 (Unprocessable Entity).
 */

export class PasswordPolicyException extends ApiException<null> {
  constructor(validationErrors: ApiValidationError[]) {
    super({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      code: ApiCodeResponse.AuthPasswordPolicyInvalid,
      validationErrors,
      logMessage: 'Registration rejected by password policy',
    });
  }
}
