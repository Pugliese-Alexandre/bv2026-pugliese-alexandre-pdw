import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { createUlid, ULID_LENGTH } from '../identifier/ulid.util';

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
