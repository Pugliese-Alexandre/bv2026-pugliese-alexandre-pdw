import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthContext } from '../data/model/auth-context';

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
