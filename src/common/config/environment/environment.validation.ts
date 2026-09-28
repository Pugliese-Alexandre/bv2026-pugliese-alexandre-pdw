import { z } from 'zod';
import { AppMode, DatabaseType, LogLevel } from '../data/enum';

const booleanFromStringSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const appModeSchema = z
  .enum(['DEV', 'TEST', 'PROD', 'development', 'test', 'production'])
  .transform((value) => {
    if (value === 'development') {
      return AppMode.Dev;
    }

    if (value === 'test') {
      return AppMode.Test;
    }

    if (value === 'production') {
      return AppMode.Prod;
    }

    return value as AppMode;
  });

const environmentSchema = z.object({
  APP_NAME: z.string().min(1).default('api'),
  APP_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_BASE_URL: z.string().min(1).default('api'),
  APP_HTTP_PAYLOAD_ERROR_CODE: z.coerce.number().int().default(422),
  NODE_ENV: appModeSchema,
  LOG_LEVEL: z.nativeEnum(LogLevel).default(LogLevel.Debug),

  SWAGGER_ENABLED: booleanFromStringSchema.default(true),
  SWAGGER_TITLE: z.string().min(1).default('API'),
  SWAGGER_DESCRIPTION: z.string().min(1).default('HTTP API'),
  SWAGGER_VERSION: z.string().min(1).default('0.1.0'),
  SWAGGER_PATH: z.string().min(1).default('docs'),

  DB_TYPE: z.nativeEnum(DatabaseType),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),
  DB_SYNC: booleanFromStringSchema,
  DB_MIGRATION: booleanFromStringSchema,
  DB_LOG: booleanFromStringSchema,
  DB_SCHEMA: z
    .string()
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .default('public'),
});

export type ValidatedEnvironment = z.infer<typeof environmentSchema>;

export const validateEnvironment = (
  config: Record<string, unknown>,
): ValidatedEnvironment => {
  const result = environmentSchema.safeParse(config);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return result.data;
};
