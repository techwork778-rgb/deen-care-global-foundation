/**
 * The public key. Supabase exposes this as either the legacy "anon" key
 * (`eyJ...`) or the newer "publishable" key (`sb_publishable_...`). Both work
 * with @supabase/ssr; we accept either env var name.
 */
export function supabasePublicKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  )
}
