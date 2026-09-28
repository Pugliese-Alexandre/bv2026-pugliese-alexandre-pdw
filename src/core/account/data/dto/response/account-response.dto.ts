import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '../../enum/account-status.enum';

export class AccountResponseDto {
  @ApiProperty({ example: '01K2Z3Z4Z5Z6Z7Z8Z9ZAABBCCD' })
  id!: string;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.Active })
  status!: AccountStatus;

  @ApiProperty({ example: '2026-08-19T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-08-19T12:00:00.000Z' })
  updatedAt!: string;
}
