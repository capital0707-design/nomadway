import { ArrowLeft } from 'lucide-react';
import { useLang, useTranslation } from '../lib/i18n';

interface Props {
  onBack: () => void;
}

const content = {
  ru: {
    back: 'На главную',
    title: 'Пользовательское соглашение',
    s1: { title: '1. Общие положения', p1: 'Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между сервисом NomadWay (далее — «Сервис») и пользователями (далее — «Пользователь») при использовании сайта и услуг Сервиса.', p2: 'Используя Сервис, Пользователь подтверждает, что ознакомился с условиями настоящего Соглашения и принимает их полностью и без ограничений.' },
    s2: { title: '2. Описание услуг', intro: 'NomadWay предоставляет следующие услуги:', list: ['Бронирование трансферных услуг в Кыргызстане', 'Поиск и выбор водителей для перевозки', 'Поиск и выбор гидов-переводчиков', 'Организация междугородних и горных маршрутов'] },
    s3: { title: '3. Права и обязанности Пользователя', intro: 'Пользователь обязуется:', list: ['Предоставлять достоверную информацию при бронировании', 'Своевременно оплачивать выбранные услуги', 'Соблюдать правила поведения во время поездки', 'Уважительно относиться к водителям и гидам', 'Не использовать Сервис в незаконных целях'] },
    s4: { title: '4. Права и обязанности Сервиса', intro: 'Сервис обязуется:', list: ['Предоставлять актуальную информацию о доступных услугах', 'Обеспечивать техническую поддержку Пользователям', 'Защищать персональные данные Пользователей', 'Своевременно обрабатывать бронирования'], outro: 'Сервис оставляет за собой право отказать в обслуживании в случае нарушения Пользователем условий настоящего Соглашения.' },
    s5: { title: '5. Оплата и отмена бронирования', p1: 'Оплата услуг производится в соответствии с выбранным тарифом. Отмена бронирования возможна не позднее чем за 24 часа до начала поездки без взимания штрафных санкций. При отмене менее чем за 24 часа может взиматься комиссия в размере до 50% от стоимости заказа.' },
    s6: { title: '6. Ответственность сторон', intro: 'Сервис не несёт ответственности за:', list: ['Задержки, вызванные погодными условиями или дорожной обстановкой', 'Действия третьих лиц, не находящихся под контролем Сервиса', 'Технические сбои, вызванные форс-мажорными обстоятельствами'], outro: 'Пользователь несёт ответственность за сохранность личных вещей во время поездки.' },
    s7: { title: '7. Разрешение споров', p1: 'Все споры и разногласия решаются путём переговоров. В случае невозможности достижения соглашения споры подлежат рассмотрению в соответствии с законодательством Кыргызской Республики.' },
    s8: { title: '8. Изменение условий', p1: 'Сервис оставляет за собой право вносить изменения в настоящее Соглашение. Новая редакция вступает в силу с момента её публикации на сайте.' },
    updated: 'Последнее обновление: 8 августа 2026 года',
    contact: 'По всем вопросам обращайтесь: info@nomadway.kg, +996 (312) 123-456',
  },
  en: {
    back: 'Back to Home',
    title: 'Terms of Service',
    s1: { title: '1. General Provisions', p1: 'These Terms of Service (hereinafter referred to as the "Agreement") govern the relationship between the NomadWay service (hereinafter referred to as the "Service") and users (hereinafter referred to as the "User") when using the website and services of the Service.', p2: 'By using the Service, the User confirms that they have read the terms of this Agreement and accept them in full and without limitation.' },
    s2: { title: '2. Description of Services', intro: 'NomadWay provides the following services:', list: ['Booking transfer services in Kyrgyzstan', 'Search and selection of drivers for transportation', 'Search and selection of guide-translators', 'Organization of intercity and mountain routes'] },
    s3: { title: '3. User Rights and Obligations', intro: 'The User undertakes to:', list: ['Provide accurate information when booking', 'Pay for selected services in a timely manner', 'Comply with rules of conduct during the trip', 'Treat drivers and guides with respect', 'Not use the Service for illegal purposes'] },
    s4: { title: '4. Service Rights and Obligations', intro: 'The Service undertakes to:', list: ['Provide up-to-date information about available services', 'Provide technical support to Users', 'Protect Users\' personal data', 'Process bookings in a timely manner'], outro: 'The Service reserves the right to refuse service in case of violation by the User of the terms of this Agreement.' },
    s5: { title: '5. Payment and Booking Cancellation', p1: 'Payment for services is made in accordance with the selected tariff. Booking cancellation is possible no later than 24 hours before the start of the trip without penalty. If cancelled less than 24 hours in advance, a fee of up to 50% of the order value may be charged.' },
    s6: { title: '6. Liability of the Parties', intro: 'The Service is not liable for:', list: ['Delays caused by weather conditions or road conditions', 'Actions of third parties not under the control of the Service', 'Technical failures caused by force majeure circumstances'], outro: 'The User is responsible for the safety of personal belongings during the trip.' },
    s7: { title: '7. Dispute Resolution', p1: 'All disputes and disagreements are resolved through negotiations. If it is impossible to reach an agreement, disputes are subject to consideration in accordance with the legislation of the Kyrgyz Republic.' },
    s8: { title: '8. Changes to Terms', p1: 'The Service reserves the right to make changes to this Agreement. The new version comes into force from the moment of its publication on the website.' },
    updated: 'Last updated: August 8, 2026',
    contact: 'For all inquiries, contact: info@nomadway.kg, +996 (312) 123-456',
  },
};

export default function UserAgreement({ onBack }: Props) {
  const lang = useLang();
  const c = content[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> {c.back}
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{c.title}</h1>
        
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s1.title}</h2>
            <p>{c.s1.p1}</p>
            <p>{c.s1.p2}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s2.title}</h2>
            <p>{c.s2.intro}</p>
            <ul className="list-disc pl-6 space-y-1">
              {c.s2.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s3.title}</h2>
            <p>{c.s3.intro}</p>
            <ul className="list-disc pl-6 space-y-1">
              {c.s3.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s4.title}</h2>
            <p>{c.s4.intro}</p>
            <ul className="list-disc pl-6 space-y-1">
              {c.s4.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <p>{c.s4.outro}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s5.title}</h2>
            <p>{c.s5.p1}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s6.title}</h2>
            <p>{c.s6.intro}</p>
            <ul className="list-disc pl-6 space-y-1">
              {c.s6.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <p>{c.s6.outro}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s7.title}</h2>
            <p>{c.s7.p1}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s8.title}</h2>
            <p>{c.s8.p1}</p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>{c.updated}</p>
            <p>{c.contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}