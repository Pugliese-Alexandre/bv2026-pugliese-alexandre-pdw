import { Injectable } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { AuthSecurityException } from '../data/exception/auth-security.exception';
import { AuthSessionEntity } from '../data/entity/auth-session.entity';
import { TokenCryptoService } from './token-crypto.service';

@Injectable()
export class CsrfService {
  constructor(private readonly tokenCrypto: TokenCryptoService) {}

  assertValid(request: Request, session: AuthSessionEntity): void {
    const token = request.header('X-CSRF-Token');

    if (!token || token.length > 512) {
      throw new AuthSecurityException('api.security.csrf-invalid', 403);
    }

    const actual = Buffer.from(this.tokenCrypto.fingerprint(token), 'hex');

    const expected = Buffer.from(session.csrfTokenHash, 'hex');

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      throw new AuthSecurityException('api.security.csrf-invalid', 403);
    }
  }
}
