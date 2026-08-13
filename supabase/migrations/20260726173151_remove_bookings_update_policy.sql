-- Drop the overly permissive update policy on bookings.
-- The app only inserts and reads bookings; no update path exists.
-- With no policy, RLS blocks all updates (default deny).
DROP POLICY IF EXISTS update_bookings ON bookings;
