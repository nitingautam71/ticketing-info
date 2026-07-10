import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rateLimit } from './rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to the limit within the window', () => {
    const key = 'test-allow';
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    }
  });

  it('blocks the request once the limit is exceeded', () => {
    const key = 'test-block';
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    const third = rateLimit(key, 2, 60_000);
    expect(third.allowed).toBe(false);
  });

  it('resets the count after the window elapses', () => {
    const key = 'test-reset';
    rateLimit(key, 1, 60_000);
    expect(rateLimit(key, 1, 60_000).allowed).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(rateLimit(key, 1, 60_000).allowed).toBe(true);
  });

  it('tracks separate keys independently', () => {
    expect(rateLimit('a', 1, 60_000).allowed).toBe(true);
    expect(rateLimit('b', 1, 60_000).allowed).toBe(true);
    expect(rateLimit('a', 1, 60_000).allowed).toBe(false);
  });
});
