import { Column, Entity, ForeignKey, Index } from 'typeorm';
import { BasePersistenceEntity, ULID_LENGTH } from '@common/database';
import { AuthSessionEntity } from './auth-session.entity';

/**
 * Entité représentant les refresh tokens d'une session en base de données.
 *
 * Un refresh token permet d'obtenir de nouveaux tokens d'accès sans demander
 * à l'utilisateur de se reconnecter à chaque expiration de l'access token.
 *
 * L'entité permet également de suivre l'expiration, l'utilisation,
 * la révocation et le remplacement des refresh tokens.
 */

@Entity({ name: 'auth_refresh_token' })
@Index('uq_auth_refresh_token_hash', ['tokenHash'], { unique: true })
@Index('uq_auth_refresh_token_parent_id', ['parentId'], { unique: true })
@Index('idx_auth_refresh_token_session_id', ['sessionId'])
@ForeignKey(() => AuthSessionEntity, ['sessionId'], ['id'], {
  name: 'FK_auth_refresh_token_session',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
})
export class AuthRefreshTokenEntity extends BasePersistenceEntity {
  @Column({ name: 'session_id', type: 'varchar', length: ULID_LENGTH })
  sessionId!: string;

  @Column({ name: 'token_hash', type: 'varchar', length: 64 })
  tokenHash!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'consumed_at', type: 'timestamptz', nullable: true })
  consumedAt!: Date | null;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @Column({
    name: 'replaced_by_id',
    type: 'varchar',
    length: ULID_LENGTH,
    nullable: true,
  })
  replacedById!: string | null;

  @Column({
    name: 'parent_id',
    type: 'varchar',
    length: ULID_LENGTH,
    nullable: true,
  })
  parentId!: string | null;
}
