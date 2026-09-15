import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './environment/environment.validation';
import { EnvService } from './env.service';

@Global()
@Module({})
export class AppConfigModule {
  static register(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate: validateEnvironment,
        }),
      ],
      providers: [EnvService],
      exports: [EnvService],
    };
  }
}
