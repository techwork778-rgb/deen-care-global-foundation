import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: Parameters<typeof updateSession>[0]) {
  return await updateSession(request)
}

// Use the Node.js runtime so @supabase/ssr and the pg driver can be loaded.
export const runtime = 'nodejs'

export const config = {
  matcher: [
    '/get-help',
    '/get-help/:path*',
    '/my-requests',
    '/my-requests/:path*',
    '/admin',
    '/admin/:path*',
    '/api/help-requests',
    '/api/admin/:path*',
  ],
}
