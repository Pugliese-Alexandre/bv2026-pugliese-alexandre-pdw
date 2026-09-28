/**
 * Types représentant les informations liées à une session authentifiée.
 *
 * AuthContext contient les informations minimales permettant
 * d'identifier le compte, la session et le token en cours.
 *
 * AuthenticatedSession contient les informations complètes créées
 * lors d'une authentification, notamment les différents tokens.
 */

export type AuthContext = {
  accountId: string;
  sessionId: string;
  tokenId: string;
};

export type AuthenticatedSession = {
  accountId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  refreshExpiresAt: Date;
};
