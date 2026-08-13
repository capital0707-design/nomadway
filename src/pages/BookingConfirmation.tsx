import { CheckCircle, MapPin, Calendar, Clock, Car, Globe, Copy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation, useLang } from '../lib/i18n';

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

interface Props {
  data: BookingData;
  onNewSearch: () => void;
}

function BookingConfirmation({ data, onNewSearch }: Props) {
  const [copied, setCopied] = useState(false);
  const shortId = data.bookingId.slice(0, 8).toUpperCase();
  const { t } = useTranslation();
  const lang = useLang();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.bookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const importantInfoRu = [
    'Водитель будет ждать в назначенное время с табличкой',
    'При задержке более 30 минут свяжитесь с нами: +996 (312) 123-456',
    'Отмена бесплатна за 24 часа до поездки',
    'Подтверждение отправлено на ваш email',
  ];

  const importantInfoEn = [
    'The driver will wait at the appointed time with a sign',
    'If delayed more than 30 minutes, contact us: +996 (312) 123-456',
    'Free cancellation up to 24 hours before the trip',
    'Confirmation sent to your email',
  ];

  const importantInfo = lang === 'ru' ? importantInfoRu : importantInfoEn;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-accent-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('confirmation.title')}</h1>
        <p className="text-gray-500">{t('confirmation.thankYou')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary-200 font-medium">{t('confirmation.id')}</span>
              <div className="text-lg font-bold tracking-wider">{shortId}</div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copied ? (lang === 'ru' ? 'Скопировано' : 'Copied') : (lang === 'ru' ? 'Копировать' : 'Copy')}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-400 font-medium">{t('details.route')}</div>
              <div className="text-sm font-semibold text-gray-900">{data.fromName} → {data.toName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-400 font-medium">{t('confirmation.date')}</div>
              <div className="text-sm font-semibold text-gray-900">{data.pickupDate}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-400 font-medium">{t('confirmation.time')}</div>
              <div className="text-sm font-semibold text-gray-900">{data.pickupTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-400 font-medium">{lang === 'ru' ? 'Автомобиль и водитель' : 'Vehicle & Driver'}</div>
              <div className="text-sm font-semibold text-gray-900">{data.vehicleName} — {data.driverName}</div>
            </div>
          </div>

          {data.guideName && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-accent-500 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 font-medium">{t('confirmation.guide')}</div>
                <div className="text-sm font-semibold text-gray-900">{data.guideName}</div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('confirmation.price')}</span>
              <span className="text-xl font-bold text-gray-900">{data.totalPrice.toLocaleString()} {t('details.currency')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-amber-800 mb-1">{lang === 'ru' ? 'Важная информация' : 'Important information'}</h3>
        <ul className="text-xs text-amber-700 space-y-1">
          {importantInfo.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onNewSearch}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/25 transition-all"
        >
          {t('confirmation.newSearch')}
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
