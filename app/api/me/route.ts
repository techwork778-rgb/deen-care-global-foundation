import { NextResponse } from 'next/server'
import { getSession, isAdminEmail } from '@/lib/supabase/server'

/**
 * Returns the signed-in user's email and admin flag. Used by the client-side
 * header nav so we never need to expose the ADMIN_EMAIL value to the browser.
 */
export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({
    user: {
      email: user.email,
      isAdmin: isAdminEmail(user.email),
    },
  })
}
