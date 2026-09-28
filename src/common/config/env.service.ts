import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidatedEnvironment } from './environment/environment.validation';
import { AppMode, ConfigKey, LogLevel } from './data/enum';

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
}
