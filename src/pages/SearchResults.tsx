import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Car, Globe, CreditCard, Shield, CheckCircle, Mountain, Plane } from 'lucide-react';
import { SearchParams, Vehicle, Guide, Location, VehicleCategory, getVehicleRecommendation, isMountainRoute, isAirportRoute } from '../lib/types';
import { fetchVehicles, fetchGuides, fetchLocations, createBooking } from '../lib/api';
import { estimateDistance, isGroupRoute } from '../lib/types';
import VehicleCard from '../components/VehicleCard';
import GuideCard from '../components/GuideCard';
import PhoneInput, { COUNTRIES, stripNonDigits, getMaskLength } from '../components/PhoneInput';
import { useTranslation, useLang } from '../lib/i18n';

const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, { ru: string; en: string }> = {
  sedan: { ru: 'Легковые', en: 'Sedans' },
  minivan: { ru: 'Минивэны', en: 'Minivans' },
  suv: { ru: 'Джипы', en: 'SUVs' },
  minibus: { ru: 'Микроавтобусы', en: 'Minibuses' },
};

const GUIDE_LANGUAGE_LABELS: Record<string, { ru: string; en: string }> = {
  english: { ru: 'Английский', en: 'English' },
  german: { ru: 'Немецкий', en: 'German' },
  japanese: { ru: 'Японский', en: 'Japanese' },
  chinese: { ru: 'Китайский', en: 'Chinese' },
  korean: { ru: 'Корейский', en: 'Korean' },
};

interface Props {
  params: SearchParams;
  onBack: () => void;
  onBookingComplete: (data: {
    bookingId: string;
    userName: string;
    fromName: string;
    toName: string;
    pickupDate: string;
    pickupTime: string;
    vehicleName: string;
    driverName: string;
    guideName: string | null;
    totalPrice: number;
  }) => void;
}

type Step = 'vehicle' | 'guide' | 'details';

