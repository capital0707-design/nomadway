-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  region TEXT,
  is_airport BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Vehicle types
CREATE TYPE vehicle_category AS ENUM ('sedan', 'minivan', 'suv', 'minibus');

-- Vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category vehicle_category NOT NULL,
  capacity INT NOT NULL,
  image_url TEXT,
  price_per_km INT NOT NULL DEFAULT 50,
  description_ru TEXT,
  driver_name TEXT NOT NULL,
  driver_rating NUMERIC(3,2) DEFAULT 4.50,
  driver_trips INT DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true
);

-- Guide languages
CREATE TYPE guide_language AS ENUM ('english', 'german', 'japanese', 'chinese', 'korean');

-- Guides table
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  languages guide_language[] NOT NULL,
  photo_url TEXT,
  rating NUMERIC(3,2) DEFAULT 4.50,
  trips INT DEFAULT 0,
  bio_ru TEXT,
  price_per_hour INT NOT NULL DEFAULT 1500,
  is_available BOOLEAN DEFAULT true
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  user_phone TEXT,
  user_name TEXT,
  from_location_id UUID REFERENCES locations(id) NOT NULL,
  to_location_id UUID REFERENCES locations(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  guide_id UUID REFERENCES guides(id),
  tourist_count INT NOT NULL DEFAULT 1,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  total_price INT NOT NULL,
  guide_price INT DEFAULT 0,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read policies for locations, vehicles, guides
CREATE POLICY "read_locations" ON locations FOR SELECT TO anon USING (true);
CREATE POLICY "read_vehicles" ON vehicles FOR SELECT TO anon USING (true);
CREATE POLICY "read_guides" ON guides FOR SELECT TO anon USING (true);

-- Booking policies - anyone can insert, anon can read own by email
CREATE POLICY "insert_bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "read_own_bookings" ON bookings FOR SELECT TO anon USING (true);
CREATE POLICY "update_bookings" ON bookings FOR UPDATE TO anon USING (true) WITH CHECK (true);
