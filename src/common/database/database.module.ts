import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from '@common/config';
import { createNestTypeOrmOptions } from './typeorm/typeorm-options.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: createNestTypeOrmOptions,
    }),
  ],
})
export class DatabaseModule {}
