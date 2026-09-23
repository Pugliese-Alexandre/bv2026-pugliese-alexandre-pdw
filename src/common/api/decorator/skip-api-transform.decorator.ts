import { SetMetadata } from '@nestjs/common';

export const SKIP_API_TRANSFORM_METADATA_KEY = 'api:skip-transform';

export const SkipApiTransform = (): MethodDecorator & ClassDecorator =>
  SetMetadata(SKIP_API_TRANSFORM_METADATA_KEY, true);
