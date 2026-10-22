# Backend setup guide (Supabase)

This guide sets up the three pieces the backend needs, all hosted on Supabase
(no local PostgreSQL, Docker, or pgAdmin required):

1. A **Supabase Postgres** database (Drizzle connects to it directly).
2. **Supabase Auth** with the **Google** provider (handles Google OAuth and
   sessions — no separate auth library).
3. An **Outlook SMTP** mailbox for admin notification emails.

All secrets live in `.env.local` (gitignored). Copy the template first:

```bash
cp .env.example .env.local
```

## 1. Create the Supabase project

1. Go to https://supabase.com and sign in (you can use the Google account you
   intend to use as the admin).
2. **New project** → pick an organization → name it (e.g. "DEEN Care") → set a
   strong database password → choose a region close to you → **Create**.
3. Wait ~2 minutes for provisioning to finish.

## 2. Get the project URL, anon key, and database URL

Dashboard → **Project Settings** → **API**:
- `Project URL` → copy to `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Dashboard → **Project Settings** → **Database** → **Connection string** →
**URI** (the direct connection, host `db.xxxx.supabase.co`, port `5432`):
- Replace `[YOUR-PASSWORD]` with the database password you set in step 1.
- Copy the full string to `DATABASE_URL`. It looks like:
  ```
  postgresql://postgres.xxxx:YOUR_PASSWORD@db.xxxx.supabase.co:5432/postgres
  ```

> For a serverless deployment you can switch to the **pooler** connection
> (Session mode, port 5432 on the `pooler.supabase.com` host). For local dev
> the direct connection above is simplest and works with Drizzle + node-postgres.

## 3. Create the database tables (Drizzle)

From the project root:

```bash
npx drizzle-kit push
```

`drizzle-kit` reads `DATABASE_URL` from `.env.local`, lists the 3 tables it will
create (`users`, `help_requests`, `contact_messages`), and asks for
confirmation. Confirm. The schema is now live in Supabase.

> You can also run `npx drizzle-kit migrate` to apply the generated SQL file in
> `drizzle/` instead of `push`. Either works for a brand-new database.

## 4. Add the user-profile trigger

Supabase Auth stores users in its own `auth.users` table. We mirror the bits we
need (name, email, avatar) into our `public.users` table via a trigger so the
admin dashboard can join without the service-role key.

1. Dashboard → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/user_profiles_trigger.sql` (from this
   repo) and **Run**. It creates the `handle_new_user` function and the
   `on_auth_user_created` trigger.

(You only do this once. It is safe to re-run.)

## 5. Configure Google OAuth in Supabase

Supabase Auth handles the Google flow, so the OAuth callback points at Supabase,
not your app.

### 5a. Create Google OAuth credentials

1. Go to https://console.cloud.google.com/ (sign in with your admin Google
   account).
2. Create or select a project.
3. **APIs & Services → OAuth consent screen**
   - User type: **External** (or Internal if you have a Workspace).
   - Fill in app name (e.g. "DEEN Care"), support email, developer email.
   - Add the scopes `email`, `profile`, `openid`.
   - Add your own email as a **Test user** while the app is in "Testing" mode.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs — add **exactly**:
     ```
     https://<YOUR-SUPABASE-REF>.supabase.co/auth/v1/callback
     ```
     (Find `<YOUR-SUPABASE-REF>` in Dashboard → Project Settings → API → Project
     URL, e.g. `https://abcd1234.supabase.co` → ref is `abcd1234`.)
   - Create, then copy the **Client ID** and **Client secret**.

### 5b. Enable Google in Supabase

1. Dashboard → **Authentication → Providers → Google** → enable it.
2. Paste the **Client ID** and **Client secret** from step 5a.
3. Save.

## 6. Set the admin email + Auth secret

In `.env.local`:
```
ADMIN_EMAIL=your_admin_address@gmail.com
```
This is the only Google account that can access `/admin`. It is compared
case-insensitively and must match the email you sign in with.

> Auth.js is no longer used — Supabase Auth issues and signs its own JWT
> session cookies, so there is no separate `AUTH_SECRET` to set.

## 7. Outlook SMTP (admin notification emails)

Use an Outlook.com or Microsoft 365 mailbox. If 2-factor auth is on
(recommended), create an **App Password** at
https://account.microsoft.com/security instead of using your main password.

In `.env.local`:
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_address@outlook.com
SMTP_PASSWORD=<your app password>
SMTP_FROM="DEEN Care <your_address@outlook.com>"
```

> Outlook SMTP: host `smtp-mail.outlook.com`, port `587`, STARTTLS. For
> Microsoft 365 mailboxes, host `smtp.office365.com` also works.

## 8. Run

```bash
pnpm dev
```

- Visit http://localhost:3000 → click **Request assistance** → you'll be sent
  to **/login** to Continue with Google.
- After Google sign-in you land on `/get-help`. Submit a request. It is saved
  to Supabase Postgres and an email is sent to `ADMIN_EMAIL` with a direct link
  to that request in the dashboard.
- Visit **/my-requests** to see your own request statuses.
- Sign in with the `ADMIN_EMAIL` account and visit **/admin** to manage all
  requests (search, filter, update status, add admin notes).

## Security notes

- Protected routes are enforced in `middleware.ts` (via `@supabase/ssr`) **and**
  re-checked server-side in each page/API via `requireAdmin()` / `getSession()`.
- The admin PATCH endpoint returns 403 for any non-admin session.
- Users can only ever see their own requests (filtered server-side by
  `userId` = the Supabase auth user id).
- No secrets are exposed to the frontend:
  - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for
    the browser by design (the anon key is restricted by Supabase RLS/auth).
  - `DATABASE_URL`, `SMTP_*`, and `ADMIN_EMAIL` are server-only.
- The service-role key is **not** used or stored anywhere — the app talks to
  Postgres via Drizzle using the database connection string, and reads user
  profiles from the trigger-mirrored `public.users` table.

## Database schema (summary)

Managed by Drizzle in `lib/db.ts`:

- `users` (public schema) — `id` (uuid, matches `auth.users.id`), `email`,
  `full_name`, `avatar_url`, `created_at`. Populated by the trigger in step 4.
- `help_requests` — the assistance requests, with `user_id` → `users.id`.
- `contact_messages` — the existing contact-form messages (unchanged).

Supabase Auth manages `auth.users`, `auth.sessions`, etc. automatically; we do
not create or touch those tables.
