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

  get logLevel(): LogLevel {
    return this.get(ConfigKey.LogLevel);
  }

  get isTest(): boolean {
    return this.appMode === AppMode.Test;
  }

  get<T extends keyof ValidatedEnvironment>(key: T): ValidatedEnvironment[T] {
    return this.configService.get(key, { infer: true });
  }
}