function SearchResults({ params, onBack, onBookingComplete }: Props) {
  const [step, setStep] = useState<Step>('vehicle');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [noGuide, setNoGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('+996 ');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();
  const lang = useLang();

  const fromLoc = locations.find(l => l.id === params.fromLocation);
  const toLoc = locations.find(l => l.id === params.toLocation);
  const distance = fromLoc && toLoc ? estimateDistance(fromLoc.name_en, toLoc.name_en) : 100;
  const guideHours = Math.max(4, Math.round(distance / 60) + 2);
  const vehiclePrice = selectedVehicle ? selectedVehicle.price_per_km * distance : 0;
  const guidePrice = selectedGuide && !noGuide ? selectedGuide.price_per_hour * guideHours : 0;
  const totalPrice = vehiclePrice + guidePrice;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [v, g, l] = await Promise.all([
          fetchVehicles(params.vehicleCategory || undefined),
          fetchGuides(params.guideLanguage || undefined),
          fetchLocations(),
        ]);
        const filtered = params.vehicleCategory
          ? v.filter(ve => ve.category === params.vehicleCategory)
          : v;
        setVehicles(filtered);
        setGuides(g);
        setLocations(l);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const aRec = getVehicleRecommendation(a, fromLoc, toLoc, params.touristCount);
    const bRec = getVehicleRecommendation(b, fromLoc, toLoc, params.touristCount);
    const aHasCapacity = a.capacity >= params.touristCount;
    const bHasCapacity = b.capacity >= params.touristCount;
    if (aHasCapacity !== bHasCapacity) return aHasCapacity ? -1 : 1;
    if (aRec?.isRecommended !== bRec?.isRecommended) return aRec?.isRecommended ? -1 : 1;
    return (a.capacity - params.touristCount) - (b.capacity - params.touristCount);
  });

  const handleVehicleSelect = (v: Vehicle) => {
    setSelectedVehicle(v);
    setStep('guide');
  };

  const handleGuideSkip = () => {
    setNoGuide(true);
    setSelectedGuide(null);
    setStep('details');
  };

  const handleGuideSelect = (g: Guide) => {
    setSelectedGuide(g);
    setNoGuide(false);
    setStep('details');
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!userName.trim()) e.name = t('error.nameRequired');
    else if (!/^[a-zA-Zа-яА-ЯёЁіңүұқғһ\s'-]+$/.test(userName.trim())) e.name = t('error.nameLetters');
    else if (userName.trim().length < 2) e.name = t('error.nameMin');

    const phoneDigits = stripNonDigits(userPhone);
    const defaultCountry = COUNTRIES[0];
    const requiredLength = getMaskLength(defaultCountry.mask);
    const matchingCountry = COUNTRIES.find(c => userPhone.startsWith(c.dial));
    const needed = matchingCountry ? getMaskLength(matchingCountry.mask) : requiredLength;
    if (phoneDigits.length === 0) e.phone = t('error.phoneRequired');
    else if (phoneDigits.length < needed) e.phone = `${t('error.phoneComplete')} (${needed} ${t('error.digits')})`;

    if (!userEmail.trim()) e.email = t('error.emailRequired');
    else if (!/^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(userEmail.trim())) e.email = t('error.emailInvalid');

    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedVehicle) return;
    setSubmitting(true);
    try {
      const booking = await createBooking({
        user_email: userEmail,
        user_phone: userPhone,
        user_name: userName,
        from_location_id: params.fromLocation,
        to_location_id: params.toLocation,
        vehicle_id: selectedVehicle.id,
        guide_id: noGuide ? null : selectedGuide?.id ?? null,
        tourist_count: params.touristCount,
        pickup_date: params.pickupDate,
        pickup_time: params.pickupTime,
        total_price: totalPrice,
        guide_price: guidePrice,
      });
      onBookingComplete({
        bookingId: booking.id,
        userName,
        fromName: lang === 'ru' ? (fromLoc?.name_ru ?? '') : (fromLoc?.name_en ?? ''),
        toName: lang === 'ru' ? (toLoc?.name_ru ?? '') : (toLoc?.name_en ?? ''),
        pickupDate: params.pickupDate,
        pickupTime: params.pickupTime,
        vehicleName: selectedVehicle.name,
        driverName: selectedVehicle.driver_name,
        guideName: noGuide ? null : selectedGuide?.name ?? null,
        totalPrice,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getLocalizedName = (loc: Location | undefined) => loc ? (lang === 'ru' ? loc.name_ru : loc.name_en) : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">{lang === 'ru' ? 'Поиск вариантов...' : 'Searching...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t('results.backToSearch')}
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-700"><MapPin className="w-4 h-4 text-primary-500" />{getLocalizedName(fromLoc)}</div>
        <span className="text-gray-300">→</span>
        <div className="flex items-center gap-1.5 text-gray-700"><MapPin className="w-4 h-4 text-accent-500" />{getLocalizedName(toLoc)}</div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 text-gray-600"><Calendar className="w-4 h-4" />{params.pickupDate}</div>
        <div className="flex items-center gap-1.5 text-gray-600"><Clock className="w-4 h-4" />{params.pickupTime}</div>
        <div className="flex items-center gap-1.5 text-gray-600"><Users className="w-4 h-4" />{params.touristCount} {t('results.people')}</div>
        <div className="ml-auto text-xs text-gray-400">~{distance} {t('results.distance')}</div>
      </div>

      {step === 'vehicle' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{t('vehicleSelect.title')}</h2>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <p className="text-sm text-gray-500">
              {params.vehicleCategory
                ? `${t('vehicleSelect.shown')} ${VEHICLE_CATEGORY_LABELS[params.vehicleCategory as VehicleCategory][lang]}`
                : t('vehicleSelect.all')}
            </p>
            {isMountainRoute(fromLoc, toLoc) && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200">
                <Mountain className="w-3.5 h-3.5" />
                {t('route.mountain')}
              </span>
            )}
            {isAirportRoute(fromLoc, toLoc) && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg border border-sky-200">
                <Plane className="w-3.5 h-3.5" />
                {t('route.airport')}
              </span>
            )}
            {isGroupRoute(params.touristCount) && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200">
                <Users className="w-3.5 h-3.5" />
                {t('route.group')} {params.touristCount} {t('results.people')}
              </span>
            )}
          </div>

          {sortedVehicles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Car className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('vehicleSelect.none')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedVehicles.map(v => {
                const recommendation = getVehicleRecommendation(v, fromLoc, toLoc, params.touristCount);
                const insufficientCapacity = v.capacity < params.touristCount;
                const translatedRec = recommendation ? {
                  isRecommended: recommendation.isRecommended,
                  reason: recommendation.reason === 'Рекомендуется для горных маршрутов' ? t('recommend.mountain')
                        : recommendation.reason === 'Оптимально для группы' ? t('recommend.group')
                        : recommendation.reason === 'Экономно для трансфера в аэропорт' ? t('recommend.city')
                        : t('recommend.capacity')
                } : null;
                return (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    distance={distance}
                    selected={selectedVehicle?.id === v.id}
                    onSelect={() => handleVehicleSelect(v)}
                    recommendation={translatedRec}
                    insufficientCapacity={insufficientCapacity}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === 'guide' && (
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t('guideSelect.title')}</h2>
            <p className="text-sm text-gray-500">
              {params.guideLanguage
                ? `${t('guideSelect.shown')} ${GUIDE_LANGUAGE_LABELS[params.guideLanguage]?.[lang] ?? params.guideLanguage}`
                : t('guideSelect.subtitle')}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleGuideSkip}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                noGuide
                  ? 'border-primary-400 bg-primary-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  noGuide ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <Users className={`w-6 h-6 ${noGuide ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${noGuide ? 'text-primary-700' : 'text-gray-900'}`}>
                    {t('guideSelect.noGuide')}
                  </p>
                  <p className="text-sm text-gray-500">{t('guideSelect.noGuideDesc')}</p>
                </div>
                {noGuide && <CheckCircle className="w-5 h-5 text-primary-500" />}
              </div>
            </button>

            {guides.length > 0 && guides.map(g => (
              <GuideCard
                key={g.id}
                guide={g}
                selected={selectedGuide?.id === g.id}
                onSelect={() => handleGuideSelect(g)}
                hours={guideHours}
              />
            ))}

            {guides.length === 0 && (
              <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t('guideSelect.none')}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep('vehicle')}
            className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('guideSelect.back')}
          </button>
        </div>
      )}

      {step === 'details' && selectedVehicle && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{t('details.title')}</h2>
          <p className="text-sm text-gray-500 mb-5">{t('details.subtitle')}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t('details.contactInfo')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('details.name')}</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '' || /^[a-zA-Zа-яА-ЯёЁіңүұқғһ\s'-]+$/.test(val)) {
                          setUserName(val);
                          if (formErrors.name) setFormErrors(prev => { const n = {...prev}; delete n.name; return n; });
                        }
                      }}
                      placeholder={t('details.namePlaceholder')}
                      className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all ${
                        formErrors.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''
                      }`}
                    />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  <PhoneInput
                    value={userPhone}
                    onChange={val => {
                      setUserPhone(val);
                      if (formErrors.phone) setFormErrors(prev => { const n = {...prev}; delete n.phone; return n; });
                    }}
                    error={formErrors.phone}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t('details.email')}</label>
                    <input
                      type="text"
                      inputMode="email"
                      value={userEmail}
                      onPaste={e => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData('text');
                        const filtered = pasted.replace(/[^a-zA-Z0-9@._\-]/g, '');
                        setUserEmail(userEmail + filtered);
                        if (formErrors.email) setFormErrors(prev => { const n = {...prev}; delete n.email; return n; });
                      }}
                      onKeyDown={e => {
                        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !/^[a-zA-Z0-9@._\-]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={e => {
                        const val = e.target.value;
                        const filtered = val.replace(/[^a-zA-Z0-9@._\-]/g, '');
                        setUserEmail(filtered);
                        if (formErrors.email) setFormErrors(prev => { const n = {...prev}; delete n.email; return n; });
                      }}
                      onBlur={() => {
                        if (userEmail && !/^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(userEmail)) {
                          setFormErrors(prev => ({ ...prev, email: t('error.emailInvalid') }));
                        }
                      }}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all ${
                        formErrors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''
                      }`}
                    />
                    {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t('details.orderDetails')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('details.vehicle')}</span>
                    <span className="font-medium text-gray-900">{selectedVehicle.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('details.driver')}</span>
                    <span className="font-medium text-gray-900">{selectedVehicle.driver_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('details.route')}</span>
                    <span className="font-medium text-gray-900">{getLocalizedName(fromLoc)} → {getLocalizedName(toLoc)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('details.datetime')}</span>
                    <span className="font-medium text-gray-900">{params.pickupDate} {params.pickupTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('details.tourists')}</span>
                    <span className="font-medium text-gray-900">{params.touristCount}</span>
                  </div>
                  {selectedGuide && !noGuide && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('details.guide')}</span>
                      <span className="font-medium text-gray-900">{selectedGuide.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t('details.cost')}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('details.transport')} ({distance} {t('results.distance')})</span>
                    <span className="font-medium">{vehiclePrice.toLocaleString()} {t('details.currency')}</span>
                  </div>
                  {selectedGuide && !noGuide && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{lang === 'ru' ? 'Гид' : 'Guide'} ({guideHours} {t('guideSelect.hours')})</span>
                      <span className="font-medium">{guidePrice.toLocaleString()} {t('details.currency')}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3 mb-5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">{t('details.total')}</span>
                    <span className="text-xl font-bold text-gray-900">{totalPrice.toLocaleString()} {t('details.currency')}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all active:scale-[0.98]"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {t('details.submit')}
                    </>
                  )}
                </button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-3.5 h-3.5 text-accent-500" />
                    {t('details.secure')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-accent-500" />
                    {t('details.instant')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(params.guideLanguage ? 'guide' : 'vehicle')}
            className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('details.back')}
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
