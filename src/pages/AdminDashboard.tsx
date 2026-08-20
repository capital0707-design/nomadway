import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Lock, RefreshCw, LogOut } from 'lucide-react';

type Tab = 'bookings' | 'drivers' | 'guides';

const BOOKING_STATUS: Record<string, string> = {
  confirmed: 'Подтверждена',
  accepted: 'Водитель принял',
  completed: 'Завершена',
  cancelled: 'Отменена',
};

const APP_STATUS: Record<string, string> = {
  pending: 'На рассмотрении',
  approved: 'Одобрена',
  rejected: 'Отклонена',
};


import { setStaffPassword } from '../lib/backendApi';

function PasswordSetter({ type, id, secret }: { type: 'driver' | 'guide'; id: string; secret: string | null }) {
  const [pwd, setPwd] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');

  const save = async () => {
    if (!secret || pwd.length < 4) {
      alert('Пароль должен быть не менее 4 символов');
      return;
    }
    setStatus('saving');
    try {
      await setStaffPassword(type, id, pwd, secret);
      setStatus('ok');
      setPwd('');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('err');
    }
  };

  return (
    <div className="w-full mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500">🔑 Пароль для входа:</span>
      <input
        type="text"
        value={pwd}
        onChange={e => setPwd(e.target.value)}
        placeholder="минимум 4 символа"
        className="flex-1 min-w-[140px] px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
      />
      <button
        onClick={save}
        disabled={status === 'saving' || pwd.length < 4}
        className="px-3 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
      >
        {status === 'saving' ? '...' : status === 'ok' ? '✓ Сохранён' : 'Назначить'}
      </button>
    </div>
  );
}




export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [secret, setSecret] = useState<string | null>(() => localStorage.getItem('admin_secret'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('bookings');

  const loadData = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?action=data', { headers: { 'x-admin-secret': s } });
      if (res.status === 401) {
        localStorage.removeItem('admin_secret');
        setSecret(null);
        setData(null);
        return;
      }
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (secret) loadData(secret);
  }, [secret, loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem('admin_secret', password);
      setSecret(password);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Неверный пароль');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_secret');
    setSecret(null);
    setData(null);
  };

  const updateStatus = async (type: string, id: string, status: string) => {
    if (!secret) return;
    const res = await fetch('/api/admin?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ type, id, status }),
    });
    if (res.ok) loadData(secret);
  };

  if (!secret) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> На главную
        </button>
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Админ-панель</h1>
          <p className="text-sm text-gray-500 mb-6">Доступ только для персонала</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 mb-3"
          />
          {loginError && <p className="text-xs text-red-500 mb-3">{loginError}</p>}
          <button type="submit" className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98]">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> На главную
          </button>
          <h1 className="text-xl font-bold text-gray-900">Админ-панель</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => secret && loadData(secret)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
          </button>
          <button onClick={logout} className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: 'bookings', label: `Брони (${data?.bookings?.length ?? 0})` },
          { key: 'drivers', label: `Водители (${data?.drivers?.length ?? 0})` },
          { key: 'guides', label: `Гиды (${data?.guides?.length ?? 0})` },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              tab === key ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && !data && <p className="text-sm text-gray-500">Загрузка...</p>}

      {data && tab === 'bookings' && (
        <div className="space-y-3">
          {data.bookings.length === 0 && <p className="text-sm text-gray-500">Пока нет броней</p>}
          {data.bookings.map((b: any) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{b.user_name} <span className="text-sm font-normal text-gray-500">· {b.user_phone}</span></p>
                  <p className="text-sm text-gray-600 mt-1">🗺 {b.from_name} → {b.to_name}</p>
                  <p className="text-sm text-gray-600">📅 {String(b.pickup_date).slice(0, 10)} ⏰ {String(b.pickup_time).slice(0, 5)} · 👥 {b.tourist_count}</p>
                  <p className="text-sm text-gray-600">🚗 {b.vehicle_name}{b.guide_name ? ` · 🧭 ${b.guide_name}` : ''}</p>
                  {b.user_email && <p className="text-sm text-gray-500">✉️ {b.user_email}</p>}
                  <p className="text-xs text-gray-400 mt-1">Создана: {new Date(b.created_at).toLocaleString('ru-RU')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{b.total_price} сом</p>
                  <select
                    value={b.status}
                    onChange={e => updateStatus('booking', b.id, e.target.value)}
                    className="mt-2 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none"
                  >
                    {Object.entries(BOOKING_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && tab === 'drivers' && (
        <div className="space-y-3">
          {data.drivers.length === 0 && <p className="text-sm text-gray-500">Пока нет анкет</p>}
          {data.drivers.map((d: any) => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{d.full_name} <span className="text-sm font-normal text-gray-500">· {d.phone}</span></p>
                <p className="text-sm text-gray-600 mt-1">🚗 {d.vehicle_name} ({d.vehicle_category}, {d.vehicle_capacity} мест){d.vehicle_year ? ` · ${d.vehicle_year} г.` : ''}</p>
                <p className="text-sm text-gray-600">Стаж: {d.experience_years} лет{d.languages?.length ? ` · Языки: ${d.languages.join(', ')}` : ''}</p>
                {d.about && <p className="text-sm text-gray-500 mt-1">{d.about}</p>}
              </div>

                            {d.status === 'approved' && (
                <PasswordSetter type="driver" id={d.id} secret={secret} />
              )}

              <select
                value={d.status}
                onChange={e => updateStatus('driver', d.id, e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none"
              >
                {Object.entries(APP_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {data && tab === 'guides' && (
        <div className="space-y-3">
          {data.guides.length === 0 && <p className="text-sm text-gray-500">Пока нет анкет</p>}
          {data.guides.map((g: any) => (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{g.full_name} <span className="text-sm font-normal text-gray-500">· {g.phone}</span></p>
                <p className="text-sm text-gray-600 mt-1">🌐 {g.languages?.join(', ')}{g.specialization ? ` · ${g.specialization}` : ''}</p>
                <p className="text-sm text-gray-600">Стаж: {g.experience_years} лет</p>
                {g.about && <p className="text-sm text-gray-500 mt-1">{g.about}</p>}
              </div>

                           {g.status === 'approved' && (
                <PasswordSetter type="guide" id={g.id} secret={secret} />
              )}

              <select
                value={g.status}
                onChange={e => updateStatus('guide', g.id, e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none"
              >
                {Object.entries(APP_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}