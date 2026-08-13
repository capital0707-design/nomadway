import { Star, Users, Wifi, Wind, Baby, Luggage, Plug, MapPin, ThumbsUp } from 'lucide-react';
import { Vehicle, VehicleCategory } from '../lib/types';
import { useTranslation, useLang } from '../lib/i18n';

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="w-3 h-3" />,
  'Кондиционер': <Wind className="w-3 h-3" />,
  'AC': <Wind className="w-3 h-3" />,
  'Детское кресло': <Baby className="w-3 h-3" />,
  'Child seat': <Baby className="w-3 h-3" />,
  'Большой багажник': <Luggage className="w-3 h-3" />,
  'Large trunk': <Luggage className="w-3 h-3" />,
  'USB-зарядка': <Plug className="w-3 h-3" />,
  'USB charging': <Plug className="w-3 h-3" />,
  '4WD': <MapPin className="w-3 h-3" />,
};

const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, { ru: string; en: string }> = {
  sedan: { ru: 'Легковые', en: 'Sedans' },
  minivan: { ru: 'Минивэны', en: 'Minivans' },
  suv: { ru: 'Джипы', en: 'SUVs' },
  minibus: { ru: 'Микроавтобусы', en: 'Minibuses' },
};

interface Props {
  vehicle: Vehicle;
  distance: number;
  selected: boolean;
  onSelect: () => void;
  recommendation?: { isRecommended: boolean; reason: string } | null;
  insufficientCapacity?: boolean;
}

function VehicleCard({ vehicle, distance, selected, onSelect, recommendation, insufficientCapacity }: Props) {
  const totalPrice = vehicle.price_per_km * distance;
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <div
      onClick={insufficientCapacity ? undefined : onSelect}
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        insufficientCapacity
          ? 'border-gray-200 opacity-50 cursor-not-allowed'
          : selected
            ? 'border-primary-400 shadow-lg shadow-primary-100 ring-1 ring-primary-200 cursor-pointer'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer'
      }`}
    >
      {selected && !insufficientCapacity && (
        <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10">
          {t('vehicleSelect.selected')}
        </div>
      )}

      {recommendation?.isRecommended && !selected && !insufficientCapacity && (
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg z-10 flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          {t('vehicleSelect.recommended')}
        </div>
      )}

      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-56 h-40 sm:h-auto bg-gray-100 overflow-hidden flex-shrink-0 relative">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                insufficientCapacity ? '' : 'group-hover:scale-105'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <MapPin className="w-10 h-10" />
            </div>
          )}
          {insufficientCapacity && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">{t('vehicleSelect.insufficientCapacity')}</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md mb-1.5">
                {VEHICLE_CATEGORY_LABELS[vehicle.category as VehicleCategory][lang]}
              </span>
              <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
              {recommendation?.isRecommended && !insufficientCapacity && (
                <p className="text-xs text-accent-600 font-medium mt-0.5">{recommendation.reason}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">{totalPrice.toLocaleString()} {t('details.currency')}</div>
              <div className="text-xs text-gray-400">{vehicle.price_per_km} {t('details.currency')}/{t('results.distance')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warm-400 fill-warm-400" />
              <span className="text-sm font-semibold text-gray-800">{vehicle.driver_rating}</span>
            </div>
            <span className="text-sm text-gray-500">{vehicle.driver_trips} {t('vehicleSelect.trips')}</span>
            <div className={`flex items-center gap-1 text-sm ${insufficientCapacity ? 'text-red-500' : 'text-gray-500'}`}>
              <Users className="w-3.5 h-3.5" />
              {t('vehicleSelect.upTo')} {vehicle.capacity}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 text-xs font-bold">
              {vehicle.driver_name.charAt(0)}
            </div>
            <span className="text-sm text-gray-700 font-medium">{vehicle.driver_name}</span>
          </div>

          {vehicle.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {vehicle.features.map(f => (
                <span key={f} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  {FEATURE_ICONS[f] || null}
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;
