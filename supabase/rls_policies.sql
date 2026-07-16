-- Redz Restaurant — Supabase RLS policies (run in SQL Editor before go-live)
-- Goal: guests can INSERT only; staff (authenticated) can manage rows.

-- ========== reservations ==========
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reservations" ON public.reservations;
DROP POLICY IF EXISTS "auth_select_reservations" ON public.reservations;
DROP POLICY IF EXISTS "auth_update_reservations" ON public.reservations;
DROP POLICY IF EXISTS "auth_delete_reservations" ON public.reservations;

CREATE POLICY "anon_insert_reservations"
  ON public.reservations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "auth_select_reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_update_reservations"
  ON public.reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_delete_reservations"
  ON public.reservations FOR DELETE
  TO authenticated
  USING (true);

-- ========== leads ==========
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;
DROP POLICY IF EXISTS "auth_select_leads" ON public.leads;
DROP POLICY IF EXISTS "auth_update_leads" ON public.leads;
DROP POLICY IF EXISTS "auth_delete_leads" ON public.leads;

CREATE POLICY "anon_insert_leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "auth_select_leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_update_leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_delete_leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);

-- After running: Supabase → Authentication → Providers → Email
-- → DISABLE "Allow new users to sign up".
-- Staff accounts: allowlisted Create account on /admin via SUPABASE_SERVICE_ROLE_KEY
-- (see ADMIN-SETUP.md), or Add user in the Supabase Auth dashboard.
