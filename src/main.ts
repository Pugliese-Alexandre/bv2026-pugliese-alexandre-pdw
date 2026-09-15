import { EnvService } from '@common/config/env.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@root/app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule.register());
  const envService: EnvService = app.get(EnvService);
  await app.listen(envService.appPort);
};

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
