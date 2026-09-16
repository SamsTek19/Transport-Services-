ALTER TABLE bookings
  ADD COLUMN distance_miles NUMERIC(8, 2) NOT NULL DEFAULT 0,
  ADD COLUMN waiting_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN fare_amount NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
  ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'card',
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN stripe_checkout_session_id TEXT;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_distance_miles_nonnegative CHECK (distance_miles >= 0),
  ADD CONSTRAINT bookings_waiting_minutes_nonnegative CHECK (waiting_minutes >= 0),
  ADD CONSTRAINT bookings_payment_method_valid CHECK (payment_method IN ('card', 'cash')),
  ADD CONSTRAINT bookings_payment_status_valid CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'));

CREATE OR REPLACE FUNCTION calculate_booking_fare()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  billed_miles NUMERIC;
  extra_miles NUMERIC;
  waiting_blocks INTEGER;
BEGIN
  billed_miles := NEW.distance_miles * CASE WHEN NEW.round_trip THEN 2 ELSE 1 END;
  extra_miles := GREATEST(billed_miles - 4, 0);
  waiting_blocks := CEIL(NEW.waiting_minutes / 15.0);
  NEW.fare_amount := ROUND((25 + (extra_miles * 2.50) + (waiting_blocks * 10))::NUMERIC, 2);
  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_calculate_fare
BEFORE INSERT OR UPDATE OF distance_miles, waiting_minutes, round_trip ON bookings
FOR EACH ROW EXECUTE FUNCTION calculate_booking_fare();
