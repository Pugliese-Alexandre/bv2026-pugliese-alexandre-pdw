import { EnvService } from '@common/config';
import { AppLogger } from '@common/logging';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { configureApplication } from '@root/bootstrap/application-bootstrap';
import { AppModule } from '@root/app.module';

export const bootstrap = async (): Promise<void> => {

  // Création de l'application NestJS à partir du module principal
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(),
    {
      bufferLogs: true,
    },
  );

  // Configuration globale de l'application
  configureApplication(app);

  // Mise en place du logger et gestion propre de l'arrêt de l'application
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  // Récupération de la configuration et démarrage du serveur
  const envService = app.get(EnvService);

  await app.listen(envService.appPort);

  // Journalise le démarrage réussi de l'application
  const appLogger = await app.resolve(AppLogger);
  appLogger.setContext('Bootstrap');

  appLogger.application({
    event: 'application.started',
    port: envService.appPort,
  });
};

void bootstrap();