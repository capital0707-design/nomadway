export type VehicleCategory = 'sedan' | 'minivan' | 'suv' | 'minibus';
export type GuideLanguage = 'english' | 'german' | 'japanese' | 'chinese' | 'korean';

export interface Location {
  id: string;
  name_ru: string;
  name_en: string;
  region: string | null;
  is_airport: boolean;
  is_mountain: boolean;
  sort_order: number;
}

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  capacity: number;
  image_url: string | null;
  price_per_km: number;
  description_ru: string | null;
  driver_name: string;
  driver_rating: number;
  driver_trips: number;
  features: string[];
  recommended_for: string[];
  is_available: boolean;
}

export interface Guide {
  id: string;
  name: string;
  languages: GuideLanguage[];
  photo_url: string | null;
  rating: number;
  trips: number;
  bio_ru: string | null;
  price_per_hour: number;
  is_available: boolean;
}

export interface Booking {
  id: string;
  user_email: string | null;
  user_phone: string | null;
  user_name: string | null;
  from_location_id: string;
  to_location_id: string;
  vehicle_id: string;
  guide_id: string | null;
  tourist_count: number;
  pickup_date: string;
  pickup_time: string;
  total_price: number;
  guide_price: number;
  status: string;
  created_at: string;
}

export interface SearchParams {
  fromLocation: string;
  toLocation: string;
  touristCount: number;
  pickupDate: string;
  pickupTime: string;
  vehicleCategory: VehicleCategory | '';
  guideLanguage: GuideLanguage | '';
}

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, string> = {
  sedan: 'Легковые',
  minivan: 'Минивэны',
  suv: 'Джипы',
  minibus: 'Микроавтобусы',
};

export const GUIDE_LANGUAGE_LABELS: Record<GuideLanguage, string> = {
  english: 'Английский',
  german: 'Немецкий',
  japanese: 'Японский',
  chinese: 'Китайский',
  korean: 'Корейский',
};

export const DISTANCES: Record<string, Record<string, number>> = {
  'Manas Airport': { Bishkek: 30, CholponAta: 260, Karakol: 380, Osh: 600, Tokmok: 60, Balykchy: 200, Naryn: 350, Aral: 250, JalalAbad: 550, Talas: 200, Batken: 700 },
  Bishkek: { 'Manas Airport': 30, CholponAta: 250, Karakol: 370, Osh: 580, Tokmok: 55, Balykchy: 190, Naryn: 340, Aral: 240, JalalAbad: 530, Talas: 190, Batken: 680, AlaArcha: 40, Burana: 80 },
  Osh: { 'Manas Airport': 600, Bishkek: 580, Karakol: 650, JalalAbad: 100, Batken: 200, Naryn: 400, 'Osh Airport': 10 },
  Karakol: { Bishkek: 370, CholponAta: 130, 'Manas Airport': 380, Balykchy: 120, Aral: 80 },
  'Cholpon-Ata': { Bishkek: 250, Karakol: 130, 'Manas Airport': 260, Balykchy: 60, Aral: 20 },
  'Osh Airport': { Osh: 10 },
};

function getDistance(from: string, to: string): number {
  const lookup = DISTANCES[from]?.[to] ?? DISTANCES[to]?.[from];
  return lookup ?? 100;
}

export function estimateDistance(fromEn: string, toEn: string): number {
  const from = fromEn.replace(/[\s-]/g, '');
  const to = toEn.replace(/[\s-]/g, '');
  for (const key of Object.keys(DISTANCES)) {
    const keyNorm = key.replace(/[\s-]/g, '');
    if (from.includes(keyNorm) || keyNorm.includes(from)) {
      for (const innerKey of Object.keys(DISTANCES[key])) {
        const innerNorm = innerKey.replace(/[\s-]/g, '');
        if (to.includes(innerNorm) || innerNorm.includes(to)) {
          return DISTANCES[key][innerKey];
        }
      }
    }
  }
  return 100;
}

export function calculatePrice(vehicle: Vehicle, distanceKm: number, guide: Guide | null, hours: number = 4): number {
  const vehiclePrice = vehicle.price_per_km * distanceKm;
  const guidePrice = guide ? guide.price_per_hour * hours : 0;
  return vehiclePrice + guidePrice;
}

export { getDistance };

// Route analysis helpers
export function isMountainRoute(from: Location | undefined, to: Location | undefined): boolean {
  return from?.is_mountain === true || to?.is_mountain === true;
}

export function isGroupRoute(touristCount: number): boolean {
  return touristCount >= 5;
}

export function isAirportRoute(from: Location | undefined, to: Location | undefined): boolean {
  return from?.is_airport === true || to?.is_airport === true;
}

export function getVehicleRecommendation(vehicle: Vehicle, from: Location | undefined, to: Location | undefined, touristCount: number): { isRecommended: boolean; reason: string } | null {
  const mountain = isMountainRoute(from, to);
  const group = isGroupRoute(touristCount);
  const airport = isAirportRoute(from, to);

  // Capacity check
  if (vehicle.capacity < touristCount) {
    return null;
  }

  // Mountain routes - recommend SUVs
  if (mountain && vehicle.recommended_for?.includes('mountain')) {
    return { isRecommended: true, reason: 'Рекомендуется для горных маршрутов' };
  }

  // Groups - recommend minibus
  if (group && vehicle.recommended_for?.includes('group')) {
    return { isRecommended: true, reason: 'Оптимально для группы' };
  }

  // Airport transfers - sedans are economical choice
  if (airport && vehicle.recommended_for?.includes('city') && vehicle.capacity >= touristCount) {
    return { isRecommended: true, reason: 'Экономно для трансфера в аэропорт' };
  }

  // Perfect capacity match
  if (vehicle.capacity === touristCount || (vehicle.capacity >= touristCount && vehicle.capacity <= touristCount + 2)) {
    return { isRecommended: true, reason: 'Идеально по вместимости' };
  }

  return null;
}
