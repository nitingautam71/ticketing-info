import { describe, expect, it } from 'vitest';
import { leadSchema } from './leads';

describe('leadSchema', () => {
  it('accepts a minimal valid lead', () => {
    const result = leadSchema.safeParse({
      vertical: 'flight',
      contactMethod: 'call',
      name: 'Jane Doe',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a full lead with optional fields', () => {
    const result = leadSchema.safeParse({
      vertical: 'hotel',
      contactMethod: 'form',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1 555 000 0000',
      message: 'Looking for a room with a view',
      sourcePage: '/hotels',
      payload: { title: 'Grand Plaza Resort', price: 199 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown vertical', () => {
    const result = leadSchema.safeParse({
      vertical: 'spaceship',
      contactMethod: 'call',
      name: 'Jane Doe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown contact method', () => {
    const result = leadSchema.safeParse({
      vertical: 'flight',
      contactMethod: 'carrier-pigeon',
      name: 'Jane Doe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a name that is too short', () => {
    const result = leadSchema.safeParse({
      vertical: 'flight',
      contactMethod: 'call',
      name: 'J',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed email but allows an empty string', () => {
    const bad = leadSchema.safeParse({
      vertical: 'flight',
      contactMethod: 'call',
      name: 'Jane Doe',
      email: 'not-an-email',
    });
    expect(bad.success).toBe(false);

    const empty = leadSchema.safeParse({
      vertical: 'flight',
      contactMethod: 'call',
      name: 'Jane Doe',
      email: '',
    });
    expect(empty.success).toBe(true);
  });
});
