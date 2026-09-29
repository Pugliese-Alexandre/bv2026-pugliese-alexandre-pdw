import { join } from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AppMode, EnvService, ValidatedEnvironment } from '../../config';

/**
 * Crée la configuration TypeORM utilisée par NestJS.
 *
 * Récupère les paramètres de la base de données depuis EnvService
 * et ajoute les options nécessaires au fonctionnement dans l'application.
 */

export const createNestTypeOrmOptions = (
  envService: EnvService,
): TypeOrmModuleOptions => {
  return {
    ...createTypeOrmDataSourceOptions({
      NODE_ENV: envService.appMode,
      DB_TYPE: envService.databaseType,
      DB_HOST: envService.databaseHost,
      DB_PORT: envService.databasePort,
      DB_USER: envService.databaseUser,
      DB_PASSWORD: envService.databasePassword,
      DB_DATABASE: envService.databaseName,
      DB_SYNC: envService.databaseSynchronize,
      DB_MIGRATION: envService.databaseMigrationsRun,
      DB_LOG: envService.databaseLogging,
      DB_SCHEMA: envService.databaseSchema,
    }),
    autoLoadEntities: true,
    manualInitialization: envService.isTest,
    retryAttempts: envService.isTest ? 0 : 3,
    retryDelay: 1000,
  };
};

/**
 * Construit les options de connexion à PostgreSQL pour TypeORM.
 *
 * Définit notamment la connexion, le schéma, la synchronisation,
 * les entités et les migrations utilisées par l'application.
 *
 * En production, la synchronisation automatique de la base est désactivée.
 */

export const createTypeOrmDataSourceOptions = (
  environment: Pick<
    ValidatedEnvironment,
    | 'NODE_ENV'
    | 'DB_TYPE'
    | 'DB_HOST'
    | 'DB_PORT'
    | 'DB_USER'
    | 'DB_PASSWORD'
    | 'DB_DATABASE'
    | 'DB_SYNC'
    | 'DB_MIGRATION'
    | 'DB_LOG'
    | 'DB_SCHEMA'
  >,
): DataSourceOptions => {
  return {
    type: environment.DB_TYPE,
    host: environment.DB_HOST,
    port: environment.DB_PORT,
    username: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_DATABASE,
    synchronize:
      environment.NODE_ENV === AppMode.Prod ? false : environment.DB_SYNC,
    migrationsRun: environment.DB_MIGRATION,
    logging: environment.DB_LOG,
    schema: environment.DB_SCHEMA,
    extra:
      environment.DB_SCHEMA === 'public'
        ? undefined
        : { options: `-c search_path="${environment.DB_SCHEMA}",public` },
    entities: [join(__dirname, '..', '..', '..', '**', '*.entity.{ts,js}')],
    migrations: [
      join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'database',
        'migrations',
        '*.{ts,js}',
      ),
    ],
  };
};
