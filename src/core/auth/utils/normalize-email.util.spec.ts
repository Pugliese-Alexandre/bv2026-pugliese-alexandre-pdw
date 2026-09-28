import { normalizeEmail } from './normalize-email.util';

describe('normalizeEmail', () => {
  it('trims whitespace and canonicalizes case without provider rewriting', () => {
    expect(normalizeEmail(' Nicolas.Example@Example.COM ')).toBe(
      'nicolas.example@example.com',
    );
  });

  it('preserves provider-specific local-part characters', () => {
    expect(normalizeEmail('Nicolas+work@Example.COM')).toBe(
      'nicolas+work@example.com',
    );
  });
});
