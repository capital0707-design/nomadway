import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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

  res.status(200).json({ ok: true });
}