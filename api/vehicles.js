import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { category } = req.query;
  
  if (category) {
    const vehicles = await sql`SELECT * FROM vehicles WHERE is_available = true AND category = ${category} ORDER BY price_per_km`;
    return res.status(200).json(vehicles);
  }
  
  const vehicles = await sql`SELECT * FROM vehicles WHERE is_available = true ORDER BY price_per_km`;
  res.status(200).json(vehicles);
}