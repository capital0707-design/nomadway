import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> На главную
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Политика конфиденциальности</h1>
        
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Общие положения</h2>
            <p>Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сервиса NomadWay (далее — «Сервис»).</p>
            <p>Используя Сервис, вы соглашаетесь с условиями настоящей Политики.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Какие данные мы собираем</h2>
            <p>Мы собираем следующие категории данных:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Персональные данные:</strong> имя, номер телефона, email</li>
              <li><strong>Данные о поездках:</strong> маршруты, даты, количество пассажиров</li>
              <li><strong>Технические данные:</strong> IP-адрес, тип браузера, операционная система</li>
              <li><strong>Платёжные данные:</strong> информация о транзакциях (не храним данные банковских карт)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Цели обработки данных</h2>
            <p>Мы используем ваши данные для:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Обработки и подтверждения бронирований</li>
              <li>Связи с вами по вопросам заказов</li>
              <li>Улучшения качества услуг</li>
              <li>Анализа использования Сервиса</li>
              <li>Выполнения требований законодательства</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Передача данных третьим лицам</h2>
            <p>Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Водителей и гидов, необходимых для выполнения вашего заказа (имя, телефон, маршрут)</li>
              <li>Платёжных систем для обработки транзакций</li>
              <li>Государственных органов по их законному требованию</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Хранение данных</h2>
            <p>Персональные данные хранятся на защищённых серверах в течение срока, необходимого для выполнения целей обработки, но не более 5 лет с момента последнего использования Сервиса.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Защита данных</h2>
            <p>Мы применяем следующие меры защиты:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Шифрование данных при передаче (SSL/TLS)</li>
              <li>Ограничение доступа к персональным данным</li>
              <li>Регулярное резервное копирование</li>
              <li>Мониторинг безопасности систем</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Права пользователя</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Получить информацию о том, какие данные мы о вас храним</li>
              <li>Запросить исправление неточных данных</li>
              <li>Запросить удаление ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
            <p>Для реализации этих прав напишите нам на info@nomadway.kg</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Cookies</h2>
            <p>Мы используем cookies для улучшения работы сайта. Вы можете отключить cookies в настройках браузера, но это может повлиять на функциональность Сервиса.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Изменения Политики</h2>
            <p>Мы можем обновлять настоящую Политику. Новая редакция вступает в силу с момента публикации на сайте. Мы уведомим вас о существенных изменениях по email.</p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Последнее обновление: 8 августа 2026 года</p>
            <p>По всем вопросам обращайтесь: info@nomadway.kg, +996 (312) 123-456</p>
          </div>
        </div>
      </div>
    </div>
  );
}