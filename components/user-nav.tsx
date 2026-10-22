'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Me = { email?: string; isAdmin?: boolean } | null

export function UserNav() {
  const router = useRouter()
  const [me, setMe] = useState<Me | undefined>(undefined)

  useEffect(() => {
    let active = true
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { user?: { email?: string; isAdmin?: boolean } }) =>
        active ? setMe(data?.user ?? null) : null,
      )
      .catch(() => active && setMe(null))
    return () => {
      active = false
    }
  }, [])

  // Created lazily on sign-out so nothing runs during static prerender.
  async function signOut() {
    try {
      await createClient().auth.signOut()
    } catch {
      // ignore — session cookie is cleared by the redirect/refresh anyway
    }
    setMe(null)
    router.push('/')
    router.refresh()
  }

  if (me === undefined) return null // loading
  if (!me) {
    return (
      <Link href="/login" className="user-nav-link">
        Sign in
      </Link>
    )
  }

  return (
    <div className="user-nav">
      <Link href="/my-requests" className="user-nav-link">My requests</Link>
      {me.isAdmin && (
        <Link href="/admin" className="user-nav-link user-nav-admin">Admin</Link>
      )}
      <button type="button" onClick={signOut} className="user-nav-link user-nav-signout">
        Sign out
      </button>
    </div>
  )
}
