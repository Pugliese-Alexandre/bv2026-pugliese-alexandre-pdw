import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './environment/environment.validation';
import { EnvService } from './env.service';

/**
 * Module global chargé de la configuration de l'application.
 *
 * Initialise le système de configuration, valide les variables
 * d'environnement au démarrage et fournit EnvService
 * au reste de l'application.
 */

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
