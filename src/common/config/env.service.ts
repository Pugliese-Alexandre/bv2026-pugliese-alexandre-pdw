import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidatedEnvironment } from './environment/environment.validation';
import { AppMode, ConfigKey, DatabaseType, LogLevel } from './data/enum';

/**
 * Service centralisant l'accès à la configuration de l'application.
 *
 * Permet de récupérer de manière typée les paramètres provenant
 * de la configuration : application, logs, Swagger, base de données
 * et sécurité de l'authentification.
 *
 * Évite d'utiliser directement ConfigService dans le reste de l'application.
 */

@Injectable()
export class EnvService {
  constructor(
    private readonly configService: ConfigService<ValidatedEnvironment, true>,
  ) {}

  get appMode(): AppMode {
    return this.get(ConfigKey.NodeEnv);
  }

  get appName(): string {
    return this.get(ConfigKey.AppName);
  }

  get appPort(): number {
    return this.get(ConfigKey.AppPort);
  }
  get appBaseUrl(): string {
    return this.get(ConfigKey.AppBaseUrl);
  }

  get httpPayloadErrorStatusCode(): number {
    return this.get(ConfigKey.AppHttpPayloadErrorCode);
  }

  get logLevel(): LogLevel {
    return this.get(ConfigKey.LogLevel);
  }

  get swaggerEnabled(): boolean {
    return this.get(ConfigKey.SwaggerEnabled);
  }

  get swaggerTitle(): string {
    return this.get(ConfigKey.SwaggerTitle);
  }

  get swaggerDescription(): string {
    return this.get(ConfigKey.SwaggerDescription);
  }

  get swaggerVersion(): string {
    return this.get(ConfigKey.SwaggerVersion);
  }

  get swaggerPath(): string {
    return this.get(ConfigKey.SwaggerPath);
  }

  get isProduction(): boolean {
    return this.appMode === AppMode.Prod;
  }

  get isTest(): boolean {
    return this.appMode === AppMode.Test;
  }

  get<T extends keyof ValidatedEnvironment>(key: T): ValidatedEnvironment[T] {
    return this.configService.get(key, { infer: true });
  }

  get databaseType(): DatabaseType {
    return this.get(ConfigKey.DbType);
  }

  get databaseHost(): string {
    return this.get(ConfigKey.DbHost);
  }

  get databasePort(): number {
    return this.get(ConfigKey.DbPort);
  }

  get databaseUser(): string {
    return this.get(ConfigKey.DbUser);
  }

  get databasePassword(): string {
    return this.get(ConfigKey.DbPassword);
  }

  get databaseName(): string {
    return this.get(ConfigKey.DbDatabase);
  }

  get databaseSynchronize(): boolean {
    return this.get(ConfigKey.DbSync);
  }

  get databaseMigrationsRun(): boolean {
    return this.get(ConfigKey.DbMigration);
  }

  get databaseLogging(): boolean {
    return this.get(ConfigKey.DbLog);
  }

  get databaseSchema(): string {
    return this.get(ConfigKey.DbSchema);
  }

  get passwordMinLength(): number {
    return this.get(ConfigKey.AuthPasswordMinLength);
  }

  get passwordMaxLength(): number {
    return this.get(ConfigKey.AuthPasswordMaxLength);
  }

  get passwordArgon2MemoryCost(): number {
    return this.get(ConfigKey.AuthPasswordArgon2MemoryCost);
  }

  get passwordArgon2TimeCost(): number {
    return this.get(ConfigKey.AuthPasswordArgon2TimeCost);
  }

  get passwordArgon2Parallelism(): number {
    return this.get(ConfigKey.AuthPasswordArgon2Parallelism);
  }

  get passwordMaxAttempts(): number {
    return this.get(ConfigKey.AuthPasswordMaxAttempts);
  }

  get passwordLockoutSeconds(): number {
    return this.get(ConfigKey.AuthPasswordLockoutSeconds);
  }

  get accessTokenTtlSeconds(): number {
    return this.get(ConfigKey.AuthAccessTokenTtlSeconds);
  }

  get refreshTokenTtlSeconds(): number {
    return this.get(ConfigKey.AuthRefreshTokenTtlSeconds);
  }

  get sessionAbsoluteTtlSeconds(): number {
    return this.get(ConfigKey.AuthSessionAbsoluteTtlSeconds);
  }

  get refreshTokenPepper(): string {
    return this.get(ConfigKey.AuthRefreshTokenPepper);
  }

  get jwtActiveKid(): string {
    return this.get(ConfigKey.AuthJwtActiveKid);
  }

  get jwtPrivateKeyBase64(): string {
    return this.get(ConfigKey.AuthJwtPrivateKeyBase64);
  }

  get jwtPublicKeysJson(): string {
    return this.get(ConfigKey.AuthJwtPublicKeysJson);
  }

  get testRefreshFailurePoint(): string {
    return this.get(ConfigKey.AuthTestRefreshFailurePoint);
  }
}
