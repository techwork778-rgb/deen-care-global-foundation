import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

// Load .env.local first (Next.js convention), fall back to .env
config({ path: '.env.local' })
config()

export default defineConfig({
  schema: './lib/db.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // Supabase requires SSL on direct connections (port 5432).
    ssl: 'require',
  },
  verbose: true,
  strict: true,
})
