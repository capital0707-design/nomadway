import { Location, Vehicle, Guide, Booking, DriverApplicationInput, GuideApplicationInput } from './types';

const API_BASE = '/api';

// ========== ПУБЛИЧНОЕ API (Поиск туров) ==========

export async function fetchLocations(): Promise<Location[]> {
  const res = await fetch(`${API_BASE}/locations`);
  if (!res.ok) throw new Error('Ошибка загрузки локаций');
  return res.json();
}

export async function fetchVehicles(category?: string): Promise<Vehicle[]> {
  const url = category ? `${API_BASE}/vehicles?category=${category}` : `${API_BASE}/vehicles`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ошибка загрузки авто');
  return res.json();
}

export async function fetchGuides(language?: string): Promise<Guide[]> {
  const url = language ? `${API_BASE}/guides?language=${language}` : `${API_BASE}/guides`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ошибка загрузки гидов');
  return res.json();
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error('Ошибка создания брони');
  return res.json();
}

export async function fetchBooking(id: string): Promise<Booking | null> {
  const res = await fetch(`${API_BASE}/bookings?id=${id}`);
  if (!res.ok) throw new Error('Ошибка загрузки брони');
  return res.json();
}

export async function submitDriverApplication(app: DriverApplicationInput): Promise<void> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'driver', data: app }),
  });
  if (!res.ok) throw new Error('Ошибка отправки анкеты');
}

export async function submitGuideApplication(app: GuideApplicationInput): Promise<void> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'guide', data: app }),
  });
  if (!res.ok) throw new Error('Ошибка отправки анкеты');
}

// ========== КАБИНЕТ ВОДИТЕЛЯ / ГИДА ==========
// (Пока используем тестовые ID, позже заменим на реальную авторизацию)

const CURRENT_DRIVER = { id: 'test-driver-123', name: 'Азамат К.' };
const CURRENT_GUIDE = { id: 'test-guide-456', name: 'Айгерим Т.' };

export async function fetchDriverBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/driver-bookings?driverId=${CURRENT_DRIVER.id}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов');
  return res.json();
}

export async function acceptBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/accept-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, driverId: CURRENT_DRIVER.id, driverName: CURRENT_DRIVER.name }),
  });
  if (!res.ok) throw new Error('Ошибка принятия заказа');
}

export async function completeBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/complete-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка завершения заказа');
}

export async function fetchGuideBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/guide-bookings?guideId=${CURRENT_GUIDE.id}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов гида');
  return res.json();
}

export async function acceptGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/accept-guide-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, guideId: CURRENT_GUIDE.id, guideName: CURRENT_GUIDE.name }),
  });
  if (!res.ok) throw new Error('Ошибка принятия заказа гидом');
}

export async function completeGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/complete-guide-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка завершения заказа гидом');
}