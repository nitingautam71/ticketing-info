import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { siteSettingSchema } from '@/lib/cms';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const input = siteSettingSchema.parse(body);

    const setting = await prisma.siteSetting.upsert({
      where: { key: input.key },
      create: { key: input.key, value: input.value },
      update: { value: input.value },
    });
    await logAdminAction('setting.updated', 'SiteSetting', input.key);
    return NextResponse.json({ success: true, setting });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to save site setting:', err);
    return NextResponse.json({ error: 'Failed to save site setting' }, { status: 500 });
  }
}
