import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { language } = req.query;
  
  if (language) {
    // В Postgres массивы ищутся через оператор @>
    const guides = await sql`SELECT * FROM guides WHERE is_available = true AND languages @> ARRAY[${language}]::guide_language[] ORDER BY rating DESC`;
    return res.status(200).json(guides);
  }
  
  const guides = await sql`SELECT * FROM guides WHERE is_available = true ORDER BY rating DESC`;
  res.status(200).json(guides);
}