import { Injectable } from '@nestjs/common';
import {
  createHmac,
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EnvService } from '@common/config';
import { createUlid, ULID_REGEX } from '@common/database';
import { AuthSecurityException } from '../data/exception/auth-security.exception';

/**
 * Service de gestion cryptographique des tokens d'authentification.
 *
 * Gère la création et la vérification des access tokens JWT,
 * ainsi que la génération de tokens aléatoires et de leurs empreintes.
 *
 * Il gère également les clés cryptographiques utilisées pour signer
 * et vérifier les JWT, avec une configuration adaptée à l'environnement.
 */

type TrustedKeys = Record<string, string>;

export type AccessTokenClaims = JwtPayload & {
  sub: string;
  sid: string;
  jti: string;
  ver: number;
};

@Injectable()
export class TokenCryptoService {
  private readonly issuer = 'hoos-api';
  private readonly audience = 'hoos-web';
  private readonly refreshPepper: Buffer;
  private readonly privateKeyPem: string;
  private readonly publicKeys: Map<string, string>;

  constructor(private readonly envService: EnvService) {
    this.refreshPepper = this.resolvePepper();

    const material = this.resolveKeyMaterial();

    this.privateKeyPem = material.privateKeyPem;

    this.publicKeys = new Map(
      Object.entries(material.publicKeys).map(([kid, encodedKey]) => [
        kid,
        Buffer.from(encodedKey, 'base64').toString('utf8'),
      ]),
    );

    this.validatePublicKeys(material.publicKeys);
    this.validateKeyMaterial(material.privateKeyPem, material.publicKeys);
  }

  // Création et vérification des Access Tokens JWT
  signAccessToken(
    accountId: string,
    sessionId: string,
    accessVersion: number,
  ): string {
    return jwt.sign(
      {
        sub: accountId,
        sid: sessionId,
        ver: accessVersion,
      },
      this.privateKeyPem,
      {
        algorithm: 'ES256',
        issuer: this.issuer,
        audience: this.audience,
        expiresIn: this.envService.accessTokenTtlSeconds,
        jwtid: createUlid(),
        header: {
          alg: 'ES256',
          typ: 'at+jwt',
          kid: this.envService.jwtActiveKid,
        },
      },
    );
  }

  verifyAccessToken(token: string): AccessTokenClaims {
    if (token.length > 4096 || token.split('.').length !== 3) {
      throw new AuthSecurityException();
    }

    let decoded: {
      header: Record<string, unknown>;
      payload: JwtPayload;
    } | null;

    try {
      decoded = jwt.decode(token, {
        complete: true,
      }) as typeof decoded;
    } catch {
      throw new AuthSecurityException();
    }

    const header = decoded?.header;

    if (
      !header ||
      header.alg !== 'ES256' ||
      header.typ !== 'at+jwt' ||
      typeof header.kid !== 'string' ||
      !/^[A-Za-z0-9._-]{1,100}$/.test(header.kid) ||
      'jku' in header ||
      'jwk' in header ||
      'x5u' in header ||
      'x5c' in header ||
      'crit' in header
    ) {
      throw new AuthSecurityException();
    }

    const key = this.publicKeys.get(header.kid);

    if (!key) {
      throw new AuthSecurityException();
    }

    try {
      const payload = jwt.verify(token, key, {
        algorithms: ['ES256'],
        issuer: this.issuer,
        audience: this.audience,
        maxAge: `${this.envService.accessTokenTtlSeconds}s`,
        clockTolerance: 5,
      }) as AccessTokenClaims;

      if (
        typeof payload.sub !== 'string' ||
        !ULID_REGEX.test(payload.sub) ||
        typeof payload.sid !== 'string' ||
        !ULID_REGEX.test(payload.sid) ||
        typeof payload.jti !== 'string' ||
        !ULID_REGEX.test(payload.jti) ||
        typeof payload.ver !== 'number' ||
        !Number.isInteger(payload.ver) ||
        typeof payload.iat !== 'number' ||
        typeof payload.exp !== 'number' ||
        payload.exp - payload.iat > this.envService.accessTokenTtlSeconds
      ) {
        throw new AuthSecurityException();
      }

      return payload;
    } catch (error) {
      if (error instanceof AuthSecurityException) {
        throw error;
      }

      throw new AuthSecurityException();
    }
  }
  // Génération et empreinte des tokens
  createOpaqueToken(): string {
    return randomBytes(32).toString('base64url');
  }

