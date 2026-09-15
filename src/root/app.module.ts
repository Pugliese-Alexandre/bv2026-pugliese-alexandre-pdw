import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@common/config/app-config.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [AppConfigModule.register()],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
