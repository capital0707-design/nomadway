import type { Booking } from './types';

const API_URL = 'http://localhost:3001/api';

// Тестовый водитель (позже заменим на данные из авторизации)
const CURRENT_DRIVER = {
  id: 'test-driver-123',
  name: 'Азамат К.'
};

// Тестовый гид (позже заменим на данные из авторизации)
const CURRENT_GUIDE = {
  id: 'test-guide-456',
  name: 'Айгерим Т.'
};

// ========== ФУНКЦИИ ДЛЯ ВОДИТЕЛЕЙ ==========

// Получить заказы для водителя (новые + его собственные)
export async function fetchDriverBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/driver-bookings?driverId=${CURRENT_DRIVER.id}`);
  if (!res.ok) throw new Error('Ошибка сети при загрузке заказов');
  return await res.json();
}

// Водитель принимает заказ
export async function acceptBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_URL}/accept-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      bookingId, 
      driverId: CURRENT_DRIVER.id, 
      driverName: CURRENT_DRIVER.name 
    }),
  });
  if (!res.ok) throw new Error('Ошибка сети при принятии заказа');
}

// Водитель завершает заказ
export async function completeBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_URL}/complete-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка сети при завершении заказа');
}

// ========== ФУНКЦИИ ДЛЯ ГИДОВ ==========

// Получить заказы для гида
export async function fetchGuideBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/guide-bookings?guideId=${CURRENT_GUIDE.id}`);
  if (!res.ok) throw new Error('Ошибка сети при загрузке заказов');
  return await res.json();
}

// Гид принимает заказ
export async function acceptGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_URL}/accept-guide-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      bookingId, 
      guideId: CURRENT_GUIDE.id, 
      guideName: CURRENT_GUIDE.name 
    }),
  });
  if (!res.ok) throw new Error('Ошибка сети при принятии заказа');
}

// Гид завершает заказ
export async function completeGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_URL}/complete-guide-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка сети при завершении заказа');
}