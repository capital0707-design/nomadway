import type { Booking } from './types';

const API_BASE = '/api';

export const CURRENT_DRIVER = { id: 'test-driver-123', name: 'Азамат К.' };
export const CURRENT_GUIDE = { id: 'test-guide-456', name: 'Айгерим Т.' };

export async function fetchDriverBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/driver?action=bookings&driverId=${CURRENT_DRIVER.id}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов');
  return res.json();
}

export async function acceptBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/driver?action=accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, driverId: CURRENT_DRIVER.id, driverName: CURRENT_DRIVER.name }),
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

export async function fetchGuideBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/guide?action=bookings&guideId=${CURRENT_GUIDE.id}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов');
  return res.json();
}

export async function acceptGuideBooking(bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/guide?action=accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, guideId: CURRENT_GUIDE.id, guideName: CURRENT_GUIDE.name }),
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