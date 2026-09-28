import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthContext } from '../data/model/auth-context';

/**
 * Décorateur permettant de récupérer le contexte d'authentification
 * de l'utilisateur directement dans un contrôleur.
 *
 * Il récupère les informations d'authentification ajoutées à la requête
 * et renvoie une erreur si aucun contexte authentifié n'est disponible.
 */

export const CurrentAuth = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthContext => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { auth?: AuthContext }>();

    if (!request.auth) {
      throw new Error('Authenticated context is unavailable');
    }

    return request.auth;
  },
);
