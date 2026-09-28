import { PasswordHasherService } from './password-hasher.service';

describe('PasswordHasherService', () => {
  it('uses Argon2id hashes that verify without exposing plaintext', async () => {
    const service = new PasswordHasherService({
      passwordArgon2MemoryCost: 19_456,
      passwordArgon2TimeCost: 2,
      passwordArgon2Parallelism: 1,
    } as never);

    const password = 'a long secure passphrase with spaces';
    const hash = await service.hash(password);

    expect(hash).toContain('$argon2id$');
    expect(hash).not.toContain(password);

    await expect(service.verify(hash, password)).resolves.toBe(true);
    await expect(service.verify(hash, 'a different password')).resolves.toBe(
      false,
    );
  });
});
