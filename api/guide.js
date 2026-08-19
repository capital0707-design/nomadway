import { sql } from './_db.js';

export default async function handler(req, res) {
  const { action } = req.query;

  if (req.method === 'GET' && action === 'bookings') {
    const { guideId } = req.query;
    const rows = await sql`SELECT * FROM bookings WHERE guide_id::text = ${guideId} OR (guide_id IS NOT NULL AND status = 'confirmed') ORDER BY created_at DESC`;
    return res.status(200).json(rows);
  }

  if (req.method === 'POST' && action === 'accept') {
    const { bookingId } = req.body;
    const [row] = await sql`UPDATE bookings SET guide_status = 'accepted' WHERE id = ${bookingId} RETURNING *`;
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    return res.status(200).json(row);
  }

  if (req.method === 'POST' && action === 'complete') {
    const { bookingId } = req.body;
    const [row] = await sql`UPDATE bookings SET guide_status = 'completed' WHERE id = ${bookingId} RETURNING *`;
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    return res.status(200).json(row);
  }

  res.status(400).json({ error: 'Invalid action' });
}