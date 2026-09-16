-- Fix validation for databases where the secure booking migration is already applied.
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
