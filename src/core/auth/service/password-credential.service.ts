import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EnvService } from '@common/config';
import { PasswordCredentialEntity } from '../data/entity/password-credential.entity';
import { PasswordHasherService } from './password-hasher.service';

@Injectable()
export class PasswordCredentialService {
  constructor(
    @InjectRepository(PasswordCredentialEntity)
    private readonly credentialRepository: Repository<PasswordCredentialEntity>,
    private readonly passwordHasher: PasswordHasherService,
    private readonly envService: EnvService,
  ) {}

  async findByAccountId(
    accountId: string,
  ): Promise<PasswordCredentialEntity | null> {
    return this.credentialRepository.findOneBy({ accountId });
  }

  async findByAccountIdInTransaction(
    manager: EntityManager,
    accountId: string,
  ): Promise<PasswordCredentialEntity | null> {
    return manager.getRepository(PasswordCredentialEntity).findOneBy({
      accountId,
    });
  }

  async create(
    manager: EntityManager,
    accountId: string,
    password: string,
  ): Promise<PasswordCredentialEntity> {
    const repository = manager.getRepository(PasswordCredentialEntity);

    const credential = repository.create({
      accountId,
      passwordHash: await this.passwordHasher.hash(password),
      hashVersion: 'argon2id-v1',
      failedAttempts: 0,
      lockedUntil: null,
      lastFailedAt: null,
      lastUsedAt: null,
      changedAt: new Date(),
      disabledAt: null,
    });

    return repository.save(credential);
  }

  async recordFailedAttempt(
    manager: EntityManager,
    credentialId: string,
  ): Promise<void> {
    const repository = manager.getRepository(PasswordCredentialEntity);

    await repository
      .createQueryBuilder()
      .update(PasswordCredentialEntity)
      .set({
        failedAttempts: () => 'failed_attempts + 1',
        lastFailedAt: () => 'CURRENT_TIMESTAMP',
        lockedUntil: () =>
          `CASE WHEN failed_attempts + 1 >= ${this.envService.passwordMaxAttempts} THEN CURRENT_TIMESTAMP + (${this.envService.passwordLockoutSeconds} * INTERVAL '1 second') ELSE locked_until END`,
      })
      .where('id = :credentialId', { credentialId })
      .andWhere('(locked_until IS NULL OR locked_until <= CURRENT_TIMESTAMP)')
      .execute();
  }

  async recordSuccessfulUse(
    manager: EntityManager,
    credentialId: string,
  ): Promise<void> {
    await manager.getRepository(PasswordCredentialEntity).update(credentialId, {
      failedAttempts: 0,
      lockedUntil: null,
      lastUsedAt: new Date(),
    });
  }
}
