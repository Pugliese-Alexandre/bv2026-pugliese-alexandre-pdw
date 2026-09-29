import { ulid } from 'ulid';

/**
 * Utilitaires pour la gestion des identifiants ULID.
 *
 * Définit leur format et permet de générer
 * de nouveaux identifiants uniques.
 */

export const ULID_LENGTH = 26;
export const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export const createUlid = (): string => ulid();
