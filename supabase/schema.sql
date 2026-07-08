-- ============================================================================
-- Auto Market Pakistan — Full Supabase schema (Auth + Ads + Favorites +
-- Categories + Storage). Run this once in your Supabase project's SQL Editor
-- (Dashboard > SQL Editor > New query) on a fresh project. Safe to re-run —
-- every object is created with IF NOT EXISTS / OR REPLACE / DROP-then-CREATE.
--
-- This is the ONLY backend this project needs. There is no Express/Node API
-- to deploy — Next.js talks to Supabase directly from the frontend, and the
-- few actions that need elevated privileges (deleting a user's login) run as
-- Vercel serverless functions using the Supabase service role key.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES  (mirrors auth.users, one row per signed-up user)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  name       text not null default '',
  email      text not null,
  phone      text not null default '',
  city       text not null default '',
  role       text not null default 'user' check (role in ('user', 'admin')),
  is_banned  boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES  (reference table — lets an admin add more than car/bike
--    later without a schema migration; ads.category is a foreign key to it)
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  sort_order int not null default 0
);

insert into public.categories (slug, name, sort_order) values
  ('car', 'Cars', 1),
  ('bike', 'Bikes', 2)
on conflict (slug) do nothing;

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- ----------------------------------------------------------------------------
-- 3. ADS
-- ----------------------------------------------------------------------------
create table if not exists public.ads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  category     text not null references public.categories(slug),
  title        text not null,
  brand        text not null,
  model        text not null,
  year         int not null check (year between 1970 and 2100),
  price        numeric not null check (price >= 0),
  city         text not null,
  mileage      int not null check (mileage >= 0),
  fuel_type    text not null check (fuel_type in ('Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric')),
  transmission text not null check (transmission in ('Manual', 'Automatic')),
  description  text not null,
  images       text[] not null default '{}',
  whatsapp     text not null,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured  boolean not null default false,
  views        int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists ads_status_idx on public.ads (status);
create index if not exists ads_category_idx on public.ads (category);
create index if not exists ads_city_idx on public.ads (city);
create index if not exists ads_user_id_idx on public.ads (user_id);
create index if not exists ads_created_at_idx on public.ads (created_at desc);
create index if not exists ads_search_idx on public.ads
  using gin (to_tsvector('english', title || ' ' || brand || ' ' || model || ' ' || city || ' ' || description));

alter table public.ads enable row level security;

-- Helper: is the currently-authenticated user an admin? `security definer` +
-- fixed search_path lets this safely read `profiles` from inside RLS policies
-- (including profiles' own policies) without recursive-permission problems.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: is the currently-authenticated user banned?
create or replace function public.is_banned()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_banned from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---- profiles policies (defined here, after is_admin(), so they can use it) ----
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---- ads policies ----
drop policy if exists "Approved ads are viewable by everyone" on public.ads;
create policy "Approved ads are viewable by everyone"
  on public.ads for select
  using (
    status = 'approved'
    or user_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "Users can insert their own pending ads" on public.ads;
create policy "Users can insert their own pending ads"
  on public.ads for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and is_featured = false
    and not public.is_banned()
  );

drop policy if exists "Admins can insert any ad" on public.ads;
create policy "Admins can insert any ad"
  on public.ads for insert
  with check (public.is_admin());

drop policy if exists "Owners and admins can update ads" on public.ads;
create policy "Owners and admins can update ads"
  on public.ads for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Owners and admins can delete ads" on public.ads;
create policy "Owners and admins can delete ads"
  on public.ads for delete
  using (auth.uid() = user_id or public.is_admin());

-- A non-admin edit must always drop back to "pending" review and can never
-- grant itself the featured flag or change ownership — enforced server-side
-- with a trigger since RLS's WITH CHECK only sees the new row, not the diff.
create or replace function public.enforce_ad_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.user_id := old.user_id;
    new.is_featured := old.is_featured;
    new.status := 'pending';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists on_ad_update on public.ads;
create trigger on_ad_update
  before update on public.ads
  for each row execute procedure public.enforce_ad_update_rules();

-- Lets anyone (including anonymous visitors) increment an ad's view counter
-- without granting them general UPDATE rights on the ads table.
create or replace function public.increment_ad_views(ad_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ads set views = views + 1 where id = ad_id;
end;
$$;

grant execute on function public.increment_ad_views(uuid) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 4. FAVORITES
-- ----------------------------------------------------------------------------
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  ad_id      uuid not null references public.ads(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, ad_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);

alter table public.favorites enable row level security;

drop policy if exists "Users can view their own favorites" on public.favorites;
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "Users can add their own favorites" on public.favorites;
create policy "Users can add their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their own favorites" on public.favorites;
create policy "Users can remove their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'city', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. STORAGE — bucket + policies for ad photos
--    Path convention enforced by the app: <user_id>/<ad_id-or-tmp>/<filename>
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ad-images', 'ad-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

drop policy if exists "Ad images are publicly viewable" on storage.objects;
create policy "Ad images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'ad-images');

drop policy if exists "Users can upload ad images into their own folder" on storage.objects;
create policy "Users can upload ad images into their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'ad-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
    and not public.is_banned()
  );

drop policy if exists "Users can delete their own ad images" on storage.objects;
create policy "Users can delete their own ad images"
  on storage.objects for delete
  using (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- ----------------------------------------------------------------------------
-- Optional: promote your own account to admin after you've signed up once.
-- update public.profiles set role = 'admin' where email = 'you@example.com';
-- ----------------------------------------------------------------------------
