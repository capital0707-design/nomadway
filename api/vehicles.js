import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { category } = req.query;

  const rows = category
    ? await sql`SELECT id, name, category, capacity, image_url, price_per_km, description_ru, driver_name, driver_rating::float AS driver_rating, driver_trips, features, is_available, recommended_for FROM vehicles WHERE is_available = true AND category = ${category} ORDER BY price_per_km`
    : await sql`SELECT id, name, category, capacity, image_url, price_per_km, description_ru, driver_name, driver_rating::float AS driver_rating, driver_trips, features, is_available, recommended_for FROM vehicles WHERE is_available = true ORDER BY price_per_km`;

  res.status(200).json(rows);
}