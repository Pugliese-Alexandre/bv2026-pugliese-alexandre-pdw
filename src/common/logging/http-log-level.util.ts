export type HttpLogLevel = 'info' | 'warn' | 'error' | 'silent';

// Seuils utilisés pour déterminer le niveau du log selon le statut HTTP.

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

/**
 * Les routes de vérification de l'état de l'application sont appelées fréquemment.
 * Leurs logs sont ignorés lorsqu'elles fonctionnent correctement afin
 * d'éviter de surcharger inutilement les logs.
 */

const HEALTH_CHECK_LOG_PATHS = new Set(['/health/live', '/health/ready']);

/**
 * Détermine le niveau du log HTTP selon le résultat de la requête :
 * succès → info, erreur client → warn, erreur serveur → error.
 */

export const resolveHttpLogLevel = (
  path: string | undefined,
  statusCode: number,
  hasError: boolean,
): HttpLogLevel => {
  const normalizedPath = path?.split('?')[0];

  if (
    !hasError &&
    statusCode < HTTP_STATUS_BAD_REQUEST &&
    normalizedPath !== undefined &&
    HEALTH_CHECK_LOG_PATHS.has(normalizedPath)
  ) {
    return 'silent';
  }

  if (hasError || statusCode >= HTTP_STATUS_INTERNAL_SERVER_ERROR) {
    return 'error';
  }

  if (statusCode >= HTTP_STATUS_BAD_REQUEST) {
    return 'warn';
  }

  return 'info';
};
