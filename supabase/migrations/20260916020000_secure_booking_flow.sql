-- Secure booking workflow and server-side availability protection.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_reference TEXT;

UPDATE bookings
SET booking_reference = 'AOH-' || UPPER(SUBSTRING(REPLACE(id::TEXT, '-', '') FROM 1 FOR 10))
WHERE booking_reference IS NULL;

ALTER TABLE bookings
  ALTER COLUMN booking_reference SET DEFAULT ('AOH-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 10))),
  ALTER COLUMN booking_reference SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_reference_key ON bookings (booking_reference);

UPDATE bookings
SET status = 'pending'
WHERE status IS NULL;

ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_status_valid,
  ADD CONSTRAINT bookings_status_valid CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

-- Keep the earliest request for an already-duplicated slot and release later duplicates.
WITH ranked_active_bookings AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY pickup_date, pickup_time
      ORDER BY created_at ASC NULLS LAST, id ASC
    ) AS slot_rank
  FROM bookings
  WHERE status <> 'cancelled'
)
UPDATE bookings
SET status = 'cancelled'
FROM ranked_active_bookings
WHERE bookings.id = ranked_active_bookings.id
  AND ranked_active_bookings.slot_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_active_slot_key
  ON bookings (pickup_date, pickup_time)
  WHERE status <> 'cancelled';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "select_bookings" ON bookings;
DROP POLICY IF EXISTS "update_bookings" ON bookings;
DROP POLICY IF EXISTS "delete_bookings" ON bookings;
DROP POLICY IF EXISTS "insert_bookings" ON bookings;

CREATE POLICY "select_bookings_admin_only" ON bookings
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "update_bookings_admin_only" ON bookings
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "delete_bookings_admin_only" ON bookings
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.create_booking(booking_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_booking bookings;
  requested_payment_method TEXT := COALESCE(booking_data->>'payment_method', 'card');
BEGIN
  IF NULLIF(TRIM(booking_data->>'name'), '') IS NULL
    OR NULLIF(TRIM(booking_data->>'phone'), '') IS NULL
    OR NULLIF(TRIM(booking_data->>'pickup_address'), '') IS NULL
    OR NULLIF(TRIM(booking_data->>'dropoff_address'), '') IS NULL
    OR NULLIF(booking_data->>'pickup_date', '') IS NULL
    OR NULLIF(booking_data->>'pickup_time', '') IS NULL THEN
    RAISE EXCEPTION 'Please complete all required booking fields.' USING ERRCODE = '22023';
  END IF;

  IF booking_data->>'pickup_date' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    OR booking_data->>'pickup_time' !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' THEN
    RAISE EXCEPTION 'Please provide a valid pickup date and time.' USING ERRCODE = '22023';
  END IF;

  IF requested_payment_method NOT IN ('card', 'cash') THEN
    RAISE EXCEPTION 'Invalid payment method.' USING ERRCODE = '22023';
  END IF;

  INSERT INTO bookings (
    name, email, phone, pickup_address, dropoff_address, pickup_date, pickup_time,
    passengers, wheelchair_accessible, round_trip, distance_miles, waiting_minutes,
    payment_method, payment_status, special_requests, status
  ) VALUES (
    TRIM(booking_data->>'name'), NULLIF(TRIM(booking_data->>'email'), ''), TRIM(booking_data->>'phone'),
    TRIM(booking_data->>'pickup_address'), TRIM(booking_data->>'dropoff_address'),
    booking_data->>'pickup_date', booking_data->>'pickup_time',
    GREATEST(1, LEAST(6, COALESCE((booking_data->>'passengers')::INTEGER, 1))),
    COALESCE((booking_data->>'wheelchair_accessible')::BOOLEAN, false),
    COALESCE((booking_data->>'round_trip')::BOOLEAN, false),
    GREATEST(0, COALESCE((booking_data->>'distance_miles')::NUMERIC, 0)),
    GREATEST(0, COALESCE((booking_data->>'waiting_minutes')::INTEGER, 0)),
    requested_payment_method, 'pending', NULLIF(TRIM(booking_data->>'special_requests'), ''), 'pending'
  )
  RETURNING * INTO created_booking;

  RETURN jsonb_build_object(
    'id', created_booking.id,
    'booking_reference', created_booking.booking_reference,
    'fare_amount', created_booking.fare_amount,
    'status', created_booking.status,
    'payment_status', created_booking.payment_status
  );
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'This date and time has already been booked. Please select another time.' USING ERRCODE = '23P01';
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking(JSONB) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_booked_slots(requested_date TEXT)
RETURNS TABLE (pickup_time TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.pickup_time
  FROM public.bookings b
  WHERE b.pickup_date = requested_date AND b.status <> 'cancelled'
  ORDER BY b.pickup_time;
$$;

REVOKE ALL ON FUNCTION public.get_booked_slots(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_payment_booking(requested_reference TEXT, requested_phone TEXT)
RETURNS TABLE (
  id UUID,
  booking_reference TEXT,
  name TEXT,
  pickup_date TEXT,
  pickup_time TEXT,
  fare_amount NUMERIC,
  payment_method TEXT,
  payment_status TEXT,
  status TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.id, b.booking_reference, b.name, b.pickup_date, b.pickup_time,
    b.fare_amount, b.payment_method, b.payment_status, b.status
  FROM public.bookings b
  WHERE UPPER(b.booking_reference) = UPPER(TRIM(requested_reference))
    AND b.phone = TRIM(requested_phone)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_payment_booking(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_payment_booking(TEXT, TEXT) TO anon, authenticated;
