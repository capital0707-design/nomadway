import { Mountain, Star } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

function HeroSection() {
  const { t, lang } = useTranslation();

  const stats = lang === 'ru'
    ? [
        { num: '50+', label: 'Водителей' },
        { num: '5', label: 'Языков' },
        { num: '4.8', label: 'Рейтинг', icon: Star },
      ]
    : [
        { num: '50+', label: 'Drivers' },
        { num: '5', label: 'Languages' },
        { num: '4.8', label: 'Rating', icon: Star },
      ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/10">
            <Mountain className="w-4 h-4 text-accent-400" />
            {t('hero.title')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            {lang === 'ru' ? (
              <>
                Комфортный
                <span className="block bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                  трансфер и гиды
                </span>
              </>
            ) : (
              <>
                Comfortable
                <span className="block bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                  transfers & guides
                </span>
              </>
            )}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-lg">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                {stat.icon && <stat.icon className="w-4 h-4 text-warm-400 fill-warm-400" />}
                <span className="text-xl font-bold">{stat.num}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}

export default HeroSection;
