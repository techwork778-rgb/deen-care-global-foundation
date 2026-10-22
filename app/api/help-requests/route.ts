import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db, helpRequests } from '@/lib/db'
import { makeReferenceId } from '@/lib/site-data'
import { getSession } from '@/lib/supabase/server'
import { sendAdminRequestNotification } from '@/lib/email'

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.string().email().max(160),
  country: z.string().trim().min(2).max(100),
  city: z.string().trim().max(100).optional(),
  assistanceType: z.string().trim().min(2).max(100),
  description: z.string().trim().min(30).max(3000),
  additionalInfo: z.string().trim().max(5000).optional(),
  consent: z.literal('true'),
  website: z.string().max(0).optional(), // honeypot
})

export async function POST(request: Request) {
  try {
    // Require an authenticated Supabase session before accepting a request.
    const user = await getSession()
    if (!user?.email) {
      return NextResponse.json({ error: 'You must be signed in to submit a request.' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check the highlighted details and try again.' }, { status: 400 })
    }
    if (parsed.data.website) {
      return NextResponse.json({ error: 'Unable to submit request.' }, { status: 400 })
    }

    const referenceId = makeReferenceId()
    const { website: _website, consent, ...rest } = parsed.data
    const fields = { ...rest, consent: consent === 'true' }
    const id = crypto.randomUUID()
    const [inserted] = await db
      .insert(helpRequests)
      .values({ id, referenceId, userId: user.id, ...fields, status: 'NEW' })
      .returning()

    // Notify the admin by email. Failures here must not break the user flow —
    // the request is already saved. Log to the server console for follow-up.
    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000'
      await sendAdminRequestNotification({
        referenceId,
        fullName: fields.fullName,
        email: fields.email,
        phone: fields.phone,
        country: fields.country,
        city: fields.city,
        assistanceType: fields.assistanceType,
        description: fields.description,
        additionalInfo: fields.additionalInfo,
        createdAt: inserted?.createdAt ?? new Date(),
        adminUrl: `${appUrl}/admin/${referenceId}`,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
    }

    return NextResponse.json({ referenceId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'We could not save your request right now. Please try again.' }, { status: 500 })
  }
}
