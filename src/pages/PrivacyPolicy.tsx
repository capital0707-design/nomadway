import { ArrowLeft } from 'lucide-react';
import { useLang } from '../lib/i18n';

interface Props {
  onBack: () => void;
}

const content = {
  ru: {
    back: 'На главную',
    title: 'Политика конфиденциальности',
    s1: { title: '1. Общие положения', p1: 'Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сервиса NomadWay (далее — «Сервис»).', p2: 'Используя Сервис, вы соглашаетесь с условиями настоящей Политики.' },
    s2: { title: '2. Какие данные мы собираем', intro: 'Мы собираем следующие категории данных:', list: ['<b>Персональные данные:</b> имя, номер телефона, email', '<b>Данные о поездках:</b> маршруты, даты, количество пассажиров', '<b>Технические данные:</b> IP-адрес, тип браузера, операционная система', '<b>Платёжные данные:</b> информация о транзакциях (не храним данные банковских карт)'] },
    s3: { title: '3. Цели обработки данных', intro: 'Мы используем ваши данные для:', list: ['Обработки и подтверждения бронирований', 'Связи с вами по вопросам заказов', 'Улучшения качества услуг', 'Анализа использования Сервиса', 'Выполнения требований законодательства'] },
    s4: { title: '4. Передача данных третьим лицам', intro: 'Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:', list: ['Водителей и гидов, необходимых для выполнения вашего заказа (имя, телефон, маршрут)', 'Платёжных систем для обработки транзакций', 'Государственных органов по их законному требованию'] },
    s5: { title: '5. Хранение данных', p1: 'Персональные данные хранятся на защищённых серверах в течение срока, необходимого для выполнения целей обработки, но не более 5 лет с момента последнего использования Сервиса.' },
    s6: { title: '6. Защита данных', intro: 'Мы применяем следующие меры защиты:', list: ['Шифрование данных при передаче (SSL/TLS)', 'Ограничение доступа к персональным данным', 'Регулярное резервное копирование', 'Мониторинг безопасности систем'] },
    s7: { title: '7. Права пользователя', intro: 'Вы имеете право:', list: ['Получить информацию о том, какие данные мы о вас храним', 'Запросить исправление неточных данных', 'Запросить удаление ваших данных', 'Отозвать согласие на обработку данных'], outro: 'Для реализации этих прав напишите нам на info@nomadway.kg' },
    s8: { title: '8. Cookies', p1: 'Мы используем cookies для улучшения работы сайта. Вы можете отключить cookies в настройках браузера, но это может повлиять на функциональность Сервиса.' },
    s9: { title: '9. Изменения Политики', p1: 'Мы можем обновлять настоящую Политику. Новая редакция вступает в силу с момента публикации на сайте. Мы уведомим вас о существенных изменениях по email.' },
    updated: 'Последнее обновление: 8 августа 2026 года',
    contact: 'По всем вопросам обращайтесь: info@nomadway.kg, +996 (312) 123-456',
  },
  en: {
    back: 'Back to Home',
    title: 'Privacy Policy',
    s1: { title: '1. General Provisions', p1: 'This Privacy Policy (hereinafter referred to as the "Policy") defines the procedure for processing and protecting personal data of users of the NomadWay service (hereinafter referred to as the "Service").', p2: 'By using the Service, you agree to the terms of this Policy.' },
    s2: { title: '2. What Data We Collect', intro: 'We collect the following categories of data:', list: ['<b>Personal data:</b> name, phone number, email', '<b>Trip data:</b> routes, dates, number of passengers', '<b>Technical data:</b> IP address, browser type, operating system', '<b>Payment data:</b> transaction information (we do not store bank card data)'] },
    s3: { title: '3. Purposes of Data Processing', intro: 'We use your data for:', list: ['Processing and confirming bookings', 'Contacting you regarding orders', 'Improving the quality of services', 'Analyzing the use of the Service', 'Compliance with legal requirements'] },
    s4: { title: '4. Disclosure to Third Parties', intro: 'We do not sell or disclose your personal data to third parties, except:', list: ['Drivers and guides necessary to fulfill your order (name, phone, route)', 'Payment systems for processing transactions', 'Government agencies upon their lawful request'] },
    s5: { title: '5. Data Storage', p1: 'Personal data is stored on secure servers for the period necessary to fulfill the purposes of processing, but not more than 5 years from the last use of the Service.' },
    s6: { title: '6. Data Protection', intro: 'We apply the following protection measures:', list: ['Data encryption during transmission (SSL/TLS)', 'Restricted access to personal data', 'Regular backup', 'Security monitoring of systems'] },
    s7: { title: '7. User Rights', intro: 'You have the right to:', list: ['Obtain information about what data we store about you', 'Request correction of inaccurate data', 'Request deletion of your data', 'Withdraw consent to data processing'], outro: 'To exercise these rights, write to us at info@nomadway.kg' },
    s8: { title: '8. Cookies', p1: 'We use cookies to improve the functionality of the website. You can disable cookies in your browser settings, but this may affect the functionality of the Service.' },
    s9: { title: '9. Changes to the Policy', p1: 'We may update this Policy. The new version comes into force from the moment of publication on the website. We will notify you of significant changes by email.' },
    updated: 'Last updated: August 8, 2026',
    contact: 'For all inquiries, contact: info@nomadway.kg, +996 (312) 123-456',
  },
};

export default function PrivacyPolicy({ onBack }: Props) {
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
              {c.s2.list.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
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
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s7.title}</h2>
            <p>{c.s7.intro}</p>
            <ul className="list-disc pl-6 space-y-1">
              {c.s7.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <p>{c.s7.outro}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s8.title}</h2>
            <p>{c.s8.p1}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.s9.title}</h2>
            <p>{c.s9.p1}</p>
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