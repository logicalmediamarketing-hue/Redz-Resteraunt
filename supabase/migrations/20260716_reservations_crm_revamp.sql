-- CRM / reservations revamp: source tracking, soft-delete, public availability RPC
-- Applied to LaurelDev project dbzvxncnkgqgfjqcbyai

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz NULL;

ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS reservations_source_check;

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_source_check
  CHECK (source IN ('website', 'henry', 'admin', 'phone', 'other'));

CREATE INDEX IF NOT EXISTS reservations_date_time_active_idx
  ON public.reservations (date, time)
  WHERE deleted_at IS NULL AND status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS reservations_status_date_idx
  ON public.reservations (status, date)
  WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.day_reservation_covers(p_date date)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
  FROM (
    SELECT
      time AS slot_time,
      SUM(party_size)::integer AS covers
    FROM public.reservations
    WHERE date = p_date
      AND status IN ('pending', 'confirmed')
      AND deleted_at IS NULL
      AND name NOT LIKE 'DELETED_%'
    GROUP BY time
  ) t;
$$;

REVOKE ALL ON FUNCTION public.day_reservation_covers(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.day_reservation_covers(date) TO anon, authenticated;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
