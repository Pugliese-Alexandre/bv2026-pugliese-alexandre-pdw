import { Column, Entity } from 'typeorm';
import { BasePersistenceEntity } from '@common/database';
import { AccountStatus } from '../enum/account-status.enum';

/**
 * Entité représentant un compte utilisateur en base de données.
 *
 * Définit les informations principales du compte, notamment son statut
 * et sa date d'anonymisation éventuelle.
 *
 * Cette classe est liée à la table "account" grâce à TypeORM.
 */

@Entity({ name: 'account' })
export class AccountEntity extends BasePersistenceEntity {
  @Column({
    name: 'status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.Active,
  })
  status!: AccountStatus;

  @Column({ name: 'anonymized_at', type: 'timestamptz', nullable: true })
  anonymizedAt!: Date | null;
}
