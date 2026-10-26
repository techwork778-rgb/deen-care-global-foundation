import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabasePublicKey } from '@/lib/supabase/public-key'
import { getPublicOrigin } from '@/lib/supabase/public-origin'

/**
 * Supabase redirects here after Google completes the OAuth flow. We exchange
 * the `code` for a session (setting the auth cookies) and then send the user
 * to the page they originally wanted (or /get-help by default).
 *
 * The redirect origin is the public host, not `request.url`. Behind a reverse
 * proxy Next builds that URL as https://localhost:3000, which sent signed-in
 * users off the production site even though the session cookie was already set.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/get-help'
  const redirectUrl = new URL(safeNext, getPublicOrigin(request))

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabasePublicKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          },
        },
      },
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(redirectUrl)
}
