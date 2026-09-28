import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigModule } from '@common/config';
import { ApplicationLifecycleLogger, LoggingModule } from '@common/logging';
import { ApiInterceptor, HttpExceptionFilter } from '@common/api';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [AppConfigModule.register(), LoggingModule],
      controllers: [AppController],
      providers: [
        AppService,
        ApplicationLifecycleLogger,
        ApiInterceptor,
        HttpExceptionFilter,
      ],
    };
  }
}
