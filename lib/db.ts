import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'
import { Pool } from 'pg'

/**
 * App-level user profiles.
 *
 * Supabase Auth manages the canonical user records in the `auth.users` table
 * (created automatically by Supabase). This `public.users` table is a thin
 * mirror used for joins in the admin dashboard. It is populated by a database
 * trigger (`supabase/user_profiles_trigger.sql`) whenever a new auth user is
 * created via Google sign-in. The `id` matches `auth.users.id`.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const helpRequests = pgTable('help_requests', {
  id: text('id').primaryKey(),
  referenceId: text('reference_id').notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  country: text('country').notNull(),
  city: text('city'),
  assistanceType: text('assistance_type').notNull(),
  description: text('description').notNull(),
  additionalInfo: text('additional_info'),
  consent: boolean('consent').notNull(),
  status: text('status').notNull().default('NEW'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase requires SSL on direct connections (port 5432).
  ssl: { rejectUnauthorized: false },
})
export const db = drizzle(pool)
