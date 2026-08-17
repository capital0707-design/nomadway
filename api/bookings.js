import { sql } from './_db.js';

export default async function handler(req, res) {
  // Чтение брони по ID
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID required' });
    const [booking] = await sql`SELECT * FROM bookings WHERE id = ${id}`;
    return res.status(200).json(booking || null);
  }

  // Создание новой брони
  if (req.method === 'POST') {
    const b = req.body;
    const [newBooking] = await sql`
      INSERT INTO bookings (
        user_email, user_phone, user_name, 
        from_location_id, to_location_id, vehicle_id, guide_id,
        tourist_count, pickup_date, pickup_time, total_price, guide_price, status
      ) VALUES (
        ${b.user_email || null}, ${b.user_phone || null}, ${b.user_name},
        ${b.from_location_id}, ${b.to_location_id}, ${b.vehicle_id}, ${b.guide_id || null},
        ${b.tourist_count}, ${b.pickup_date}, ${b.pickup_time}, ${b.total_price}, ${b.guide_price || 0}, 'confirmed'
      ) RETURNING *
    `;

    // Шлём уведомление в Telegram (если упадёт — бронь всё равно сохранится)
    try {
      await sendTelegramNotification(newBooking);
    } catch (err) {
      console.error('Telegram notification failed:', err);
    }

    return res.status(201).json(newBooking);
  }

  res.status(405).end();
}

async function sendTelegramNotification(booking) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const [fromLoc] = await sql`SELECT name_ru, name_en FROM locations WHERE id = ${booking.from_location_id}`;
  const [toLoc] = await sql`SELECT name_ru, name_en FROM locations WHERE id = ${booking.to_location_id}`;
  const [vehicle] = await sql`SELECT name FROM vehicles WHERE id = ${booking.vehicle_id}`;
  const [guide] = booking.guide_id
    ? await sql`SELECT name FROM guides WHERE id = ${booking.guide_id}`
    : [null];

  const time = String(booking.pickup_time).slice(0, 5);

  const text = [
    '🚖 НОВАЯ БРОНЬ!',
    `📋 Номер: ${booking.id.slice(0, 8)}`,
    `👤 Имя: ${booking.user_name || '—'}`,
    `📞 Телефон: ${booking.user_phone || '—'}`,
    `📧 Email: ${booking.user_email || '—'}`,
    `🗺 Маршрут: ${fromLoc?.name_ru || '?'} → ${toLoc?.name_ru || '?'}`,
    `📅 Дата: ${booking.pickup_date} ⏰ ${time}`,
    `👥 Туристов: ${booking.tourist_count}`,
    `🚗 Авто: ${vehicle?.name || '?'}${guide ? `\n🧭 Гид: ${guide.name}` : '\n🧭 Гид: без гида'}`,
    `💰 Сумма: ${booking.total_price} сом`,
  ].join('\n');

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}