-- Allowlisted staff can create accounts without an invite code

CREATE TABLE IF NOT EXISTS public.staff_allowlist (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT staff_allowlist_email_lower CHECK (email = lower(email))
);

ALTER TABLE public.staff_allowlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_staff_allowlist" ON public.staff_allowlist;
DROP POLICY IF EXISTS "auth_insert_staff_allowlist" ON public.staff_allowlist;
DROP POLICY IF EXISTS "auth_delete_staff_allowlist" ON public.staff_allowlist;

CREATE POLICY "auth_select_staff_allowlist"
  ON public.staff_allowlist FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_staff_allowlist"
  ON public.staff_allowlist FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_delete_staff_allowlist"
  ON public.staff_allowlist FOR DELETE TO authenticated USING (true);

INSERT INTO public.staff_allowlist (email)
VALUES ('marketing@laurellodging.com')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.register_staff_account(
  p_email text,
  p_password text,
  p_full_name text DEFAULT ''
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_email text := lower(trim(p_email));
  v_user_id uuid;
  v_encrypted text;
  v_allowed boolean := false;
BEGIN
  IF v_email IS NULL OR v_email = '' OR length(p_password) < 8 THEN
    RETURN json_build_object('success', false, 'error', 'Email and a password of at least 8 characters are required.');
  END IF;

  IF EXISTS (SELECT 1 FROM public.staff_allowlist WHERE email = v_email) THEN
    v_allowed := true;
  ELSIF v_email LIKE '%@laurellodging.com' THEN
    INSERT INTO public.staff_allowlist (email) VALUES (v_email) ON CONFLICT (email) DO NOTHING;
    v_allowed := true;
  END IF;

  IF NOT v_allowed THEN
    RETURN json_build_object('success', false, 'error', 'This email is not authorized for CRM access.');
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_email) THEN
    RETURN json_build_object('success', false, 'error', 'An account already exists for this email. Sign in instead.');
  END IF;

  v_user_id := gen_random_uuid();
  v_encrypted := crypt(p_password, gen_salt('bf'));

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id, 'authenticated', 'authenticated', v_email, v_encrypted, now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object('full_name', COALESCE(NULLIF(trim(p_full_name), ''), ''), 'role', 'staff'),
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_user_id, v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email', v_user_id::text, now(), now(), now()
  );

  RETURN json_build_object(
    'success', true,
    'user', json_build_object('id', v_user_id, 'email', v_email),
    'message', 'Account created. You can sign in now.'
  );
EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('success', false, 'error', 'An account already exists for this email. Sign in instead.');
WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', 'Unable to create account. Please try again or contact the owner.');
END;
$$;

REVOKE ALL ON FUNCTION public.register_staff_account(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_staff_account(text, text, text) TO anon, authenticated;
