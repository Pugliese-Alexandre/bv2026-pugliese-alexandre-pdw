import { Column, Entity, ForeignKey, Index } from 'typeorm';
import { BasePersistenceEntity, ULID_LENGTH } from '@common/database';
import { AccountEntity } from '@core/account/data/entity/account.entity';

@Entity({ name: 'password_credential' })
@Index('uq_password_credential_account_id', ['accountId'], { unique: true })
@ForeignKey(() => AccountEntity, ['accountId'], ['id'], {
  name: 'FK_password_credential_account',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
})
export class PasswordCredentialEntity extends BasePersistenceEntity {
  @Column({ name: 'account_id', type: 'varchar', length: ULID_LENGTH })
  accountId!: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash!: string;

  @Column({ name: 'hash_version', type: 'varchar', length: 32 })
  hashVersion!: string;

  @Column({ name: 'failed_attempts', type: 'integer', default: 0 })
  failedAttempts!: number;

  @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
  lockedUntil!: Date | null;

  @Column({ name: 'last_failed_at', type: 'timestamptz', nullable: true })
  lastFailedAt!: Date | null;

  @Column({ name: 'last_used_at', type: 'timestamptz', nullable: true })
  lastUsedAt!: Date | null;

  @Column({ name: 'changed_at', type: 'timestamptz' })
  changedAt!: Date;

  @Column({ name: 'disabled_at', type: 'timestamptz', nullable: true })
  disabledAt!: Date | null;
}
