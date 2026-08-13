import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { type, data } = req.body;
  
  try {
    if (type === 'driver') {
      await sql`
        INSERT INTO driver_applications (
          full_name, phone, email, vehicle_name, vehicle_category, 
          vehicle_year, vehicle_capacity, license_number, experience_years, languages, about
        ) VALUES (
          ${data.full_name}, ${data.phone}, ${data.email || null}, ${data.vehicle_name}, ${data.vehicle_category},
          ${data.vehicle_year || null}, ${data.vehicle_capacity}, ${data.license_number || null}, ${data.experience_years || 0}, ${data.languages || []}, ${data.about || null}
        )
      `;
      return res.status(201).json({ success: true });
    }
    
    if (type === 'guide') {
      await sql`
        INSERT INTO guide_applications (
          full_name, phone, email, languages, experience_years, specialization, about
        ) VALUES (
          ${data.full_name}, ${data.phone}, ${data.email || null}, ${data.languages}, ${data.experience_years || 0}, ${data.specialization || null}, ${data.about || null}
        )
      `;
      return res.status(201).json({ success: true });
    }
    
    res.status(400).json({ error: 'Invalid application type' });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Database error' });
  }
}