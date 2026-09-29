/**
 * Définit les différents statuts possibles d'un compte utilisateur.
 *
 * Ces statuts permettent de déterminer l'état actuel du compte
 * et les actions qui peuvent être autorisées ou refusées.
 */

export enum AccountStatus {
  Active = 'ACTIVE',
  Locked = 'LOCKED',
  Disabled = 'DISABLED',
  PendingDeletion = 'PENDING_DELETION',
  Anonymized = 'ANONYMIZED',
}
