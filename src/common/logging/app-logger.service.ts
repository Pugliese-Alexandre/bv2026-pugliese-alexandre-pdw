import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LogCategory } from './data/enum/log-category.enum';

type PinoWriteLevel = 'info' | 'warn' | 'error';

export type StructuredLogFields = Record<string, unknown> & {
  event: string;
};

/**
 * Service centralisant les logs de l'application.
 *
 * Utilise Pino pour créer des logs structurés et les classer
 * par catégorie : application, sécurité ou audit.
 *
 * Le contexte permet d'identifier plus facilement
 * la partie de l'application à l'origine du log.
 */

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  constructor(private readonly pinoLogger: PinoLogger) {}

  setContext(context: string): void {
    this.pinoLogger.setContext(context);
  }

  application(fields: StructuredLogFields): void {
    this.write(LogCategory.Application, 'info', fields);
  }

  security(fields: StructuredLogFields): void {
    this.write(LogCategory.Security, 'warn', fields);
  }

  audit(fields: StructuredLogFields): void {
    this.write(LogCategory.Audit, 'info', fields);
  }

  private write(
    category: LogCategory,
    level: PinoWriteLevel,
    fields: StructuredLogFields,
  ): void {
    this.pinoLogger[level]({ category, ...fields }, fields.event);
  }
}
