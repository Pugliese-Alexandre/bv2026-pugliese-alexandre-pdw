import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '../../enum/account-status.enum';

/**
 * DTO représentant les informations d'un compte renvoyées par l'API.
 *
 * Définit les données visibles dans la réponse :
 * identifiant, statut et dates de création et de modification.
 *
 * Les décorateurs @ApiProperty permettent de documenter
 * ces informations dans Swagger.
 */

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
