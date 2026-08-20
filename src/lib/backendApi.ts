import type { Booking } from './types';

const API_BASE = '/api';

// Получить текущего пользователя из localStorage
function getCurrentUser(): { id: string; name: string; phone: string } | null {
  try {
    const raw = localStorage.getItem('driver_user');
    if (raw) return JSON.parse(raw);
    const rawG = localStorage.getItem('guide_user');
    if (rawG) return JSON.parse(rawG);
  } catch {}
  return null;
}

export function getCurrentRole(): 'driver' | 'guide' | null {
  if (localStorage.getItem('driver_user')) return 'driver';
  if (localStorage.getItem('guide_user')) return 'guide';
  return null;
}

export async function login(role: 'driver' | 'guide', phone: string, password: string): Promise<{ id: string; name: string; phone: string }> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, phone, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка входа');
  localStorage.setItem(`${role}_user`, JSON.stringify(data));
  return data;
}

export function logout(role: 'driver' | 'guide') {
  localStorage.removeItem(`${role}_user`);
}

// ===== Кабинет водителя =====
export async function fetchDriverBookings(): Promise<Booking[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const res = await fetch(`${API_BASE}/driver?action=bookings&driverId=${user.id}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов');
  return res.json();
}

export async function acceptBooking(bookingId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const res = await fetch(`${API_BASE}/driver?action=accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, driverId: user.id, driverName: user.name }),
  });
  if (!res.ok) throw new Error('Ошибка принятия заказа');
}

export async function completeBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/driver?action=complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка завершения заказа');
}

// ===== Кабинет гида =====
export async function fetchGuideBookings(): Promise<Booking[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  const res = await fetch(`${API_BASE}/guide?action=bookings&guideId=${user.id}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов');
  return res.json();
}

export async function acceptGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/guide?action=accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка принятия заказа');
}

export async function completeGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/guide?action=complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  });
  if (!res.ok) throw new Error('Ошибка завершения заказа');
}

export async function setStaffPassword(type: 'driver' | 'guide', id: string, password: string, secret: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin?action=set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify({ type, id, password }),
  });
  if (!res.ok) throw new Error('Ошибка установки пароля');
}