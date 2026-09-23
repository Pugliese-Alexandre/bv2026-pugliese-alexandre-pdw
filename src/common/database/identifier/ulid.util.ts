import { ulid } from 'ulid';

export const ULID_LENGTH = 26;
export const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export const createUlid = (): string => ulid();
