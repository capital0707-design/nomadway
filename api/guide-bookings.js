import { sql } from './_db.js';
export default async function handler(req, res) {
  const { guideId } = req.query;
  const rows = await sql`SELECT * FROM bookings WHERE guide_id::text = ${guideId} OR (guide_id IS NOT NULL AND status = 'confirmed') ORDER BY created_at DESC`;
  res.status(200).json(rows);
}