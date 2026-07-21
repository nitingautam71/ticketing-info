import { describe, expect, it } from 'vitest';
import { countryMentions, detectTripContext } from './detect';

describe('country mention detection', () => {
  it('matches official country names', () => {
    expect(countryMentions('travelling to Japan').map((m) => m.code)).toEqual(['JP']);
    expect(countryMentions('visiting the United States').map((m) => m.code)).toEqual(['US']);
  });

  it('matches common aliases travellers actually type', () => {
    expect(countryMentions('a USA trip').map((m) => m.code)).toEqual(['US']);
    expect(countryMentions('cover for the UK').map((m) => m.code)).toEqual(['GB']);
    expect(countryMentions('Dubai holiday').map((m) => m.code)).toEqual(['AE']);
    expect(countryMentions('flying to America').map((m) => m.code)).toEqual(['US']);
    expect(countryMentions('two weeks in Turkey').map((m) => m.code)).toEqual(['TR']);
  });

  it('does not mistake the pronoun "us" for the United States', () => {
    expect(countryMentions('what does CFAR mean for us?')).toHaveLength(0);
    expect(countryMentions('can you help us choose a plan')).toHaveLength(0);
    // …but the uppercase abbreviation still resolves.
    expect(countryMentions('a US trip').map((m) => m.code)).toEqual(['US']);
  });

  it('prefers the longest match and de-duplicates', () => {
    expect(countryMentions('Papua New Guinea').map((m) => m.code)).toEqual(['PG']);
    expect(countryMentions('India to India').map((m) => m.code)).toEqual(['IN']);
  });

  it('requires word boundaries', () => {
    // "Indianapolis" must not resolve to India.
    expect(countryMentions('flying via Indianapolis')).toHaveLength(0);
  });
});

describe('trip direction', () => {
  it('reads "from X" as residence and "to X" as destination', () => {
    expect(detectTripContext('Which insurance for a USA trip from India?')).toEqual({
      destinationCode: 'US',
      residenceCode: 'IN',
    });
    expect(detectTripContext('I live in India and am travelling to Japan')).toEqual({
      destinationCode: 'JP',
      residenceCode: 'IN',
    });
    expect(detectTripContext('I am from the United Kingdom going to Spain')).toEqual({
      destinationCode: 'ES',
      residenceCode: 'GB',
    });
  });

  it('treats a lone country as the destination', () => {
    expect(detectTripContext('Best plan for a trip to Thailand?')).toEqual({
      destinationCode: 'TH',
      residenceCode: undefined,
    });
  });

  it('handles the parents-visiting-USA phrasing', () => {
    expect(detectTripContext('My parents are visiting the United States from India')).toEqual({
      destinationCode: 'US',
      residenceCode: 'IN',
    });
  });

  it('returns nothing when no country is mentioned', () => {
    expect(detectTripContext('What does CFAR mean?')).toEqual({
      destinationCode: undefined,
      residenceCode: undefined,
    });
  });
});
