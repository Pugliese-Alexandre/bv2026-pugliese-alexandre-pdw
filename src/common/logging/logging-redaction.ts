const SENSITIVE_HEADER_NAMES = ['authorization', 'cookie', 'set-cookie'];

const SENSITIVE_FIELD_NAMES = [
  'password',
  'passwordHash',
  'pin',
  'pinHash',
  'otp',
  'otpSecret',
  'accessToken',
  'refreshToken',
  'refreshTokenHash',
  'sessionHash',
  'token',
  'secret',
  'apiKey',
  'clientSecret',
  'databasePassword',
];

const headerPath = (section: 'req' | 'res', header: string): string =>
  header.includes('-')
    ? `${section}.headers["${header}"]`
    : `${section}.headers.${header}`;

/**
 * fast-redact only supports one wildcard level of nesting (`root.*.field`),
 * so this guarantees direct fields on `req.body`/`req.query` and fields one
 * level deep are censored. It cannot guarantee arbitrary deep nesting -
 * security-critical code must still avoid logging sensitive objects
 * entirely rather than relying on this list alone.
 */
const sensitiveDataPaths = (root: string): string[] =>
  SENSITIVE_FIELD_NAMES.flatMap((field) => [
    `${root}.${field}`,
    `${root}.*.${field}`,
  ]);

export const LOG_REDACTION_PATHS = [
  ...SENSITIVE_HEADER_NAMES.map((header) => headerPath('req', header)),
  ...SENSITIVE_HEADER_NAMES.map((header) => headerPath('res', header)),
  ...sensitiveDataPaths('req.body'),
  ...sensitiveDataPaths('req.query'),
];
