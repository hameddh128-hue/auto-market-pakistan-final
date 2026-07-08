# Supabase Setup

This project uses **Supabase** (hosted Postgres + Auth + Storage) for
everything — accounts, ad listings, favorites, categories, and image
storage. There is no Express/MongoDB backend anymore and nothing else to
deploy: Next.js talks to Supabase directly from the browser and from
server-rendered pages.

## 1. Create a Supabase project
1. Go to https://supabase.com → New Project (free tier is fine).
2. Once it's created, go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret — see step 4)

## 2. Run the database migration
1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` (in this repo) and
   click **Run**.

This single file sets up the whole backend:
- `public.profiles` — mirrors `auth.users` with name/phone/city/role/ban
  status, auto-filled on signup by a trigger.
- `public.categories` — reference table seeded with `car` / `bike`.
- `public.ads` — every listing, with RLS so the public only ever sees
  `status = 'approved'` rows (owners and admins see their own/all rows too).
  A trigger resets an ad back to `pending` whenever its owner edits it, and
  prevents owners from setting `is_featured` or changing ownership.
- `public.favorites` — a user's saved ads, readable/writable only by that
  user.
- The `ad-images` **Storage bucket** (public read) with policies so users
  can only upload/delete files inside their own `<user_id>/...` folder (or
  an admin can delete any).
- An `increment_ad_views()` function so ad-detail page views can be counted
  without granting anonymous visitors general write access to `ads`.

You can re-run this file safely at any time — everything uses
`create ... if not exists` / `drop policy if exists` / `create or replace`.

## 3. Add environment variables

**Locally:** copy `frontend/.env.local.example` to `frontend/.env.local` and
fill in the values from step 1.

**On Vercel:** Project → Settings → Environment Variables, add:

| Key | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Project URL | public, used by the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon public key | public, RLS keeps it safe |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role key | **server-only** — do not prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | your live domain | used to build the sitemap |

Redeploy after adding them (Vercel doesn't pick up new env vars on an
existing deployment automatically).

## 4. Why a service role key at all?

Everything in this app is designed to work with just the `anon` key plus RLS
— except deleting a user's login, which Supabase deliberately only allows
via its Admin API using the `service_role` key (this is by design: it's a
destructive, account-level operation). That one action lives entirely in
`frontend/pages/api/admin/delete-user.js`, a Vercel serverless function that:
1. verifies the caller's session token,
2. checks the caller's `profiles.role = 'admin'`,
3. only then calls `supabase.auth.admin.deleteUser(...)`.

The `service_role` key is never sent to the browser and is only read from
`process.env` inside that one server-side file.

## 5. Become an admin
Sign up once through the site, then run in the SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## 6. Optional: skip email confirmation for local testing
By default Supabase requires users to click a confirmation email before they
can log in. For faster local testing, go to **Authentication → Providers →
Email** and turn off "Confirm email". Turn it back on before going live.