  fingerprint(value: string): string {
    return createHmac('sha256', this.refreshPepper).update(value).digest('hex');
  }

  // Chargement et validation du matériel cryptographique
  private resolvePepper(): Buffer {
    if (this.envService.refreshTokenPepper) {
      const pepper = Buffer.from(this.envService.refreshTokenPepper, 'base64');

      if (pepper.length >= 32) {
        return pepper;
      }

      if (this.envService.isProduction) {
        throw new Error(
          'AUTH_REFRESH_TOKEN_PEPPER must contain at least 32 bytes',
        );
      }
    }

    if (this.envService.isProduction) {
      throw new Error('AUTH_REFRESH_TOKEN_PEPPER is required in production');
    }

    return randomBytes(32);
  }

  private resolveKeyMaterial(): {
    privateKeyPem: string;
    publicKeys: TrustedKeys;
  } {
    if (
      this.envService.jwtPrivateKeyBase64 &&
      this.envService.jwtPublicKeysJson
    ) {
      let publicKeys: TrustedKeys;

      try {
        publicKeys = JSON.parse(
          this.envService.jwtPublicKeysJson,
        ) as TrustedKeys;
      } catch {
        throw new Error('AUTH_JWT_PUBLIC_KEYS_JSON is invalid');
      }

      return {
        privateKeyPem: Buffer.from(
          this.envService.jwtPrivateKeyBase64,
          'base64',
        ).toString('utf8'),
        publicKeys,
      };
    }

    if (this.envService.isProduction) {
      throw new Error('Production JWT key material is required');
    }

    const pair = generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
    });

    const privateKeyPem = pair.privateKey
      .export({
        type: 'pkcs8',
        format: 'pem',
      })
      .toString();

    const publicKeyPem = pair.publicKey
      .export({
        type: 'spki',
        format: 'pem',
      })
      .toString();

    return {
      privateKeyPem,
      publicKeys: {
        [this.envService.jwtActiveKid]:
          Buffer.from(publicKeyPem).toString('base64'),
      },
    };
  }

  private validatePublicKeys(keys: TrustedKeys): void {
    for (const [kid, encodedKey] of Object.entries(keys)) {
      if (!/^[A-Za-z0-9._-]{1,100}$/.test(kid) || !encodedKey) {
        throw new Error('JWT public key configuration is invalid');
      }
    }

    if (!keys[this.envService.jwtActiveKid]) {
      throw new Error('Active JWT key identifier is not trusted');
    }
  }

  private validateKeyMaterial(privateKeyPem: string, keys: TrustedKeys): void {
    try {
      const privateKey = createPrivateKey(privateKeyPem);

      if (
        privateKey.asymmetricKeyType !== 'ec' ||
        privateKey.asymmetricKeyDetails?.namedCurve !== 'prime256v1'
      ) {
        throw new Error('JWT private key must be an EC P-256 key');
      }

      const publicKeyObjects = new Map<
        string,
        ReturnType<typeof createPublicKey>
      >();

      for (const [kid, encodedKey] of Object.entries(keys)) {
        const publicKey = createPublicKey(
          Buffer.from(encodedKey, 'base64').toString('utf8'),
        );

        if (
          publicKey.asymmetricKeyType !== 'ec' ||
          publicKey.asymmetricKeyDetails?.namedCurve !== 'prime256v1'
        ) {
          throw new Error(`JWT public key ${kid} must be an EC P-256 key`);
        }

        publicKeyObjects.set(kid, publicKey);
      }

      const activePublicKey = publicKeyObjects.get(
        this.envService.jwtActiveKid,
      );

      if (!activePublicKey) {
        throw new Error('Active JWT key identifier is not trusted');
      }

      const derived = createPublicKey(privateKey).export({
        type: 'spki',
        format: 'der',
      });

      const configured = activePublicKey.export({
        type: 'spki',
        format: 'der',
      });

      if (
        derived.length !== configured.length ||
        !timingSafeEqual(derived, configured)
      ) {
        throw new Error('JWT private and public keys are incompatible');
      }
    } catch (error) {
      throw new Error(
        `Invalid JWT key material: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }
}
