import { describe, expect, it } from 'vitest';
import { checkVisa } from './visas';

describe('checkVisa', () => {
  it('does not require a visa for a US passport visiting the UK', async () => {
    const result = await checkVisa({ nationality: 'United States', destination: 'United Kingdom' });
    expect(result.visaRequired).toBe(false);
  });

  it('requires a visa for a nationality not on the UK exemption list', async () => {
    const result = await checkVisa({ nationality: 'Narnia', destination: 'United Kingdom' });
    expect(result.visaRequired).toBe(true);
    expect(result.fee).toBeGreaterThan(0);
  });

  it('does not require a visa for a US passport visiting Japan', async () => {
    const result = await checkVisa({ nationality: 'United States', destination: 'Japan' });
    expect(result.visaRequired).toBe(false);
  });

  it('requires a visa for Japan for a nationality not on its exemption list', async () => {
    const result = await checkVisa({ nationality: 'Narnia', destination: 'Japan' });
    expect(result.visaRequired).toBe(true);
  });

  it('falls back to defaults for blank input', async () => {
    const result = await checkVisa({ nationality: '', destination: '' });
    expect(result.destinationCountry).toBe('United Kingdom');
  });

  it('always returns baseline document requirements', async () => {
    const result = await checkVisa({ nationality: 'Germany', destination: 'Somewhere Else' });
    expect(result.requirements).toContain('Valid passport (at least 6 months validity)');
  });
});
