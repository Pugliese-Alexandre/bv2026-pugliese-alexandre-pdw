/**
 * Pipe de validation des identifiants ULID.
 *
 * Vérifie qu'un identifiant reçu dans une requête respecte le format ULID.
 * Si le format est invalide, la requête est rejetée avec une erreur 400.
 */

import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ApiCodeResponse, ApiException } from '@common/api';
import { ULID_REGEX } from '@common/database';

@Injectable()
export class ParseUlidPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (typeof value !== 'string' || !ULID_REGEX.test(value)) {
      throw new ApiException({
        statusCode: HttpStatus.BAD_REQUEST,
        code: ApiCodeResponse.CommonInvalidIdentifier,
        logMessage: `Invalid ULID for parameter "${metadata.data ?? 'unknown'}"`,
      });
    }

    return value;
  }
}
