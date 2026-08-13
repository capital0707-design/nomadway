import { Star, Globe } from 'lucide-react';
import { Guide } from '../lib/types';
import { useTranslation, useLang } from '../lib/i18n';

const GUIDE_LANGUAGE_LABELS: Record<string, { ru: string; en: string }> = {
  english: { ru: 'Английский', en: 'English' },
  german: { ru: 'Немецкий', en: 'German' },
  japanese: { ru: 'Японский', en: 'Japanese' },
  chinese: { ru: 'Китайский', en: 'Chinese' },
  korean: { ru: 'Корейский', en: 'Korean' },
};

interface Props {
  guide: Guide;
  selected: boolean;
  onSelect: () => void;
  hours: number;
}

function GuideCard({ guide, selected, onSelect, hours }: Props) {
  const totalPrice = guide.price_per_hour * hours;
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 p-5 ${
        selected
          ? 'border-accent-400 shadow-lg shadow-accent-100 ring-1 ring-accent-200'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          {t('vehicleSelect.selected')}
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {guide.photo_url ? (
            <img src={guide.photo_url} alt={guide.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
              {guide.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-1">{guide.name}</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-warm-400 fill-warm-400" />
              <span className="text-sm font-semibold">{guide.rating}</span>
            </div>
            <span className="text-xs text-gray-500">{guide.trips} {lang === 'ru' ? 'экскурсий' : 'tours'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {guide.languages.map(guideLang => (
              <span
                key={guideLang}
                className="inline-flex items-center gap-1 text-xs font-medium bg-accent-50 text-accent-700 px-2 py-0.5 rounded-md"
              >
                <Globe className="w-3 h-3" />
                {GUIDE_LANGUAGE_LABELS[guideLang]?.[lang] ?? guideLang}
              </span>
            ))}
          </div>

          {guide.bio_ru && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{guide.bio_ru}</p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-gray-900">{totalPrice.toLocaleString()}</div>
          <div className="text-xs text-gray-400">{t('details.currency')} / {hours} {t('guideSelect.hours')}</div>
          <div className="text-xs text-gray-400">{guide.price_per_hour} {t('details.currency')}/{t('guideSelect.hours')}</div>
        </div>
      </div>
    </div>
  );
}

export default GuideCard;
