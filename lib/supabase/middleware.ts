import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabasePublicKey } from './public-key'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase()

const PROTECTED_PREFIXES = ['/get-help', '/my-requests', '/admin', '/api/help-requests']
const ADMIN_PREFIXES = ['/admin', '/api/admin']

function isProtected(path: string) {
  return PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
}

function isAdminOnly(path: string) {
  return ADMIN_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
}

/**
 * Refreshes the Supabase session cookie on every matched request and enforces
 * route protection. Must run on the Node.js runtime (loads @supabase/ssr).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: do not run between `supabase.auth.getUser()` and the response
  // check below — any code here risks SSRF attacks.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (isProtected(path)) {
    if (!user) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(url)
    }
    if (isAdminOnly(path)) {
      const email = user.email?.trim().toLowerCase()
      if (!email || email !== ADMIN_EMAIL) {
        if (path.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
  }

  return response
}
