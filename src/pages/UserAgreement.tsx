import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function UserAgreement({ onBack }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> На главную
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Пользовательское соглашение</h1>
        
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Общие положения</h2>
            <p>Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между сервисом NomadWay (далее — «Сервис») и пользователями (далее — «Пользователь») при использовании сайта и услуг Сервиса.</p>
            <p>Используя Сервис, Пользователь подтверждает, что ознакомился с условиями настоящего Соглашения и принимает их полностью и без ограничений.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Описание услуг</h2>
            <p>NomadWay предоставляет следующие услуги:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Бронирование трансферных услуг в Кыргызстане</li>
              <li>Поиск и выбор водителей для перевозки</li>
              <li>Поиск и выбор гидов-переводчиков</li>
              <li>Организация междугородних и горных маршрутов</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Права и обязанности Пользователя</h2>
            <p>Пользователь обязуется:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Предоставлять достоверную информацию при бронировании</li>
              <li>Своевременно оплачивать выбранные услуги</li>
              <li>Соблюдать правила поведения во время поездки</li>
              <li>Уважительно относиться к водителям и гидам</li>
              <li>Не использовать Сервис в незаконных целях</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Права и обязанности Сервиса</h2>
            <p>Сервис обязуется:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Предоставлять актуальную информацию о доступных услугах</li>
              <li>Обеспечивать техническую поддержку Пользователям</li>
              <li>Защищать персональные данные Пользователей</li>
              <li>Своевременно обрабатывать бронирования</li>
            </ul>
            <p>Сервис оставляет за собой право отказать в обслуживании в случае нарушения Пользователем условий настоящего Соглашения.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Оплата и отмена бронирования</h2>
            <p>Оплата услуг производится в соответствии с выбранным тарифом. Отмена бронирования возможна не позднее чем за 24 часа до начала поездки без взимания штрафных санкций. При отмене менее чем за 24 часа может взиматься комиссия в размере до 50% от стоимости заказа.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Ответственность сторон</h2>
            <p>Сервис не несёт ответственности за:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Задержки, вызванные погодными условиями или дорожной обстановкой</li>
              <li>Действия третьих лиц, не находящихся под контролем Сервиса</li>
              <li>Технические сбои, вызванные форс-мажорными обстоятельствами</li>
            </ul>
            <p>Пользователь несёт ответственность за сохранность личных вещей во время поездки.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Разрешение споров</h2>
            <p>Все споры и разногласия решаются путём переговоров. В случае невозможности достижения соглашения споры подлежат рассмотрению в соответствии с законодательством Кыргызской Республики.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Изменение условий</h2>
            <p>Сервис оставляет за собой право вносить изменения в настоящее Соглашение. Новая редакция вступает в силу с момента её публикации на сайте.</p>
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