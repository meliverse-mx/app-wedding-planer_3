-- Esquema recomendado para la versión comercial.
-- Ejecuta este SQL en Supabase > SQL Editor.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan text default 'free' check (plan in ('free','pro','planner')),
  created_at timestamptz default now()
);
create table if not exists weddings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  couple_name text not null,
  wedding_date date,
  city text,
  state text,
  guests_estimate integer default 0,
  budget numeric default 0,
  ceremonies text[] default '{}',
  created_at timestamptz default now()
);
create table if not exists guests (
  id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings(id) on delete cascade,
  name text not null, phone text, email text, type text default 'mujer', age integer, accompanied_by text, confirmed boolean default false, created_at timestamptz default now()
);
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings(id) on delete cascade,
  title text not null, notes text, category text, time_window text, due_date date, done boolean default false
);
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings(id) on delete cascade,
  name text not null, category text, amount numeric default 0, created_at timestamptz default now()
);
create table if not exists entourage (
  id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings(id) on delete cascade,
  name text not null, type text, role text, phone text, notes text, confirmed boolean default false
);
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings(id) on delete cascade,
  name text not null, category text, phone text, amount numeric default 0, due_date date
);
create table if not exists wedding_events (
  id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings(id) on delete cascade,
  title text not null, event_date date, time text, person text
);

alter table profiles enable row level security; alter table weddings enable row level security; alter table guests enable row level security; alter table tasks enable row level security; alter table expenses enable row level security; alter table entourage enable row level security; alter table vendors enable row level security; alter table wedding_events enable row level security;

create policy "own profile" on profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "own weddings" on weddings for all using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
create policy "own wedding guests" on guests for all using (exists(select 1 from weddings w where w.id=guests.wedding_id and w.owner_id=auth.uid())) with check (exists(select 1 from weddings w where w.id=guests.wedding_id and w.owner_id=auth.uid()));
create policy "own wedding tasks" on tasks for all using (exists(select 1 from weddings w where w.id=tasks.wedding_id and w.owner_id=auth.uid())) with check (exists(select 1 from weddings w where w.id=tasks.wedding_id and w.owner_id=auth.uid()));
create policy "own wedding expenses" on expenses for all using (exists(select 1 from weddings w where w.id=expenses.wedding_id and w.owner_id=auth.uid())) with check (exists(select 1 from weddings w where w.id=expenses.wedding_id and w.owner_id=auth.uid()));
create policy "own wedding entourage" on entourage for all using (exists(select 1 from weddings w where w.id=entourage.wedding_id and w.owner_id=auth.uid())) with check (exists(select 1 from weddings w where w.id=entourage.wedding_id and w.owner_id=auth.uid()));
create policy "own wedding vendors" on vendors for all using (exists(select 1 from weddings w where w.id=vendors.wedding_id and w.owner_id=auth.uid())) with check (exists(select 1 from weddings w where w.id=vendors.wedding_id and w.owner_id=auth.uid()));
create policy "own wedding events" on wedding_events for all using (exists(select 1 from weddings w where w.id=wedding_events.wedding_id and w.owner_id=auth.uid())) with check (exists(select 1 from weddings w where w.id=wedding_events.wedding_id and w.owner_id=auth.uid()));

-- Migración para proyectos creados con versiones anteriores
alter table guests add column if not exists type text default 'mujer';
alter table guests add column if not exists age integer;
alter table guests add column if not exists accompanied_by text;
