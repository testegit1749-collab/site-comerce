-- Eli Luz — Catálogo digital | Schema Supabase
-- Rode no SQL Editor do Supabase (na ordem). Depois crie o bucket "product-images" (public).

-- 1) Tabelas
create table if not exists categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  image text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists collections (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists products (
  id text primary key,
  name text not null,
  slug text unique not null,
  code text not null,
  category text not null default '',
  collection text not null default '',
  description text default '',
  price numeric,
  compare_at numeric,
  show_price boolean default true,
  status text default 'active' check (status in ('active','inactive')),
  tags text[] default '{}',
  featured boolean default false,
  is_new boolean default false,
  sort_order int default 0,
  images text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 2) RLS
alter table categories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table settings enable row level security;

-- Leitura pública (catálogo)
drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);
drop policy if exists "public read collections" on collections;
create policy "public read collections" on collections for select using (true);
drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (status = 'active');
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);

-- Escrita só autenticado (admin). Crie o usuário em Authentication > Users.
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated');
drop policy if exists "admin write collections" on collections;
create policy "admin write collections" on collections for all using (auth.role() = 'authenticated');
drop policy if exists "admin write products" on products;
create policy "admin write products" on products for all using (auth.role() = 'authenticated');
drop policy if exists "admin write settings" on settings;
create policy "admin write settings" on settings for all using (auth.role() = 'authenticated');

-- 3) Storage: crie o bucket "product-images" como PUBLIC no painel Storage,
-- depois rode:
-- insert into storage.buckets (id, name, public) values ('product-images','product-images', true)
-- on conflict (id) do nothing;

-- drop policy if exists "public read images" on storage.objects;
-- create policy "public read images" on storage.objects for select using (bucket_id = 'product-images');
-- drop policy if exists "admin write images" on storage.objects;
-- create policy "admin write images" on storage.objects for all using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- 5) Evolução: coluna de preço antigo (rode se já criou as tabelas antes)
-- alter table products add column if not exists compare_at numeric;

-- 4) Linha inicial de settings
insert into settings (id, data) values ('main', '{"brandName":"Eli Luz"}')
on conflict (id) do nothing;
