import { useState, useEffect } from 'react'; // <--- Добавлен useEffect
import { Car, User, Phone, Mail, Calendar, Users, Hash, Award, MessageSquare, Send, CheckCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { submitDriverApplication, DriverApplicationInput } from '../lib/api';

const VEHICLE_CATEGORIES = [
  { key: 'sedan', label: 'Легковой' },
  { key: 'minivan', label: 'Минивэн' },
  { key: 'suv', label: 'Джип / Внедорожник' },
  { key: 'minibus', label: 'Микроавтобус' },
];

const LANGUAGE_OPTIONS = ['Русский', 'Английский', 'Немецкий', 'Китайский', 'Корейский', 'Японский', 'Арабский', 'Турецкий'];

interface Props {
  onBack: () => void;
}

function DriverRegistration({ onBack }: Props) {
  const [form, setForm] = useState<Partial<DriverApplicationInput>>({
    languages: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // <--- ДОБАВЛЕНО: Принудительная прокрутка наверх при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = (field: keyof DriverApplicationInput, value: unknown) => {
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

    if (!form.vehicle_name?.trim()) e.vehicle_name = 'Укажите марку и модель авто';
    if (!form.vehicle_category) e.vehicle_category = 'Выберите тип авто';
    if (!form.vehicle_capacity || form.vehicle_capacity < 1) e.vehicle_capacity = 'Укажите вместимость';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitDriverApplication(form as DriverApplicationInput);
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Регистрация водителя</h1>
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
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
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
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
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
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Стаж вождения (лет)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={form.experience_years ?? ''}
                    onChange={e => update('experience_years', parseInt(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Номер водительского удостоверения</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.license_number ?? ''}
                    onChange={e => update('license_number', e.target.value)}
                    placeholder="AB1234567"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Информация об автомобиле</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Марка и модель авто <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.vehicle_name ?? ''}
                    onChange={e => update('vehicle_name', e.target.value)}
                    placeholder="Toyota Land Cruiser 200"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>
                {errors.vehicle_name && <p className="text-xs text-red-500 mt-1">{errors.vehicle_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Тип авто <span className="text-red-500">*</span></label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={form.vehicle_category ?? ''}
                    onChange={e => update('vehicle_category', e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none"
                  >
                    <option value="">Выберите тип</option>
                    {VEHICLE_CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
                {errors.vehicle_category && <p className="text-xs text-red-500 mt-1">{errors.vehicle_category}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Год выпуска</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min={1990}
                    max={new Date().getFullYear()}
                    value={form.vehicle_year ?? ''}
                    onChange={e => update('vehicle_year', parseInt(e.target.value) || undefined)}
                    placeholder="2020"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Вместимость (чел.) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={form.vehicle_capacity ?? ''}
                    onChange={e => update('vehicle_capacity', parseInt(e.target.value) || 0)}
                    placeholder="4"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>
                {errors.vehicle_capacity && <p className="text-xs text-red-500 mt-1">{errors.vehicle_capacity}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Дополнительно</h3>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Языки, которыми владеете</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      (form.languages ?? []).includes(lang)
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">О себе</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={form.about ?? ''}
                  onChange={e => update('about', e.target.value)}
                  rows={4}
                  placeholder="Расскажите о своём опыте, любимых маршрутах..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all active:scale-[0.98]"
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
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>
    </div>
  );
}

export default DriverRegistration;