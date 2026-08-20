import { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, Users, Banknote, Phone, CheckCircle, XCircle, Clock, ArrowLeft, LogOut } from 'lucide-react';
import { fetchDriverBookings, acceptBooking, completeBooking, login, logout, getCurrentRole } from '../lib/backendApi';
import type { Booking } from '../lib/types';

interface Props {
  onBack: () => void;
}

export default function DriverDashboard({ onBack }: Props) {
  const [user, setUser] = useState<{ id: string; name: string; phone: string } | null>(() => {
    try {
      const raw = localStorage.getItem('driver_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'my' | 'completed'>('new');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchDriverBookings();
      setBookings(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const u = await login('driver', phone, password);
      setUser(u);
      setPhone('');
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Ошибка входа');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout('driver');
    setUser(null);
    setBookings([]);
  };

  const handleAccept = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await acceptBooking(bookingId);
      await loadBookings();
    } catch (err) {
      alert('Не удалось принять заказ. Попробуйте снова.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (bookingId: string) => {
    if (!confirm('Подтвердить завершение поездки?')) return;
    setActionLoading(bookingId);
    try {
      await completeBooking(bookingId);
      await loadBookings();
    } catch (err) {
      alert('Ошибка при завершении заказа.');
    } finally {
      setActionLoading(null);
    }
  };

  // ===== Экран входа =====
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> На главную
        </button>
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <Car className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Кабинет водителя</h1>
          <p className="text-sm text-gray-500 mb-6">Вход для зарегистрированных водителей</p>

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Телефон</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+996 700 123456"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 mb-4"
            required
          />

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 mb-3"
            required
          />

          {loginError && <p className="text-sm text-red-500 mb-3">{loginError}</p>}

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98]"
          >
            {loggingIn ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    );
  }

  // ===== Кабинет =====
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'new') return !b.driver_id && b.status !== 'completed';
    if (activeTab === 'my') return b.driver_id === user.id && b.status === 'accepted';
    if (activeTab === 'completed') return b.driver_id === user.id && b.status === 'completed';
    return true;
  });

  const tabs = [
    { id: 'new', label: 'Новые', count: bookings.filter(b => !b.driver_id && b.status !== 'completed').length },
    { id: 'my', label: 'Мои активные', count: bookings.filter(b => b.driver_id === user.id && b.status === 'accepted').length },
    { id: 'completed', label: 'Завершённые', count: bookings.filter(b => b.driver_id === user.id && b.status === 'completed').length },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> На главную
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Панель водителя</h1>
          <p className="text-sm text-gray-500">Добро пожаловать, {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadBookings} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            🔄 Обновить
          </button>
          <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              activeTab === tab.id ? 'text-primary-700 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-primary-200 text-primary-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Загрузка заказов...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Пока нет заказов в этой категории</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      activeTab === 'new' ? 'bg-green-100 text-green-700' :
                      activeTab === 'my' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {activeTab === 'new' ? 'Новый заказ' : activeTab === 'my' ? 'В работе' : 'Завершён'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(booking.pickup_date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      <div className="w-0.5 h-6 bg-gray-200" />
                      <div className="w-2 h-2 rounded-full bg-accent-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Откуда: <span className="font-normal text-gray-600">{(booking as any).from_name || booking.from_location_id}</span></p>
                      <p className="text-sm font-medium text-gray-900">Куда: <span className="font-normal text-gray-600">{(booking as any).to_name || booking.to_location_id}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {booking.tourist_count} чел.</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {booking.pickup_time}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-gray-900"><Banknote className="w-4 h-4" /> {booking.total_price} сом</span>
                  </div>
                  {booking.user_phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-1">
                      <Phone className="w-4 h-4" /> {booking.user_phone} {booking.user_name && `(${booking.user_name})`}
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 sm:min-w-[140px]">
                  {activeTab === 'new' && (
                    <button
                      onClick={() => handleAccept(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                    >
                      {actionLoading === booking.id ? '...' : <><CheckCircle className="w-4 h-4" /> Принять</>}
                    </button>
                  )}
                  {activeTab === 'my' && (
                    <button
                      onClick={() => handleComplete(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                    >
                      {actionLoading === booking.id ? '...' : <><CheckCircle className="w-4 h-4" /> Завершить</>}
                    </button>
                  )}
                  {activeTab === 'completed' && (
                    <div className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-500 text-sm font-medium py-2.5 px-4 rounded-lg">
                      <CheckCircle className="w-4 h-4" /> Выполнено
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}