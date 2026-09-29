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

/**
 * Schéma de validation des variables d'environnement de l'application.
 *
 * Utilise Zod pour vérifier et convertir la configuration au démarrage :
 * application, Swagger, base de données et sécurité de l'authentification.
 *
 * Des règles supplémentaires vérifient également la cohérence
 * et renforcent la sécurité de la configuration en production.
 */

const environmentSchema = z
  .object({
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
    AUTH_PASSWORD_MIN_LENGTH: z.coerce.number().int().min(1).default(15),

    AUTH_PASSWORD_MAX_LENGTH: z.coerce
      .number()
      .int()
      .min(64)
      .max(1024)
      .default(128),

    AUTH_PASSWORD_ARGON2_MEMORY_COST: z.coerce
      .number()
      .int()
      .min(19456)
      .default(19456),

    AUTH_PASSWORD_ARGON2_TIME_COST: z.coerce.number().int().min(2).default(2),

    AUTH_PASSWORD_ARGON2_PARALLELISM: z.coerce.number().int().min(1).default(1),

    AUTH_PASSWORD_MAX_ATTEMPTS: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(5),

    AUTH_PASSWORD_LOCKOUT_SECONDS: z.coerce.number().int().min(1).default(900),

    AUTH_ACCESS_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .min(1)
      .max(600)
      .default(600),

    AUTH_REFRESH_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .min(1)
      .default(604800),

    AUTH_SESSION_ABSOLUTE_TTL_SECONDS: z.coerce
      .number()
      .int()
      .min(1)
      .default(2592000),

    AUTH_REFRESH_TOKEN_PEPPER: z.string().default(''),

    AUTH_JWT_ACTIVE_KID: z.string().default('dev-active'),

    AUTH_JWT_PRIVATE_KEY_BASE64: z.string().default(''),

    AUTH_JWT_PUBLIC_KEYS_JSON: z.string().default('{}'),

    AUTH_TEST_REFRESH_FAILURE_POINT: z
      .enum([
        '',
        'after-successor-persistence',
        'after-consumed',
        'during-session-revocation',
        'during-family-revocation',
      ])
      .default(''),
  })
  .superRefine((environment, context) => {
    if (environment.NODE_ENV === AppMode.Prod && environment.DB_SYNC) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DB_SYNC'],
        message: 'DB_SYNC=true is not allowed in production',
      });
    }

    if (
      environment.AUTH_PASSWORD_MIN_LENGTH >
      environment.AUTH_PASSWORD_MAX_LENGTH
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['AUTH_PASSWORD_MIN_LENGTH'],
        message:
          'AUTH_PASSWORD_MIN_LENGTH cannot exceed AUTH_PASSWORD_MAX_LENGTH',
      });
    }

    if (
      environment.AUTH_REFRESH_TOKEN_TTL_SECONDS >
      environment.AUTH_SESSION_ABSOLUTE_TTL_SECONDS
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['AUTH_REFRESH_TOKEN_TTL_SECONDS'],
        message: 'Refresh token TTL cannot exceed absolute session TTL',
      });
    }

    if (environment.NODE_ENV === AppMode.Prod) {
      if (!environment.AUTH_REFRESH_TOKEN_PEPPER) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_REFRESH_TOKEN_PEPPER'],
          message: 'Production refresh token pepper is required',
        });
      }

      if (environment.AUTH_TEST_REFRESH_FAILURE_POINT) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_TEST_REFRESH_FAILURE_POINT'],
          message: 'Test failure injection is forbidden in production',
        });
      }

      if (
        !environment.AUTH_JWT_PRIVATE_KEY_BASE64 ||
        !environment.AUTH_JWT_PUBLIC_KEYS_JSON
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['AUTH_JWT_PRIVATE_KEY_BASE64'],
          message: 'Production JWT key material is required',
        });
      }
    }
  });

export type ValidatedEnvironment = z.infer<typeof environmentSchema>;

/**
 * Valide la configuration reçue à partir du schéma Zod.
 *
 * Si une variable est absente ou invalide, le démarrage de l'application
 * est interrompu avec un message indiquant les erreurs rencontrées.
 */

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
