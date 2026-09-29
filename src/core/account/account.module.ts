import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountEntity } from './data/entity/account.entity';

/**
 * Module responsable de la gestion des comptes utilisateurs.
 *
 * Relie l'entité Account à TypeORM et rend le service AccountService
 * disponible pour gérer les opérations liées aux comptes.
 *
 * Le service est exporté afin de pouvoir être utilisé par d'autres modules.
 */

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
