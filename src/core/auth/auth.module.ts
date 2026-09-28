import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthIdentifierEntity } from './data/entity/auth-identifier.entity';
import { PasswordCredentialEntity } from './data/entity/password-credential.entity';
import { AuthSessionEntity } from './data/entity/auth-session.entity';
import { AuthRefreshTokenEntity } from './data/entity/auth-refresh-token.entity';
import { PasswordHasherService } from './service/password-hasher.service';
import { PasswordPolicyService } from './service/password-policy.service';
import { TokenCryptoService } from './service/token-crypto.service';
import { AuthCookieService } from './service/auth-cookie.service';
import { CsrfService } from './service/csrf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthIdentifierEntity,
      PasswordCredentialEntity,
      AuthSessionEntity,
      AuthRefreshTokenEntity,
    ]),
  ],
  providers: [
    PasswordHasherService,
    PasswordPolicyService,
    TokenCryptoService,
    AuthCookieService,
    CsrfService,
  ],
  exports: [
    PasswordHasherService,
    PasswordPolicyService,
    TokenCryptoService,
    AuthCookieService,
    CsrfService,
  ],
})
export class AuthModule {}
