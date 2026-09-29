import { SetMetadata } from '@nestjs/common';

// Permet de définir le code de succès à utiliser dans la réponse d'une route.
export const API_SUCCESS_CODE_METADATA_KEY = 'api:success-code';

export const ApiSuccessCode = (code: string): MethodDecorator =>
  SetMetadata(API_SUCCESS_CODE_METADATA_KEY, code);
