-- Таблица заявок водителей
CREATE TABLE driver_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  vehicle_name TEXT NOT NULL,
  vehicle_category vehicle_category NOT NULL,
  vehicle_year INT,
  vehicle_capacity INT NOT NULL,
  license_number TEXT,
  experience_years INT DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  about TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица заявок гидов-переводчиков
CREATE TABLE guide_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  languages guide_language[] NOT NULL,
  experience_years INT DEFAULT 0,
  specialization TEXT,
  about TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_applications ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone can submit application)
CREATE POLICY "insert_driver_applications" ON driver_applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "insert_guide_applications" ON guide_applications FOR INSERT TO anon WITH CHECK (true);

-- No read access for anon (admin only via service role)
