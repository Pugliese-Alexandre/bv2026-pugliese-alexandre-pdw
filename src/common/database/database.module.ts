import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from '@common/config';
import { createNestTypeOrmOptions } from './typeorm/typeorm-options.factory';

/**
 * Module responsable de la connexion à la base de données.
 *
 * Configure TypeORM à partir des paramètres de l'application
 * afin d'établir la connexion avec PostgreSQL.
 */

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: createNestTypeOrmOptions,
    }),
  ],
})
export class DatabaseModule {}
