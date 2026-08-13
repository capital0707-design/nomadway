-- Drop the overly permissive policies
DROP POLICY IF EXISTS insert_bookings ON bookings;
DROP POLICY IF EXISTS update_bookings ON bookings;
DROP POLICY IF EXISTS read_own_bookings ON bookings;
DROP POLICY IF EXISTS insert_driver_applications ON driver_applications;
DROP POLICY IF EXISTS insert_guide_applications ON guide_applications;

-- bookings: anon can insert only well-formed rows (required fields present)
CREATE POLICY insert_bookings ON bookings
  FOR INSERT TO anon
  WITH CHECK (
    user_name IS NOT NULL AND char_length(user_name) >= 2
    AND user_phone IS NOT NULL AND char_length(user_phone) >= 8
    AND from_location_id IS NOT NULL
    AND to_location_id IS NOT NULL
    AND vehicle_id IS NOT NULL
    AND tourist_count >= 1 AND tourist_count <= 50
    AND pickup_date IS NOT NULL
    AND pickup_time IS NOT NULL
    AND total_price >= 0
  );

-- bookings: anon can read all (public booking confirmation by ID)
CREATE POLICY read_bookings ON bookings
  FOR SELECT TO anon, authenticated
  USING (true);

-- bookings: only authenticated (admin) can update
CREATE POLICY update_bookings ON bookings
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- driver_applications: anon can insert only well-formed rows
CREATE POLICY insert_driver_applications ON driver_applications
  FOR INSERT TO anon
  WITH CHECK (
    full_name IS NOT NULL AND char_length(full_name) >= 3
    AND phone IS NOT NULL AND char_length(phone) >= 8
    AND vehicle_name IS NOT NULL AND char_length(vehicle_name) >= 3
    AND vehicle_category IS NOT NULL
    AND vehicle_capacity >= 1 AND vehicle_capacity <= 50
  );

-- guide_applications: anon can insert only well-formed rows
CREATE POLICY insert_guide_applications ON guide_applications
  FOR INSERT TO anon
  WITH CHECK (
    full_name IS NOT NULL AND char_length(full_name) >= 3
    AND phone IS NOT NULL AND char_length(phone) >= 8
    AND languages IS NOT NULL AND array_length(languages, 1) >= 1
  );

-- Applications: only authenticated (admin) can read
CREATE POLICY read_driver_applications ON driver_applications
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY read_guide_applications ON guide_applications
  FOR SELECT TO authenticated
  USING (true);
