import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthIdentifierEntity } from './data/entity/auth-identifier.entity';
import { PasswordCredentialEntity } from './data/entity/password-credential.entity';
import { AuthSessionEntity } from './data/entity/auth-session.entity';
import { AuthRefreshTokenEntity } from './data/entity/auth-refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthIdentifierEntity,
      PasswordCredentialEntity,
      AuthSessionEntity,
      AuthRefreshTokenEntity,
    ]),
  ],
})
export class AuthModule {}
