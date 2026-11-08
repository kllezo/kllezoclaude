-- Kllezo shared backend: enquiries from both experiences + CMS-ready case studies.

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  full_name     text not null,
  business_name text not null,
  email         text not null,
  mobile        text not null,
  website       text,
  industry      text not null,
  services      text[] not null,
  requirements  text not null,
  budget        text not null,
  message       text,
  experience    text not null check (experience in ('creative', 'business')),
  source_path   text,
  status        text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  notes         text
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);

-- Only the server (service role) writes or reads enquiries.
alter table public.enquiries enable row level security;

create table if not exists public.case_studies (
  slug         text primary key,
  published    boolean not null default false,
  client       text not null,
  intro        text not null,
  categories   text[] not null,
  problem      text not null,
  strategy     text not null,
  execution    text not null,
  deliverables text[] not null default '{}',
  -- [{ "label": "...", "value": "...", "source": "who verified it" }] — verified figures only
  results      jsonb not null default '[]',
  media        jsonb not null default '[]',
  updated_at   timestamptz not null default now()
);

alter table public.case_studies enable row level security;
create policy "Published case studies are public"
  on public.case_studies for select using (published = true);
