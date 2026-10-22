import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db, helpRequests } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/supabase/server'
import { REQUEST_STATUSES } from '@/lib/status'

const patchSchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  adminNotes: z.string().trim().max(5000).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ referenceId: string }> },
) {
  // Server-side authorization: only the configured admin email may update.
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { referenceId } = await params
  const parsed = patchSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (parsed.data.status !== undefined) updates.status = parsed.data.status
  if (parsed.data.adminNotes !== undefined) updates.adminNotes = parsed.data.adminNotes

  const [updated] = await db
    .update(helpRequests)
    .set(updates)
    .where(eq(helpRequests.referenceId, referenceId))
    .returning({ id: helpRequests.id })

  if (!updated) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
