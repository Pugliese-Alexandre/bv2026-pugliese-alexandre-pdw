import { SetMetadata } from '@nestjs/common';

/**
 * Décorateur permettant de déclarer une route comme publique.
 *
 * Ajoute une information (metadata) à la route pour indiquer
 * qu'elle peut être accessible sans authentification.
 */

export const PUBLIC_ROUTE = 'auth:public';

export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(PUBLIC_ROUTE, true);
