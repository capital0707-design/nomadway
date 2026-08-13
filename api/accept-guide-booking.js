import { sql } from './_db.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { bookingId } = req.body;
  const [row] = await sql`UPDATE bookings SET guide_status = 'accepted' WHERE id = ${bookingId} RETURNING *`;
  if (!row) return res.status(404).json({ error: 'Booking not found' });
  res.status(200).json(row);
}