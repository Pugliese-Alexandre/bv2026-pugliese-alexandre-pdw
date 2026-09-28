import { Column, Entity, ForeignKey, Index } from 'typeorm';
import { BasePersistenceEntity, ULID_LENGTH } from '@common/database';
import { AccountEntity } from '@core/account/data/entity/account.entity';

@Entity({ name: 'auth_session' })
@Index('idx_auth_session_account_id', ['accountId'])
@ForeignKey(() => AccountEntity, ['accountId'], ['id'], {
  name: 'FK_auth_session_account',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
})
export class AuthSessionEntity extends BasePersistenceEntity {
  @Column({ name: 'account_id', type: 'varchar', length: ULID_LENGTH })
  accountId!: string;

  @Column({ name: 'access_version', type: 'integer', default: 1 })
  accessVersion!: number;

  @Column({ name: 'csrf_token_hash', type: 'varchar', length: 64 })
  csrfTokenHash!: string;

  @Column({ name: 'last_used_at', type: 'timestamptz' })
  lastUsedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @Column({
    name: 'revocation_reason',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  revocationReason!: string | null;
}
