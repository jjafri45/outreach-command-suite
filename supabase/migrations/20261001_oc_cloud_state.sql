create table public.oc_cloud_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.oc_cloud_state enable row level security;
revoke all on public.oc_cloud_state from anon, authenticated;
grant select, insert, update, delete on public.oc_cloud_state to authenticated;

create policy "oc_select_own" on public.oc_cloud_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "oc_insert_own" on public.oc_cloud_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "oc_update_own" on public.oc_cloud_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "oc_delete_own" on public.oc_cloud_state for delete to authenticated using ((select auth.uid()) = user_id);
