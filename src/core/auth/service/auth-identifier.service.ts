import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuthIdentifierEntity } from '../data/entity/auth-identifier.entity';
import { AuthIdentifierType } from '../data/enum/auth-identifier-type.enum';

/**
 * Service de gestion des identifiants d'authentification.
 *
 * Permet de rechercher ou de créer l'identifiant associé à un compte.
 * Actuellement, l'identifiant utilisé est l'adresse e-mail.
 *
 * Certaines méthodes utilisent un EntityManager afin de pouvoir être
 * exécutées dans une transaction avec d'autres opérations en base de données.
 */

@Injectable()
export class AuthIdentifierService {
  constructor(
    @InjectRepository(AuthIdentifierEntity)
    private readonly identifierRepository: Repository<AuthIdentifierEntity>,
  ) {}

  async findEmail(value: string): Promise<AuthIdentifierEntity | null> {
    return this.identifierRepository.findOneBy({
      type: AuthIdentifierType.Email,
      value,
    });
  }

  async findEmailInTransaction(
    manager: EntityManager,
    value: string,
  ): Promise<AuthIdentifierEntity | null> {
    return manager.getRepository(AuthIdentifierEntity).findOneBy({
      type: AuthIdentifierType.Email,
      value,
    });
  }

  async create(
    manager: EntityManager,
    accountId: string,
    value: string,
  ): Promise<AuthIdentifierEntity> {
    const repository = manager.getRepository(AuthIdentifierEntity);

    const identifier = repository.create({
      accountId,
      type: AuthIdentifierType.Email,
      value,
      verifiedAt: null,
      isPrimary: true,
    });

    return repository.save(identifier);
  }
}
