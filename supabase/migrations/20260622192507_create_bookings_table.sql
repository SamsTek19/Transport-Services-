CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_date TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  round_trip BOOLEAN DEFAULT FALSE,
  special_requests TEXT,
  status TEXT DEFAULT 'pending'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_bookings" ON bookings FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "select_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);