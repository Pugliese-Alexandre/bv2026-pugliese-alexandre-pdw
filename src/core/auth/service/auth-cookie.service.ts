import { Injectable } from '@nestjs/common';
import type { CookieOptions } from 'express';
import type { Response } from 'express';
import { EnvService } from '@common/config';

export type AuthCookieNames = {
  access: string;
  refresh: string;
  csrf: string;
};

@Injectable()
export class AuthCookieService {
  readonly names: AuthCookieNames;

  constructor(private readonly envService: EnvService) {
    this.names = this.envService.isProduction
      ? {
          access: '__Host-hoos-access',
          refresh: '__Host-hoos-refresh',
          csrf: '__Host-hoos-csrf',
        }
      : {
          access: 'hoos-access',
          refresh: 'hoos-refresh',
          csrf: 'hoos-csrf',
        };
  }

  setAccessCookie(response: Response, token: string): void {
    response.cookie(this.names.access, token, {
      ...this.baseOptions(true),
      maxAge: this.envService.accessTokenTtlSeconds * 1000,
    });
  }

  setRefreshCookie(response: Response, token: string, expiresAt: Date): void {
    response.cookie(this.names.refresh, token, {
      ...this.baseOptions(true),
      expires: expiresAt,
    });
  }

  setCsrfCookie(response: Response, token: string, expiresAt: Date): void {
    response.cookie(this.names.csrf, token, {
      ...this.baseOptions(false),
      expires: expiresAt,
    });
  }

  clearAuthCookies(response: Response): void {
    for (const name of Object.values(this.names)) {
      response.clearCookie(name, this.baseOptions(name !== this.names.csrf));
    }
  }

  private baseOptions(httpOnly: boolean): CookieOptions {
    return {
      httpOnly,
      secure: this.envService.isProduction,
      sameSite: 'strict',
      path: '/',
    };
  }
}
