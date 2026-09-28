import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { EnvService } from '@common/config';

/**
 * Service de sécurisation des mots de passe avec Argon2id.
 *
 * Permet de transformer un mot de passe en hash sécurisé et de vérifier
 * ensuite si un mot de passe correspond au hash enregistré.
 *
 * Les paramètres d'Argon2 sont récupérés depuis la configuration de l'application.
 */

@Injectable()
export class PasswordHasherService {
  private readonly dummyHashPromise: Promise<string>;

  constructor(private readonly envService: EnvService) {
    this.dummyHashPromise = this.hash('hoos-invalid-login-dummy');
  }

  hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: this.envService.passwordArgon2MemoryCost,
      timeCost: this.envService.passwordArgon2TimeCost,
      parallelism: this.envService.passwordArgon2Parallelism,
    });
  }

  verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  verifyAgainstDummy(password: string): Promise<boolean> {
    return this.dummyHashPromise.then((hash) => this.verify(hash, password));
  }
}
