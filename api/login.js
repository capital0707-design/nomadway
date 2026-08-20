import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { role, phone, password } = req.body || {};

  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password required' });
  }

  const table = role === 'driver' ? 'driver_applications' : 'guide_applications';
  const row = await sql.unsafe(
    `SELECT id, full_name, phone, status, password FROM ${table} WHERE phone = $1 LIMIT 1`,
    [phone]
  );

  if (!row.length) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }

  const user = row[0];

  if (user.status !== 'approved') {
    return res.status(403).json({ error: 'Ваша анкета ещё не одобрена' });
  }

  if (!user.password) {
    return res.status(403).json({ error: 'Пароль ещё не установлен. Обратитесь к администратору.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  res.status(200).json({
    id: user.id,
    name: user.full_name,
    phone: user.phone,
  });
}