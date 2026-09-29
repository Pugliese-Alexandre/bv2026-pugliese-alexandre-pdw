/**
 * Définit les différents niveaux de gravité des logs.
 *
 * Permet de filtrer et de classer les messages selon
 * leur importance, du debug jusqu'aux erreurs fatales.
 */

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}
