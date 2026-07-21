import type { CorridorResult, TrainJourney, TrainService, TrainStation } from './types';
import { cheapestFareLabel, formatDuration, formatFare } from './format';
import { operatorById } from './data/operators';

type Faq = { question: string; answer: string };

function cityLabel(stations: TrainStation[]): string {
  return stations[0]?.city ?? '';
}

export function corridorMetaTitle(result: CorridorResult): string {
  const from = cityLabel(result.from);
  const to = cityLabel(result.to);
  const n = result.journeys.length;
  return `${from} to ${to} by Train — ${n} ${n === 1 ? 'Train' : 'Trains'}, Times & Fares`;
}

export function corridorMetaDescription(result: CorridorResult): string {
  const from = cityLabel(result.from);
  const to = cityLabel(result.to);
  const fastest = result.fastest;
  const cheapest = result.cheapest;
  const parts = [`Compare all trains from ${from} to ${to}`];
  if (fastest) parts.push(`fastest ${formatDuration(fastest.durationMin)} on the ${fastest.service.name}`);
  if (cheapest) {
    const label = cheapestFareLabel(cheapest.classes);
    if (label) parts.push(`fares ${label}`);
  }
  parts.push('timetables, classes, amenities and booking help from our rail desk.');
  return parts.join(' — ') + '';
}

export function corridorFaqs(result: CorridorResult): Faq[] {
  const from = cityLabel(result.from);
  const to = cityLabel(result.to);
  const faqs: Faq[] = [];
  const { fastest, cheapest, journeys } = result;

  if (fastest) {
    faqs.push({
      question: `What is the fastest train from ${from} to ${to}?`,
      answer: `The ${fastest.service.name} covers ${from} to ${to} in about ${formatDuration(fastest.durationMin)}, departing ${fastest.from.name} at ${fastest.departureTime}. Schedules are indicative — we confirm live timings before booking.`,
    });
  }
  if (cheapest) {
    const label = cheapestFareLabel(cheapest.classes);
    faqs.push({
      question: `How much does the train from ${from} to ${to} cost?`,
      answer: `Indicative fares start ${label ?? 'low'} on the ${cheapest.service.name}. Rail fares are dynamic (and quota-based in India), so exact pricing is confirmed at booking. Premium classes with meals and lounge access cost more.`,
    });
  }
  faqs.push({
    question: `How many trains run from ${from} to ${to}?`,
    answer: `Our timetable lists ${journeys.length} ${journeys.length === 1 ? 'service' : 'services'} on this corridor: ${[...new Set(journeys.map((j) => j.service.name))].slice(0, 5).join(', ')}${journeys.length > 5 ? ' and more' : ''}. Frequencies vary by day of week and season.`,
  });
  faqs.push({
    question: `How do I book a ${from} to ${to} train ticket?`,
    answer:
      'Send an enquiry from any train on this page — our rail desk confirms live availability, holds the best class for your budget, and issues tickets through the operator’s official or authorised channels, with support for changes and refunds afterwards.',
  });
  return faqs;
}

export function trainMetaTitle(service: TrainService): string {
  const first = service.stops[0];
  const last = service.stops[service.stops.length - 1];
  return `${service.name} — Timetable, Fares & Classes (${service.numbers.join('/')})`.replace(' (Hourly departures)', '');
}

export function trainMetaDescription(service: TrainService, from: TrainStation, to: TrainStation): string {
  const operator = operatorById(service.operator);
  return `${service.name} by ${operator?.name ?? ''}: ${from.city} to ${to.city} in ${formatDuration(service.durationMin)}, ${service.frequency.toLowerCase()}. Classes from ${
    service.classes[0] ? formatFare(service.classes[0]) : '—'
  }, amenities, stops, and booking help from our rail desk.`;
}

