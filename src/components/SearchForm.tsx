import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Users, Car, Globe, Search, ChevronDown, Plane, Minus, Plus } from 'lucide-react';
import { SearchParams, VehicleCategory, GuideLanguage, Location } from '../lib/types';
import { fetchLocations } from '../lib/api';
import { useTranslation, useLang } from '../lib/i18n';

const VEHICLE_CATEGORIES: { key: VehicleCategory; labelRu: string; labelEn: string }[] = [
  { key: 'sedan', labelRu: 'Легковые', labelEn: 'Sedans' },
  { key: 'minivan', labelRu: 'Минивэны', labelEn: 'Minivans' },
  { key: 'suv', labelRu: 'Джипы', labelEn: 'SUVs' },
  { key: 'minibus', labelRu: 'Микроавтобусы', labelEn: 'Minibuses' },
];

const GUIDE_LANGUAGES: { key: GuideLanguage; labelRu: string; labelEn: string }[] = [
  { key: 'english', labelRu: 'Английский', labelEn: 'English' },
  { key: 'german', labelRu: 'Немецкий', labelEn: 'German' },
  { key: 'japanese', labelRu: 'Японский', labelEn: 'Japanese' },
  { key: 'chinese', labelRu: 'Китайский', labelEn: 'Chinese' },
  { key: 'korean', labelRu: 'Корейский', labelEn: 'Korean' },
];

interface Props {
  onSearch: (params: SearchParams) => void;
}

function SearchForm({ onSearch }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tourists, setTourists] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory | ''>('');
  const [guideLanguage, setGuideLanguage] = useState<GuideLanguage | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();
  const lang = useLang();

  useEffect(() => {
    fetchLocations().then(setLocations).catch(console.error);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const decrement = () => {
    const current = typeof tourists === 'number' ? tourists : 1;
    if (current > 1) setTourists(current - 1);
  };

  const increment = () => {
    const current = typeof tourists === 'number' ? tourists : 0;
    if (current < 50) setTourists(current + 1);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!from) e.from = lang === 'ru' ? 'Укажите пункт отправления' : 'Select departure location';
    if (!to) e.to = lang === 'ru' ? 'Укажите пункт назначения' : 'Select destination';
    if (from && to && from === to) e.to = lang === 'ru' ? 'Пункты не могут совпадать' : 'Locations must be different';
    if (!date) e.date = lang === 'ru' ? 'Укажите дату' : 'Select date';
    if (!time) e.time = lang === 'ru' ? 'Укажите время' : 'Select time';
    if (tourists !== '' && (typeof tourists !== 'number' || tourists < 1 || tourists > 50)) {
      e.tourists = lang === 'ru' ? 'От 1 до 50 человек' : 'From 1 to 50 people';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const finalTourists = tourists === '' ? 1 : tourists;
    onSearch({
      fromLocation: from,
      toLocation: to,
      touristCount: finalTourists,
      pickupDate: date,
      pickupTime: time,
      vehicleCategory,
      guideLanguage,
    });
  };

  const airports = locations.filter(l => l.is_airport);
  const cities = locations.filter(l => !l.is_airport);

  const getLocalizedName = (loc: Location) => lang === 'ru' ? loc.name_ru : loc.name_en;

  return (
    <section className="relative -mt-8 z-10 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('search.title')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.from')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <select
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none"
                >
                  <option value="">{t('search.placeholder')}</option>
                  {airports.length > 0 && (
                    <optgroup label={t('search.airports')}>
                      {airports.map(l => <option key={l.id} value={l.id}>{getLocalizedName(l)} {l.is_airport && <Plane className="inline w-3 h-3" />}</option>)}
                    </optgroup>
                  )}
                  <optgroup label={t('search.cities')}>
                    {cities.map(l => <option key={l.id} value={l.id}>{getLocalizedName(l)}</option>)}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.from && <p className="text-xs text-red-500 mt-1">{errors.from}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.to')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
                <select
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none"
                >
                  <option value="">{t('search.placeholder')}</option>
                  {airports.length > 0 && (
                    <optgroup label={t('search.airports')}>
                      {airports.map(l => <option key={l.id} value={l.id}>{getLocalizedName(l)}</option>)}
                    </optgroup>
                  )}
                  <optgroup label={t('search.cities')}>
                    {cities.map(l => <option key={l.id} value={l.id}>{getLocalizedName(l)}</option>)}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.to && <p className="text-xs text-red-500 mt-1">{errors.to}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.tourists')}</label>
              <div className="relative flex items-center">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <button
                  type="button"
                  onClick={decrement}
                  disabled={tourists === '' || (typeof tourists === 'number' && tourists <= 1)}
                  className="absolute left-9 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors active:scale-95 z-10 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1"
                  value={tourists}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                      setTourists('');
                      if (errors.tourists) setErrors(prev => { const n = {...prev}; delete n.tourists; return n; });
                      return;
                    }
                    if (/^\d+$/.test(val)) {
                      const num = Math.min(50, Math.max(1, parseInt(val) || 1));
                      setTourists(num);
                      if (errors.tourists) setErrors(prev => { const n = {...prev}; delete n.tourists; return n; });
                    }
                  }}
                  className={`w-full pl-[72px] pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-center font-medium ${
                    errors.tourists ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={increment}
                  disabled={typeof tourists === 'number' && tourists >= 50}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.tourists && <p className="text-xs text-red-500 mt-1">{errors.tourists}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.date')}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
              </div>
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.time')}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
              </div>
              {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.vehicleType')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {VEHICLE_CATEGORIES.map(({ key, labelRu, labelEn }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVehicleCategory(vehicleCategory === key ? '' : key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        vehicleCategory === key
                          ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      {lang === 'ru' ? labelRu : labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('search.guideLang')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {GUIDE_LANGUAGES.map(({ key, labelRu, labelEn }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setGuideLanguage(guideLanguage === key ? '' : key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        guideLanguage === key
                          ? 'bg-accent-50 border-accent-300 text-accent-700 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {lang === 'ru' ? labelRu : labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all active:scale-[0.98]"
          >
            <Search className="w-5 h-5" />
            {t('search.submit')}
          </button>
        </form>
      </div>
    </section>
  );
}

export default SearchForm;