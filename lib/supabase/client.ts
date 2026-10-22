import { createBrowserClient } from '@supabase/ssr'
import { supabasePublicKey } from './public-key'

/**
 * Supabase client for use in Client Components.
 * Uses the public anon/publishable key — safe to expose to the browser.
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey())
}
