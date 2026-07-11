import { NextResponse } from 'next/server';
import { searchHotels } from '@/lib/providers/hotels';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const destId = searchParams.get('destId') || '';
  const searchType = searchParams.get('searchType') || '';
  const location = searchParams.get('location') || 'London';
  const destLatitude = searchParams.get('destLat');
  const destLongitude = searchParams.get('destLng');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = Math.min(30, Math.max(1, parseInt(searchParams.get('adults') || '2', 10) || 2));
  const rooms = Math.min(8, Math.max(1, parseInt(searchParams.get('rooms') || '1', 10) || 1));
  const childAgesParam = searchParams.get('childAges') || '';
  const childAges = childAgesParam
    .split(',')
    .map((a) => parseInt(a, 10))
    .filter((a) => !Number.isNaN(a) && a >= 0 && a <= 17);

  try {
    const hotels = await searchHotels({
      destId,
      searchType,
      location,
      destLatitude: destLatitude ? parseFloat(destLatitude) : undefined,
      destLongitude: destLongitude ? parseFloat(destLongitude) : undefined,
      checkIn,
      checkOut,
      adults,
      childAges,
      rooms,
    });
    return NextResponse.json(hotels);
  } catch (err) {
    console.error('Hotel search failed', err);
    return NextResponse.json([]);
  }
}