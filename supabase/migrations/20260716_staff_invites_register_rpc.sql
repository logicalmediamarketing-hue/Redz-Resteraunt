-- Staff invites + password signup without service_role key

CREATE TABLE IF NOT EXISTS public.staff_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT '',
  created_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  used_at timestamptz NULL,
  CONSTRAINT staff_invites_email_lower CHECK (email = lower(email))
);

CREATE INDEX IF NOT EXISTS staff_invites_email_idx ON public.staff_invites (email);

ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_staff_invites" ON public.staff_invites;
DROP POLICY IF EXISTS "auth_insert_staff_invites" ON public.staff_invites;
DROP POLICY IF EXISTS "auth_update_staff_invites" ON public.staff_invites;

CREATE POLICY "auth_select_staff_invites"
  ON public.staff_invites FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_staff_invites"
  ON public.staff_invites FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_staff_invites"
  ON public.staff_invites FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.register_staff_from_invite(
  p_email text,
  p_password text,
  p_code text,
  p_full_name text DEFAULT ''
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_email text := lower(trim(p_email));
  v_code text := trim(p_code);
  v_invite public.staff_invites%ROWTYPE;
  v_user_id uuid;
  v_encrypted text;
BEGIN
  IF v_email IS NULL OR v_email = '' OR length(p_password) < 8 OR v_code IS NULL OR v_code = '' THEN
    RETURN json_build_object('success', false, 'error', 'Email, invite code, and a password of at least 8 characters are required.');
  END IF;

  SELECT * INTO v_invite
  FROM public.staff_invites
  WHERE code = v_code
    AND email = v_email
    AND used_at IS NULL
    AND expires_at > now()
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired invite code for this email.');
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
    jsonb_build_object(
      'full_name', COALESCE(NULLIF(trim(p_full_name), ''), NULLIF(trim(v_invite.full_name), ''), ''),
      'role', 'staff'
    ),
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_user_id, v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email', v_user_id::text, now(), now(), now()
  );

  UPDATE public.staff_invites SET used_at = now() WHERE id = v_invite.id;

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

REVOKE ALL ON FUNCTION public.register_staff_from_invite(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_staff_from_invite(text, text, text, text) TO anon, authenticated;
