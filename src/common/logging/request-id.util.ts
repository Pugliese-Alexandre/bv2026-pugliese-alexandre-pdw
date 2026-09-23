import { createUlid, ULID_REGEX } from '@common/database';

export const REQUEST_ID_HEADER = 'x-request-id';
export const REQUEST_ID_RESPONSE_HEADER = 'X-Request-Id';

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
