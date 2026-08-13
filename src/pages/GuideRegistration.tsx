import { useState, useEffect } from 'react';
import { Globe, User, Phone, Mail, Award, MessageSquare, Send, CheckCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { submitGuideApplication, GuideApplicationInput } from '../lib/api';

const GUIDE_LANGUAGES = [
  { key: 'english', label: 'Английский' },
  { key: 'german', label: 'Немецкий' },
  { key: 'japanese', label: 'Японский' },
  { key: 'chinese', label: 'Китайский' },
  { key: 'korean', label: 'Корейский' },
];

interface Props {
  onBack: () => void;
}

function GuideRegistration({ onBack }: Props) {
  const [form, setForm] = useState<Partial<GuideApplicationInput>>({
    languages: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

// <--- ДОБАВЛЕНО: Принудительная прокрутка наверх при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const update = (field: keyof GuideApplicationInput, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const toggleLanguage = (lang: string) => {
    const current = form.languages ?? [];
    if (current.includes(lang)) {
      update('languages', current.filter(l => l !== lang));
    } else {
      update('languages', [...current, lang]);
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.full_name?.trim()) e.full_name = 'Укажите ФИО';
    else if (form.full_name.trim().length < 3) e.full_name = 'Минимум 3 символа';

    if (!form.phone?.trim()) e.phone = 'Укажите номер телефона';
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Введите полный номер';

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Некорректный email';

    if (!form.languages || form.languages.length === 0) e.languages = 'Выберите хотя бы один язык';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitGuideApplication(form as GuideApplicationInput);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Ошибка отправки. Попробуйте позже.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Заявка отправлена!</h2>
          <p className="text-gray-600 mb-8">Спасибо за интерес к сотрудничеству. Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="inline<think> items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-accent-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Регистрация гида-переводчика</h1>
            <p className="text-sm text-gray-500">Заполните форму, чтобы стать партнёром NomadWay</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">ФИО <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.full_name ?? ''}
                    onChange={e => update('full_name', e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all"
                  />
                </div>
                {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Телефон <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone ?? ''}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+996 555 123 456"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email ?? ''}
                    onChange={e => update('email', e.target.value)}
                    placeholder="name@mail.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Стаж работы гидом (лет)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={form.experience_years ?? ''}
                    onChange={e => update('experience_years', parseInt(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Специализация</label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={form.specialization ?? ''}
                    onChange={e => update('specialization', e.target.value || undefined)}
                    className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all appearance-none"
                  >
                    <option value="">Выберите специализацию</option>
                    <option value="history">Исторические экскурсии</option>
                    <option value="mountain">Горные походы / треккинг</option>
                    <option value="culture">Культурные программы</option>
                    <option value="business">Бизнес-переводчик</option>
                    <option value="general">Общий тур</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Языки <span className="text-red-500">*</span></h3>
            <div className="flex flex-wrap gap-2">
              {GUIDE_LANGUAGES.map(lang => (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => toggleLanguage(lang.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    (form.languages ?? []).includes(lang.key)
                      ? 'bg-accent-50 border-accent-300 text-accent-700 shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            {errors.languages && <p className="text-xs text-red-500 mt-2">{errors.languages}</p>}
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">О себе</h3>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={form.about ?? ''}
                onChange={e => update('about', e.target.value)}
                rows={4}
                placeholder="Расскажите о своём опыте, любимых маршрутах, знаниях о Кыргызстане..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all resize-none"
              />
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all active:scale-[0.98]"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Отправить заявку
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Нажимая кнопку, Вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>
    </div>
  );
}

export default GuideRegistration;
