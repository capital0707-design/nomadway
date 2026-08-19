import { useState, useCallback } from 'react';
import { MapPin, Car, Users, Globe, Mountain } from 'lucide-react';
import UserAgreement from './pages/UserAgreement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { SearchParams } from './lib/types';
import SearchForm from './components/SearchForm';
import SearchResults from './pages/SearchResults';
import BookingConfirmation from './pages/BookingConfirmation';
import DriverRegistration from './pages/DriverRegistration';
import GuideRegistration from './pages/GuideRegistration';
import DriverDashboard from './pages/DriverDashboard';
import HeroSection from './components/HeroSection';
import GuideDashboard from './pages/GuideDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useTranslation } from './lib/i18n';

const FlagRU = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} preserveAspectRatio="none">
    <rect width="24" height="16" fill="#fff" />
    <rect width="24" height="5.33" fill="#fff" />
    <rect y="5.33" width="24" height="5.33" fill="#0039A6" />
    <rect y="10.66" width="24" height="5.34" fill="#D52B1E" />
  </svg>
);

const FlagGB = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} preserveAspectRatio="none">
    <rect width="24" height="16" fill="#012169" />
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.2" />
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
    <path d="M12 0 V16 M0 8 H24" stroke="#fff" strokeWidth="5.3" />
    <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3.2" />
  </svg>
);

type AppStep =
  | 'search'
  | 'results'
  | 'booking'
  | 'confirmation'
  | 'driver-reg'
  | 'guide-reg'
  | 'driver-dashboard'
  | 'guide-dashboard'
  | 'user-agreement'
  | 'privacy-policy'
  | 'admin';

interface BookingData {
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
}

function App() {
  const [step, setStep] = useState<AppStep>('search');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const { t, lang, setLang } = useTranslation();

  const handleSearch = useCallback((params: SearchParams) => {
    setSearchParams(params);
    setStep('results');
  }, []);

  const handleBookingComplete = useCallback((data: BookingData) => {
    setBookingData(data);
    setStep('confirmation');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'results') setStep('search');
    if (step === 'confirmation') setStep('search');
  }, [step]);

  const toggleLang = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => { setStep('search'); setSearchParams(null); }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">{t('header.brand')}</span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-2 font-medium">{t('header.brand.alt')}</span>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1">
                {[
                  { icon: MapPin, label: t('nav.route'), active: step === 'search' },
                  { icon: Car, label: t('nav.selection'), active: step === 'results' || step === 'booking' },
                  { icon: Users, label: t('nav.confirmation'), active: step === 'confirmation' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <div className="w-6 h-px bg-gray-200 mx-1" />}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      item.active ? 'bg-primary-50 text-primary-700' : 'text-gray-400'
                    }`}>
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </div>
                  </div>
                ))}
              </nav>
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {lang === 'ru' ? <FlagRU className="w-4 h-3 rounded-[2px] overflow-hidden block" /> : <FlagGB className="w-4 h-3 rounded-[2px] overflow-hidden block" />}
                <span>{lang === 'ru' ? 'RU' : 'EN'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {step === 'search' && (
          <>
            <HeroSection />
            <SearchForm onSearch={handleSearch} />
          </>
        )}
        {step === 'results' && searchParams && (
          <SearchResults
            params={searchParams}
            onBack={handleBack}
            onBookingComplete={handleBookingComplete}
          />
        )}
        {step === 'confirmation' && bookingData && (
          <BookingConfirmation data={bookingData} onNewSearch={handleBack} />
        )}
        {step === 'driver-reg' && (
          <DriverRegistration onBack={() => setStep('search')} />
        )}
        {step === 'guide-reg' && (
          <GuideRegistration onBack={() => setStep('search')} />
        )}
        {step === 'driver-dashboard' && (
          <DriverDashboard onBack={() => setStep('search')} />
        )}
        {step === 'guide-dashboard' && (
          <GuideDashboard onBack={() => setStep('search')} />
        )}
        {step === 'user-agreement' && (
          <UserAgreement onBack={() => setStep('search')} />
        )}
        {step === 'privacy-policy' && (
          <PrivacyPolicy onBack={() => setStep('search')} />
        )}
        {step === 'admin' && (
          <AdminDashboard onBack={() => setStep('search')} />
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-accent-400" />
                <span className="text-white font-bold">{t('header.brand')}</span>
              </div>
              <p className="text-sm leading-relaxed">{t('footer.description')}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.services')}</h4>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2"><Car className="w-3.5 h-3.5 text-accent-400" /> {t('footer.airport')}</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-accent-400" /> {t('footer.intercity')}</li>
                <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-accent-400" /> {t('footer.guides')}</li>
                <li className="flex items-center gap-2"><Mountain className="w-3.5 h-3.5 text-accent-400" /> {t('footer.mountains')}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.contacts')}</h4>
              <ul className="space-y-1.5 text-sm">
                <li>+996 (312) 123-456</li>
                <li>info@nomadway.kg</li>
                <li>{lang === 'ru' ? 'г. Бишкек, ул. Киевская 120' : 'Bishkek, Kievskaya 120'}</li>
                <li className="pt-2 text-xs text-gray-500">{t('footer.hours')}</li>
              </ul>
            </div>

            {/* Правовая информация — переключается по языку */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.legal')}</h4>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <button
                    onClick={() => setStep('user-agreement')}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {t('footer.terms')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setStep('privacy-policy')}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {t('footer.privacy')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Партнёрам — ВСЕГДА на русском (для местного персонала) */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Партнёрам</h4>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setStep('driver-reg')}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-left"
                  >
                    Стать водителем
                  </button>
                  <button
                    onClick={() => setStep('driver-dashboard')}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-right"
                  >
                    Кабинет водителя →
                  </button>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setStep('guide-reg')}
                    className="text-gray-400 hover:text-accent-400 transition-colors text-left"
                  >
                    Стать гидом-переводчиком
                  </button>
                  <button
                    onClick={() => setStep('guide-dashboard')}
                    className="text-gray-400 hover:text-accent-400 transition-colors text-right"
                  >
                    Кабинет гида →
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setStep('admin')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    🔐 Админ-панель →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;