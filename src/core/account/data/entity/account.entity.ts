import { Column, Entity } from 'typeorm';
import { BasePersistenceEntity } from '@common/database';
import { AccountStatus } from '../enum/account-status.enum';

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
