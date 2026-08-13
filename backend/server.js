const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 1. Получить заказы для водителя (новые + его собственные)
app.get('/api/driver-bookings', async (req, res) => {
  try {
    const { driverId } = req.query;
    const result = await pool.query(
      `SELECT * FROM bookings 
       WHERE driver_id = $1 OR driver_id IS NULL 
       ORDER BY pickup_date ASC`,
      [driverId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// 2. Принять заказ
app.post('/api/accept-booking', async (req, res) => {
  const { bookingId, driverId, driverName } = req.body;
  try {
    await pool.query(
      `UPDATE bookings SET driver_id = $1, driver_name = $2, status = 'accepted' WHERE id = $3`,
      [driverId, driverName, bookingId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// 3. Завершить заказ
app.post('/api/complete-booking', async (req, res) => {
  const { bookingId } = req.body;
  try {
    await pool.query(
      `UPDATE bookings SET status = 'completed' WHERE id = $1`,
      [bookingId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 3001;
// Получить заказы для гида (новые + его собственные)
app.get('/api/guide-bookings', async (req, res) => {
  try {
    const { guideId } = req.query;
    const result = await pool.query(
      `SELECT * FROM bookings 
       WHERE guide_id = $1 OR (guide_id IS NULL AND status != 'completed')
       ORDER BY pickup_date ASC`,
      [guideId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Гид принимает заказ
app.post('/api/accept-guide-booking', async (req, res) => {
  const { bookingId, guideId, guideName } = req.body;
  try {
    await pool.query(
      `UPDATE bookings SET guide_id = $1, guide_name = $2, status = 'accepted' WHERE id = $3`,
      [guideId, guideName, bookingId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Гид завершает заказ
app.post('/api/complete-guide-booking', async (req, res) => {
  const { bookingId } = req.body;
  try {
    await pool.query(
      `UPDATE bookings SET status = 'completed' WHERE id = $1`,
      [bookingId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend сервер запущен на http://localhost:${PORT}`);
});