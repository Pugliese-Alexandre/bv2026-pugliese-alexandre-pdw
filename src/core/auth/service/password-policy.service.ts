import { Injectable } from '@nestjs/common';
import { ApiValidationError } from '@common/api';
import { EnvService } from '@common/config';
import { PasswordPolicyException } from '../data/exception/password-policy.exception';

@Injectable()
export class PasswordPolicyService {
  constructor(private readonly envService: EnvService) {}

  validate(password: string): ApiValidationError[] {
    const validationErrors: ApiValidationError[] = [];

    if (password.length < this.envService.passwordMinLength) {
      validationErrors.push({
        property: 'password',
        messages: ['api.auth.register.error.password.too-short'],
      });
    }

    if (password.length > this.envService.passwordMaxLength) {
      validationErrors.push({
        property: 'password',
        messages: ['api.auth.register.error.password.too-long'],
      });
    }

    return validationErrors;
  }

  assertValid(password: string): void {
    const validationErrors = this.validate(password);

    if (validationErrors.length > 0) {
      throw new PasswordPolicyException(validationErrors);
    }
  }
}
