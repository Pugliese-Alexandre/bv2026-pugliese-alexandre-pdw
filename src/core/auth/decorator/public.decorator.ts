import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE = 'auth:public';

export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(PUBLIC_ROUTE, true);
