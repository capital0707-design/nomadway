import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { role, phone, password } = req.body || {};

  if (!phone || !password) {
    return res.status(400).json({ error: 'Введите телефон и пароль' });
  }

  const all = role === 'driver'
    ? await sql`SELECT id, full_name, phone, status, password FROM driver_applications`
    : await sql`SELECT id, full_name, phone, status, password FROM guide_applications`;

  // Сравниваем телефоны по цифрам, чтобы формат не имел значения
  const digits = String(phone).replace(/\D/g, '');
  const user = all.find(r => r.phone && r.phone.replace(/\D/g, '') === digits);

  if (!user) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }
  if (user.status !== 'approved') {
    return res.status(403).json({ error: 'Ваша анкета ещё не одобрена' });
  }
  if (!user.password) {
    return res.status(403).json({ error: 'Пароль ещё не установлен. Обратитесь к администратору.' });
  }
  if (user.password !== password) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  res.status(200).json({ id: user.id, name: user.full_name, phone: user.phone });
}