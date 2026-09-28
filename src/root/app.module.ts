import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigModule } from '@common/config';
import { ApplicationLifecycleLogger, LoggingModule } from '@common/logging';
import { ApiInterceptor, HttpExceptionFilter } from '@common/api';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@common/database';
import { AccountModule } from '@core/account';
import { AuthModule } from '@core/auth/auth.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        AppConfigModule.register(),
        LoggingModule,
        DatabaseModule,
        AccountModule,
        AuthModule,
      ],
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
