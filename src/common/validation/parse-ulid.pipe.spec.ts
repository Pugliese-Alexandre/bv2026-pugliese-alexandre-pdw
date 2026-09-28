import { ArgumentMetadata } from '@nestjs/common';
import { ApiException } from '@common/api';
import { ParseUlidPipe } from './parse-ulid.pipe';

describe('ParseUlidPipe', () => {
  const pipe = new ParseUlidPipe();
  const metadata: ArgumentMetadata = { type: 'param', data: 'id' };

  it('accepts a well-formed ULID', () => {
    const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

    expect(pipe.transform(validUlid, metadata)).toBe(validUlid);
  });

  it('rejects a malformed value before it can reach persistence logic', () => {
    expect(() => pipe.transform('not-a-ulid', metadata)).toThrow(ApiException);
  });

  it('rejects an empty value', () => {
    expect(() => pipe.transform('', metadata)).toThrow(ApiException);
  });

  it('rejects a value that only differs from a ULID by length', () => {
    expect(() => pipe.transform('01ARZ3NDEKTSV4RRFFQ69G5FA', metadata)).toThrow(
      ApiException,
    );
  });
});
