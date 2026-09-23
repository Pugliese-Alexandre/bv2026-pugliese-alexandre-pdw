import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LogCategory } from './data/enum/log-category.enum';

type PinoWriteLevel = 'info' | 'warn' | 'error';

export type StructuredLogFields = Record<string, unknown> & {
  event: string;
};

/**
 * Thin wrapper around the request-scoped PinoLogger so application code
 * gets consistently structured `category`/`event` fields instead of
 * free-form log calls. It carries no state of its own: `logger` resolves
 * the current request's bindings (including requestId) from nestjs-pino's
 * AsyncLocalStorage context on every call, so requestId never needs to be
 * threaded manually through services.
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
