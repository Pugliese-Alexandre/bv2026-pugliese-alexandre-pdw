import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '@core/account';
import { AuthIdentifierEntity } from './data/entity/auth-identifier.entity';
import { PasswordCredentialEntity } from './data/entity/password-credential.entity';
import { AuthSessionEntity } from './data/entity/auth-session.entity';
import { AuthRefreshTokenEntity } from './data/entity/auth-refresh-token.entity';
import { AuthIdentifierService } from './service/auth-identifier.service';
import { PasswordCredentialService } from './service/password-credential.service';
import { PasswordHasherService } from './service/password-hasher.service';
import { PasswordPolicyService } from './service/password-policy.service';
import { AuthCookieService } from './service/auth-cookie.service';
import { CsrfService } from './service/csrf.service';
import { TokenCryptoService } from './service/token-crypto.service';

/**
 * Module d'authentification.
 *
 * Regroupe tout ce qui concerne l'authentification :
 * les entités liées à la base de données et les services nécessaires
 * à la gestion des identifiants, mots de passe, tokens, cookies et sessions.
 *
 * Le module permet à NestJS de connaître et d'injecter toutes ces dépendances.
 */

@Module({
  imports: [
    AccountModule,
    TypeOrmModule.forFeature([
      AuthIdentifierEntity,
      PasswordCredentialEntity,
      AuthSessionEntity,
      AuthRefreshTokenEntity,
    ]),
  ],
  providers: [
    AuthIdentifierService,
    PasswordCredentialService,
    PasswordHasherService,
    PasswordPolicyService,
    AuthCookieService,
    CsrfService,
    TokenCryptoService,
  ],
})
export class AuthModule {}