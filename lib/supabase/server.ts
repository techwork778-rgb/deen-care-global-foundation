import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { supabasePublicKey } from './public-key'

/**
 * Supabase client for use in Server Components and Route Handlers.
 * Reads/writes the auth session from the request cookies.
 */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The `setAll` method was called from a Server Component where
            // cookies are read-only. This is safe to ignore — middleware will
            // refresh the session cookie on the next request.
          }
        },
      },
    },
  )
}

/** Returns the currently signed-in Supabase user, or null. */
export async function getSession(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/** Returns true if the given email matches the configured admin email. */
export function isAdminEmail(email?: string | null): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  return Boolean(admin && email && email.trim().toLowerCase() === admin)
}

/** Returns the user only if they are the configured admin; otherwise null. */
export async function requireAdmin(): Promise<User | null> {
  const user = await getSession()
  if (!user?.email || !isAdminEmail(user.email)) return null
  return user
}
