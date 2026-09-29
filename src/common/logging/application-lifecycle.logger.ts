import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { AppLogger } from './app-logger.service';

/**
 * Service chargé de journaliser l'arrêt de l'application.
 *
 * Détecte l'arrêt de NestJS et enregistre un log avec
 * l'événement correspondant et le signal reçu.
 */

@Injectable()
export class ApplicationLifecycleLogger implements OnApplicationShutdown {
  constructor(private readonly appLogger: AppLogger) {
    this.appLogger.setContext(ApplicationLifecycleLogger.name);
  }

  onApplicationShutdown(signal?: string): void {
    this.appLogger.application({ event: 'application.stopped', signal });
  }
}
