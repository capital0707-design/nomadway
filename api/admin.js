import { sql } from './_db.js';

export default async function handler(req, res) {
  const { action } = req.query;

  // Вход
  if (req.method === 'POST' && action === 'login') {
    const { password } = req.body || {};
    const admin = process.env.ADMIN_PASSWORD;
    if (!admin) return res.status(500).json({ error: 'ADMIN_PASSWORD not set' });
    if (password === admin) return res.status(200).json({ ok: true });
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Всё остальное — только по паролю
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Данные
  if (req.method === 'GET' && action === 'data') {
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
    return res.status(200).json({ bookings, drivers, guides });
  }

  // Смена статусов
  if (req.method === 'POST' && action === 'update') {
    const { type, id, status } = req.body;
    if (type === 'booking') {
      await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
    } else if (type === 'driver') {
      await sql`UPDATE driver_applications SET status = ${status} WHERE id = ${id}`;
    } else if (type === 'guide') {
      await sql`UPDATE guide_applications SET status = ${status} WHERE id = ${id}`;
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    return res.status(200).json({ ok: true });
  }

  res.status(400).json({ error: 'Invalid action' });
}