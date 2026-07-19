import { describe, it, expect } from 'vitest';
import { extractTrackedParams, isNewTouch } from './attribution';

describe('extractTrackedParams', () => {
  it('picks up utm and ad-click params, ignoring everything else', () => {
    const params = extractTrackedParams(
      '?utm_source=google&utm_medium=cpc&utm_campaign=cruise-caribbean&gclid=abc123&page=2&q=miami'
    );
    expect(params).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'cruise-caribbean',
      gclid: 'abc123',
    });
  });

  it('returns an empty object for an untagged visit', () => {
    expect(extractTrackedParams('')).toEqual({});
    expect(extractTrackedParams('?destination=Alaska&page=3')).toEqual({});
  });

  it('truncates oversized param values', () => {
    const params = extractTrackedParams(`?gclid=${'x'.repeat(500)}`);
    expect(params.gclid).toHaveLength(200);
  });
});

describe('isNewTouch', () => {
  const origin = 'https://www.ticketing-info.org';

  it('treats any tracked param as a new touch', () => {
    expect(isNewTouch({ gclid: 'abc' }, '', origin)).toBe(true);
  });

  it('treats an external referrer as a new touch', () => {
    expect(isNewTouch({}, 'https://www.google.com/', origin)).toBe(true);
  });

  it('ignores internal navigation and direct visits', () => {
    expect(isNewTouch({}, `${origin}/cruises`, origin)).toBe(false);
    expect(isNewTouch({}, '', origin)).toBe(false);
  });

  it('ignores malformed referrers', () => {
    expect(isNewTouch({}, 'not-a-url', origin)).toBe(false);
  });
});
