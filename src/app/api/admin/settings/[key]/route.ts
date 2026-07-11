import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  await prisma.siteSetting.delete({ where: { key: decodeURIComponent(key) } });
  return NextResponse.json({ success: true });
}
