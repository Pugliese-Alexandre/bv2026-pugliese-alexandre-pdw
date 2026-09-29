import { createUlid, ULID_REGEX } from '@common/database';

export const REQUEST_ID_HEADER = 'x-request-id';
export const REQUEST_ID_RESPONSE_HEADER = 'X-Request-Id';

/**
 * Récupère ou génère l'identifiant unique d'une requête HTTP.
 *
 * Si la requête contient déjà un Request ID valide au format ULID,
 * celui-ci est conservé. Sinon, un nouvel identifiant est généré.
 *
 * Cet identifiant permet de retrouver facilement tous les logs
 * associés à une même requête.
 */

export const resolveRequestId = (
  incomingHeaderValue: string | string[] | undefined,
): string => {
  const rawValue = Array.isArray(incomingHeaderValue)
    ? incomingHeaderValue[0]
    : incomingHeaderValue;

  if (rawValue && ULID_REGEX.test(rawValue)) {
    return rawValue;
  }

  return createUlid();
};
