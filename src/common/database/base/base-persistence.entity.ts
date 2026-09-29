import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { createUlid, ULID_LENGTH } from '../identifier/ulid.util';

/**
 * Classe de base commune aux entités enregistrées en base de données.
 *
 * Fournit automatiquement un identifiant ULID, les dates de création
 * et de modification ainsi qu'un numéro de version.
 *
 * L'identifiant est généré automatiquement avant l'insertion
 * si aucun identifiant n'a encore été défini.
 */

export abstract class BasePersistenceEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: ULID_LENGTH })
  id!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @VersionColumn({ name: 'version', type: 'integer', default: 1 })
  version!: number;

  @BeforeInsert()
  protected ensureApplicationGeneratedId(): void {
    if (!this.id) {
      this.id = createUlid();
    }
  }
}
