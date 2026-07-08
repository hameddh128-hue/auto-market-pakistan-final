# Auto Market Pakistan

A full-stack vehicle marketplace (cars & bikes) for Pakistan — built with
**Next.js, React, Tailwind CSS, and Supabase** (Postgres + Auth + Storage).

There is **no separate backend server**. The old Express + MongoDB API has
been fully removed and replaced with Supabase, called directly from the
Next.js frontend. The one privileged admin action (deleting a user's login)
runs as a Vercel serverless function using the Supabase service role key —
still just this one Next.js app, nothing extra to host or run.

---

## 1. Project Structure

```
auto-market-pakistan/
  frontend/    Next.js + Tailwind app (pages router) — the entire product
  supabase/    schema.sql — run once in the Supabase SQL Editor
```

## 2. Features

**Users:** register/login (Supabase Auth), post car/bike ads with up to 10
images (stored in Supabase Storage), full vehicle details (price, city,
brand, model, year, mileage, fuel type, transmission, description), WhatsApp
contact button, favorites, keyword search, advanced filters (city, brand,
price range, year range, fuel type, transmission, sort).

**Admin panel:** dashboard with statistics, manage users (ban/unban/delete),
approve/reject/delete ads, feature ads.

**Homepage:** hero with search, trust strip, categories, featured cars,
featured bikes, latest ads, CTA banner — fully responsive.

**SEO:** per-page meta tags, Open Graph tags, dynamic `sitemap.xml`,
`robots.txt`, web app manifest, favicon/app icons, server-side rendering for
the homepage and ad detail pages, custom 404 and error pages.

**Security:** all data access is enforced by Postgres Row Level Security
(RLS) policies in `supabase/schema.sql` — not application code. Regular users
can only ever read/write their own rows; admin-only actions are gated by a
`profiles.role = 'admin'` check baked into the policies themselves.

---

## 3. Requirements

- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) project (hosted Postgres + Auth +
  Storage — no database to install or manage yourself)

---

## 4. One-time Supabase setup

See **`SUPABASE_SETUP.md`** for the full walkthrough (create project, run
`supabase/schema.sql`, grab your keys). In short:

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run the contents of `supabase/schema.sql`. This
   creates every table (`profiles`, `categories`, `ads`, `favorites`), all
   RLS policies, the `ad-images` Storage bucket + its policies, and the
   triggers that keep `profiles` in sync with signups.
3. Copy your **Project URL**, **anon public key**, and **service_role key**
   from Project Settings → API.

---

## 5. Installation (Local Development)

```bash
cd frontend
cp .env.local.example .env.local   # then fill in the Supabase values
npm install
npm run dev                         # starts the site on http://localhost:3000
```

Edit `frontend/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never exposed to the browser
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Become an admin

Sign up once through the site (`/auth/register`), then in the Supabase SQL
Editor run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Log back in (or refresh) and visit `/admin`.

---

## 6. Deployment (Vercel)

1. Import the repository into Vercel and set the **Root Directory** to
   `frontend`.
2. Add environment variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (a normal/server env var — must **not**
     start with `NEXT_PUBLIC_`)
   - `NEXT_PUBLIC_SITE_URL` — your final domain, used by the sitemap
3. Deploy. Vercel runs `npm install` and `npm run build` automatically — no
   second service, no Dockerfile, no separate API host required.
4. In Supabase, under **Authentication → URL Configuration**, add your Vercel
   domain to the Site URL / Redirect URLs so auth emails link back correctly.

### Final checks after going live
- Register a test account, post a test ad with images, and approve it from
  `/admin`.
- Confirm images render (they're served straight from Supabase Storage's
  public CDN URLs).
- Check the site on mobile, tablet, and desktop widths.
- Confirm `https://yourdomain.com/sitemap.xml` lists your live ads.

---

## 7. Production Hardening Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set only as a server-side env var and is
      never referenced from any client-side code (it currently isn't —
      `pages/api/admin/delete-user.js` is the only file that touches it).
- [ ] Re-run `supabase/schema.sql` after any manual changes to keep RLS
      policies, triggers, and the Storage bucket config in sync with the file.
- [ ] Turn on **Confirm email** under Authentication → Providers → Email
      before going live (useful to turn off only for local testing).
- [ ] Set up Supabase's automated Postgres backups (Settings → Database →
      Backups; available on paid tiers).
- [ ] Consider adding rate limiting / CAPTCHA on `/auth/register` via
      Supabase Auth settings if spam signups become an issue.

---

## 8. Scripts Reference

**Frontend** (`frontend/package.json`):
- `npm run dev` — local development server
- `npm run build` — production build
- `npm start` — serve the production build (after `build`)

---

## 9. Notes

- All ads require admin approval before they appear publicly
  (`status: pending → approved/rejected`); editing an approved ad resets it
  to `pending` automatically (enforced by a Postgres trigger, not app code).
- Buyers contact sellers directly via WhatsApp — there is no in-app messaging
  or payment system by design.
- The project uses the Next.js Pages Router (not the App Router).
- Ad photos live in the public `ad-images` Supabase Storage bucket, under
  `<user_id>/<ad_id>/...` — Storage policies restrict uploads/deletes to the
  owning user (or an admin), while reads are public.
