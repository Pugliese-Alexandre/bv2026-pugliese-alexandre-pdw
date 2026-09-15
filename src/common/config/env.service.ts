import { Injectable } from '@nestjs/common';
import { ValidatedEnvironment } from './environment/environment.validation';
import { ConfigService } from '@nestjs/config';
import { AppMode, ConfigKey } from './data/enum';
@Injectable()
export class EnvService {
  constructor(
    private readonly configService: ConfigService<ValidatedEnvironment, true>,
  ) {}
  get appMode(): AppMode {
    return this.get(ConfigKey.NodeEnv);
  }
  get appPort(): number {
    return this.get(ConfigKey.Port);
  }

  get<T extends keyof ValidatedEnvironment>(key: T): ValidatedEnvironment[T] {
    return this.configService.get(key, { infer: true });
  }
}
