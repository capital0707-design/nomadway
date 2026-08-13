import { sql } from './_db.js';
export default async function handler(req, res) {
  const { driverId } = req.query;
  const rows = await sql`SELECT * FROM bookings WHERE driver_id = ${driverId} OR driver_id IS NULL ORDER BY created_at DESC`;
  res.status(200).json(rows);
}