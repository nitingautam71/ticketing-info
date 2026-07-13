import { NextResponse } from 'next/server';
import { searchCruises } from '@/lib/providers/cruises';

function parseList(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const list = value.split(',').map((v) => v.trim()).filter(Boolean);
  return list.length > 0 ? list : undefined;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const destinations = parseList(searchParams.get('destination'));
    const cruiseLines = parseList(searchParams.get('cruiseLine'));
    const departurePorts = parseList(searchParams.get('departurePort'));
    const durations = parseList(searchParams.get('duration'));
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const riverCruise = searchParams.get('riverCruise') === 'true' ? true : (searchParams.get('riverCruise') === 'false' ? false : undefined);
    const oceanCruise = searchParams.get('oceanCruise') === 'true' ? true : (searchParams.get('oceanCruise') === 'false' ? false : undefined);
    const adultsOnly = searchParams.get('adultsOnly') === 'true' ? true : undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const response = await searchCruises({
      q,
      destinations,
      cruiseLines,
      departurePorts,
      durations,
      minPrice,
      maxPrice,
      riverCruise,
      oceanCruise,
      adultsOnly,
      page,
      limit
    });

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to search cruises' },
      { status: 500 }
    );
  }
}
