import { SetMetadata } from '@nestjs/common';

// Permet d'indiquer qu'une route ne doit pas utiliser le format de réponse standard de l'API.

export const SKIP_API_TRANSFORM_METADATA_KEY = 'api:skip-transform';

export const SkipApiTransform = (): MethodDecorator & ClassDecorator =>
  SetMetadata(SKIP_API_TRANSFORM_METADATA_KEY, true);
