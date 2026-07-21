import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

/**
 * Records an admin mutation in the AuditLog table. Best-effort: an audit-write
 * failure must never break the underlying operation, so errors are swallowed
 * (and logged to the server console) rather than propagated.
 *
 * `actor` is "admin" for now — the shared-password gate has no per-user
 * identity. Once real per-user auth lands, pass the authenticated user's email.
 */
export async function logAdminAction(
  action: string,
  entity: string,
  entityId?: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: { actor: 'admin', action, entity, entityId, meta: (meta ?? undefined) as Prisma.InputJsonValue | undefined },
    });
  } catch (err) {
    console.error('Failed to write audit log:', action, entity, entityId, err);
  }
}
