import TTL from '../api/service/TTL.js';

describe('TTL service', () => {
  test('Create TTL', () => {
    const ttl = new TTL('Tim', 30000);
    expect(ttl).toBeDefined();
    expect(ttl).not.toBeNull();
  });

  test('get TTL key', () => {
    const ttl = new TTL('Tim', 30000);
    const result = ttl.getKey;
    expect(result).toEqual('Tim');
  });

  test('TTL check in time', () => {
    const ttl = new TTL('Tim', 30000);
    const result = ttl.checkTime();
    expect(result).toBeTruthy();
  });

  test('TTL check not in time', (done) => {
    const ttl = new TTL('Tim', 100);
    setTimeout(() => {
      const result = ttl.checkTime();
      expect(result).toBeFalsy();
      done();
    }, 200);
  });
});
