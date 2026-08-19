import { sql } from './_db.js';

export default async function handler(req, res) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const bookings = await sql`
    SELECT b.*, f.name_ru AS from_name, t.name_ru AS to_name, v.name AS vehicle_name, g.name AS guide_name
    FROM bookings b
    JOIN locations f ON f.id = b.from_location_id
    JOIN locations t ON t.id = b.to_location_id
    JOIN vehicles v ON v.id = b.vehicle_id
    LEFT JOIN guides g ON g.id = b.guide_id
    ORDER BY b.created_at DESC`;

  const drivers = await sql`SELECT * FROM driver_applications ORDER BY created_at DESC`;
  const guides = await sql`SELECT * FROM guide_applications ORDER BY created_at DESC`;

  res.status(200).json({ bookings, drivers, guides });
}