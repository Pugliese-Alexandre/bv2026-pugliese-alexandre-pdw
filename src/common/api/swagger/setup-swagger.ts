import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvService } from '@common/config';

/**
 * Configure Swagger pour documenter et tester les routes de l'API.
 *
 * La documentation est activée selon la configuration de l'application
 * et prend également en compte les cookies d'authentification.
 */

export const setupSwagger = (app: INestApplication): void => {
  const envService = app.get(EnvService);

  if (!envService.swaggerEnabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle(envService.swaggerTitle)
    .setDescription(envService.swaggerDescription)
    .setVersion(envService.swaggerVersion)
    .addCookieAuth(
      envService.isProduction ? '__Host-hoos-access' : 'hoos-access',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Short-lived JWT access cookie.',
      },
      'access-cookie',
    )
    .addCookieAuth(
      envService.isProduction ? '__Host-hoos-refresh' : 'hoos-refresh',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Opaque rotating refresh-token cookie.',
      },
      'refresh-cookie',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(envService.swaggerPath, app, document, {
    jsonDocumentUrl: `${envService.swaggerPath}/openapi.json`,
  });
};
