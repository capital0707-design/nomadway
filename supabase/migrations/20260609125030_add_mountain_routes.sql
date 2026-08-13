-- Add is_mountain flag to locations
ALTER TABLE locations ADD COLUMN is_mountain BOOLEAN DEFAULT false;

-- Mark mountain locations
UPDATE locations SET is_mountain = true 
WHERE name_en ILIKE '%arakol%' 
   OR name_en ILIKE '%aryn%' 
   OR name_en ILIKE '%ala%archa%' 
   OR name_en ILIKE '%burana%'
   OR name_en ILIKE '%cholpon%' 
   OR name_en ILIKE '%balykchy%';

-- Add recommended_for column to vehicles
ALTER TABLE vehicles ADD COLUMN recommended_for TEXT[] DEFAULT '{}';

-- SUVs recommended for mountain routes
UPDATE vehicles SET recommended_for = array_append(recommended_for, 'mountain') WHERE category = 'suv';

-- Minibuses recommended for groups (5+ tourists)
UPDATE vehicles SET recommended_for = array_append(recommended_for, 'group') WHERE category = 'minibus' AND capacity >= 5;

-- Sedans recommended for city/airport transfers
UPDATE vehicles SET recommended_for = array_append(recommended_for, 'city') WHERE category = 'sedan';