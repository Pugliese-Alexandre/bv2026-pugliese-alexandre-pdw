import { Column, Entity, ForeignKey, Index } from 'typeorm';
import { BasePersistenceEntity, ULID_LENGTH } from '@common/database';
import { AccountEntity } from '@core/account/data/entity/account.entity';
import { AuthIdentifierType } from '../enum/auth-identifier-type.enum';

/**
 * Entité représentant les identifiants de connexion d'un compte.
 *
 * Associe un identifiant d'authentification, actuellement une adresse e-mail,
 * à un compte utilisateur.
 *
 * Elle permet également de savoir si l'identifiant a été vérifié
 * et s'il s'agit de l'identifiant principal du compte.
 */

@Entity({ name: 'auth_identifier' })
@Index('uq_auth_identifier_type_value', ['type', 'value'], { unique: true })
@Index('idx_auth_identifier_account_id', ['accountId'])
@ForeignKey(() => AccountEntity, ['accountId'], ['id'], {
  name: 'FK_auth_identifier_account',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
})
export class AuthIdentifierEntity extends BasePersistenceEntity {
  @Column({ name: 'account_id', type: 'varchar', length: ULID_LENGTH })
  accountId!: string;

  @Column({ name: 'type', type: 'enum', enum: AuthIdentifierType })
  type!: AuthIdentifierType;

  @Column({ name: 'value', type: 'varchar', length: 320 })
  value!: string;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt!: Date | null;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;
}
