import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { language } = req.query;

  const rows = language
    ? await sql`SELECT id, name, languages::text[] AS languages, photo_url, rating::float AS rating, trips, bio_ru, price_per_hour, is_available FROM guides WHERE is_available = true AND languages @> ARRAY[${language}]::guide_language[] ORDER BY rating DESC`
    : await sql`SELECT id, name, languages::text[] AS languages, photo_url, rating::float AS rating, trips, bio_ru, price_per_hour, is_available FROM guides WHERE is_available = true ORDER BY rating DESC`;

  res.status(200).json(rows);
}