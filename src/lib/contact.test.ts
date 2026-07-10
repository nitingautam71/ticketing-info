import { describe, expect, it } from 'vitest';
import { contactSchema } from './contact';

describe('contactSchema', () => {
  it('accepts a valid message without a subject', () => {
    const result = contactSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello, I have a question about my booking.',
    });
    expect(result.success).toBe(true);
  });

  it('accepts an empty subject string', () => {
    const result = contactSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: '',
      message: 'Hello, I have a question about my booking.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing email', () => {
    const result = contactSchema.safeParse({
      name: 'Jane Doe',
      message: 'Hello, I have a question about my booking.',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a message that is too short', () => {
    const result = contactSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hi',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a name that is too short', () => {
    const result = contactSchema.safeParse({
      name: 'J',
      email: 'jane@example.com',
      message: 'Hello, I have a question about my booking.',
    });
    expect(result.success).toBe(false);
  });
});
