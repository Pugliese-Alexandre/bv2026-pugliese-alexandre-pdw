/**
 * Définit les différentes catégories de logs de l'application.
 *
 * Permet de classer les logs selon leur origine ou leur utilité.
 */

export enum LogCategory {
  Application = 'application',
  Http = 'http',
  Error = 'error',
  Security = 'security',
  Audit = 'audit',
}
