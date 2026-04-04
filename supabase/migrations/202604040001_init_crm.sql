create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  room text not null,
  dimensions text not null,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  description text not null,
  stage text not null default 'LEAD_RECEBIDO',
  estimated_value numeric,
  installation_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  status text not null default 'rascunho',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.quote_versions (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quotes(id) on delete cascade,
  version int not null,
  data jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  due_date date not null,
  done boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.clients enable row level security;
alter table public.measurements enable row level security;
alter table public.opportunities enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_versions enable row level security;
alter table public.tasks enable row level security;

create policy "authenticated_rw_clients" on public.clients for all to authenticated using (true) with check (true);
create policy "authenticated_rw_measurements" on public.measurements for all to authenticated using (true) with check (true);
create policy "authenticated_rw_opportunities" on public.opportunities for all to authenticated using (true) with check (true);
create policy "authenticated_rw_quotes" on public.quotes for all to authenticated using (true) with check (true);
create policy "authenticated_rw_quote_versions" on public.quote_versions for all to authenticated using (true) with check (true);
create policy "authenticated_rw_tasks" on public.tasks for all to authenticated using (true) with check (true);
