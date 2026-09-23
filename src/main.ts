import { EnvService } from '@common/config';
import { AppLogger } from '@common/logging';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppModule } from '@root/app.module';

export const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(),
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  const envService = app.get(EnvService);

  await app.listen(envService.appPort);

  const appLogger = await app.resolve(AppLogger);
  appLogger.setContext('Bootstrap');

  appLogger.application({
    event: 'application.started',
    port: envService.appPort,
  });
};

void bootstrap();
