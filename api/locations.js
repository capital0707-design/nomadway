import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const locations = await sql`SELECT * FROM locations ORDER BY sort_order`;
  res.status(200).json(locations);
}