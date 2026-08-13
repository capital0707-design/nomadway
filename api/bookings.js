import { sql } from './_db.js';

export default async function handler(req, res) {
  // Чтение по ID
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID required' });
    const [booking] = await sql`SELECT * FROM bookings WHERE id = ${id}`;
    return res.status(200).json(booking || null);
  }
  
  // Создание новой заявки
  if (req.method === 'POST') {
    const b = req.body;
    const [newBooking] = await sql`
      INSERT INTO bookings (
        user_email, user_phone, user_name, 
        from_location_id, to_location_id, vehicle_id, guide_id,
        tourist_count, pickup_date, pickup_time, total_price, guide_price, status
      ) VALUES (
        ${b.user_email || null}, ${b.user_phone || null}, ${b.user_name},
        ${b.from_location_id}, ${b.to_location_id}, ${b.vehicle_id}, ${b.guide_id || null},
        ${b.tourist_count}, ${b.pickup_date}, ${b.pickup_time}, ${b.total_price}, ${b.guide_price || 0}, 'confirmed'
      ) RETURNING *
    `;
    return res.status(201).json(newBooking);
  }
  
  res.status(405).end();
}