export function trainFaqs(service: TrainService, from: TrainStation, to: TrainStation): Faq[] {
  const operator = operatorById(service.operator);
  const cheapest = service.classes.reduce((a, b) => (b.fare < a.fare ? b : a), service.classes[0]);
  const faqs: Faq[] = [
    {
      question: `How long does the ${service.name} take?`,
      answer: `The full run from ${from.name} to ${to.name} is scheduled at about ${formatDuration(service.durationMin)}${service.maxSpeedKmh ? `, running up to ${service.maxSpeedKmh} km/h` : ''}. It operates ${service.frequency.toLowerCase()}.`,
    },
    {
      question: `How much is a ticket on the ${service.name}?`,
      answer: `Indicative end-to-end fares start at ${formatFare(cheapest)} in ${cheapest.name}${service.classes.length > 1 ? `, rising through ${service.classes.map((c) => c.name).slice(1).join(' and ')}` : ''}. Fares are dynamic — we confirm exact pricing at booking.`,
    },
  ];
  if (service.amenities.includes('wifi')) {
    faqs.push({ question: `Does the ${service.name} have Wi-Fi?`, answer: `Yes — complimentary onboard Wi-Fi is provided (coverage can drop in remote stretches and tunnels).` });
  }
  if (service.amenities.includes('dining_car') || service.amenities.includes('catering_included') || service.amenities.includes('cafe')) {
    const style = service.amenities.includes('catering_included')
      ? 'meals are included in the fare and served at your seat'
      : service.amenities.includes('dining_car')
        ? 'a dining car serves full meals (included for sleeper passengers) and a café car sells snacks'
        : 'a café car sells drinks, snacks and light meals';
    faqs.push({ question: `Is food available on the ${service.name}?`, answer: `Yes — ${style}.` });
  }
  if (operator) {
    faqs.push({ question: `Can I take luggage on the ${service.name}?`, answer: operator.policies.baggage });
    faqs.push({ question: `Are pets allowed on the ${service.name}?`, answer: operator.policies.pets });
  }
  return faqs;
}

export function stationMetaTitle(station: TrainStation): string {
  return `${station.name} (${station.code}) — Trains, Departures & Station Guide`;
}

export function stationMetaDescription(station: TrainStation): string {
  return `${station.name} in ${station.city}, ${station.region}: departures and trains serving ${station.code}, onward connections (${station.connections[0] ?? 'local transit'}), facilities, and booking help from our rail desk.`;
}

export function stationFaqs(station: TrainStation, trainNames: string[]): Faq[] {
  return [
    {
      question: `Which trains serve ${station.name}?`,
      answer: `${station.code} is served by ${trainNames.slice(0, 6).join(', ')}${trainNames.length > 6 ? ' and more' : ''}. See the departure board above for indicative times.`,
    },
    {
      question: `How do I get to ${station.name}?`,
      answer: `${station.connections.length > 0 ? `Onward connections include ${station.connections.join('; ')}.` : 'Local taxis and buses serve the station.'} The station is in ${station.city}, ${station.region}.`,
    },
    {
      question: `What facilities does ${station.name} have?`,
      answer: `Available facilities include ${station.facilities.map((f) => f.replace(/_/g, ' ')).join(', ')}. Facility hours can vary — arrive early if you need staffed services.`,
    },
  ];
}

/** Journey line used in AI grounding and share text. */
export function journeySummaryLine(j: TrainJourney): string {
  const fare = cheapestFareLabel(j.classes);
  return `${j.service.name} (${j.service.numbers.join('/')}): dep ${j.from.code} ${j.departureTime} → arr ${j.to.code} ${j.arrivalTime}${j.arrivalDayOffset > 0 ? ` (+${j.arrivalDayOffset}d)` : ''}, ${formatDuration(j.durationMin)}, ${fare ?? ''}, ${j.service.frequency}${j.status !== 'running' ? ` [STATUS: ${j.status}${j.statusNote ? ` — ${j.statusNote}` : ''}]` : ''}`;
}
