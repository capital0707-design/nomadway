import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'ru' | 'en';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Header
    'header.brand': 'NomadWay',
    'header.brand.alt': 'Кыргызстан',
    'nav.route': 'Маршрут',
    'nav.selection': 'Выбор',
    'nav.confirmation': 'Подтверждение',

    // Hero
    'hero.title': 'Трансферы по Кыргызстану',
    'hero.subtitle': 'Надёжные трансферы из аэропорта, междугородние перевозки и гиды-переводчики',

    // Search form
    'search.title': 'Найти трансфер',
    'search.from': 'Откуда',
    'search.to': 'Куда',
    'search.placeholder': 'Выберите пункт',
    'search.airports': 'Аэропорты',
    'search.cities': 'Города и посёлки',
    'search.tourists': 'Туристов',
    'search.date': 'Дата',
    'search.time': 'Время подачи',
    'search.vehicleType': 'Тип авто',
    'search.guideLang': 'Язык гида',
    'search.submit': 'Найти трансфер',

    // Vehicle categories
    'vehicle.sedan': 'Легковые',
    'vehicle.minivan': 'Минивэны',
    'vehicle.suv': 'Джипы',
    'vehicle.minibus': 'Микроавтобусы',

    // Guide languages
    'guide.english': 'Английский',
    'guide.german': 'Немецкий',
    'guide.japanese': 'Японский',
    'guide.chinese': 'Китайский',
    'guide.korean': 'Корейский',

    // Results
    'results.backToSearch': 'Новый поиск',
    'results.distance': 'км',
    'results.people': 'чел.',

    // Vehicle selection
    'vehicleSelect.title': 'Выберите автомобиль',
    'vehicleSelect.all': 'Все доступные автомобили',
    'vehicleSelect.shown': 'Показаны:',
    'vehicleSelect.none': 'Автомобили не найдены для указанных параметров',
    'vehicleSelect.selected': 'Выбрано',
    'vehicleSelect.recommended': 'Рекомендуем',
    'vehicleSelect.insufficientCapacity': 'Мало мест',
    'vehicleSelect.trips': 'поездок',
    'vehicleSelect.upTo': 'до',

    // Route indicators
    'route.mountain': 'Горный маршрут',
    'route.airport': 'Трансфер в аэропорт',
    'route.group': 'Группа',
    'route.from': 'от',

    // Vehicle recommendations
    'recommend.mountain': 'Рекомендуется для горных маршрутов',
    'recommend.group': 'Оптимально для группы',
    'recommend.city': 'Экономно для трансфера в аэропорт',
    'recommend.capacity': 'Идеально по вместимости',

    // Guide selection
    'guideSelect.title': 'Выберите гида-переводчика',
    'guideSelect.subtitle': 'Гид — по желанию, вы можете продолжить без него',
    'guideSelect.shown': 'Показаны гиды:',
    'guideSelect.noGuide': 'Без гида',
    'guideSelect.noGuideDesc': 'Только трансфер без сопровождающего',
    'guideSelect.none': 'Гиды не найдены',
    'guideSelect.back': 'К выбору авто',
    'guideSelect.hours': 'ч',

    // Booking details
    'details.title': 'Оформление заказа',
    'details.subtitle': 'Заполните контактные данные',
    'details.contactInfo': 'Контактная информация',
    'details.name': 'Имя',
    'details.namePlaceholder': 'Ваше полное имя',
    'details.phone': 'Телефон',
    'details.email': 'Email',
    'details.orderDetails': 'Детали заказа',
    'details.vehicle': 'Автомобиль',
    'details.driver': 'Водитель',
    'details.route': 'Маршрут',
    'details.datetime': 'Дата и время',
    'details.tourists': 'Туристов',
    'details.guide': 'Гид',
    'details.cost': 'Стоимость',
    'details.transport': 'Транспорт',
    'details.total': 'Итого',
    'details.currency': 'сом',
    'details.submit': 'Забронировать',
    'details.secure': 'Безопасная оплата',
    'details.instant': 'Мгновенное подтверждение',
    'details.back': 'Назад к выбору',

    // Validation errors
    'error.nameRequired': 'Укажите имя',
    'error.nameLetters': 'Имя может содержать только буквы',
    'error.nameMin': 'Минимум 2 символа',
    'error.phoneRequired': 'Укажите телефон',
    'error.phoneComplete': 'Введите полный номер',
    'error.emailRequired': 'Укажите email',
    'error.emailInvalid': 'Введите корректный email (например: name@mail.com)',
    'error.digits': 'цифр',

    // Confirmation
    'confirmation.title': 'Бронирование подтверждено!',
    'confirmation.id': 'Номер брони',
    'confirmation.thankYou': 'Спасибо за выбор NomadWay',
    'confirmation.details': 'Детали поездки',
    'confirmation.from': 'Откуда',
    'confirmation.to': 'Куда',
    'confirmation.date': 'Дата',
    'confirmation.time': 'Время',
    'confirmation.vehicle': 'Автомобиль',
    'confirmation.driver': 'Водитель',
    'confirmation.guide': 'Гид',
    'confirmation.price': 'Стоимость',
    'confirmation.newSearch': 'Новый поиск',
    'confirmation.contactSoon': 'Мы свяжемся с вами для подтверждения деталей',

    // Footer
    'footer.services': 'Услуги',
    'footer.airport': 'Трансфер аэропорт-отель',
    'footer.intercity': 'Междугородние перевозки',
    'footer.guides': 'Гиды-переводчики',
    'footer.mountains': 'Горные маршруты',
    'footer.contacts': 'Контакты',
    'footer.hours': 'Работаем 24/7',
    'footer.copyright': 'NomadWay — трансферные услуги в Кыргызстане',
    'footer.description': 'Надёжные трансферные услуги по всему Кыргызстану. Встреча в аэропорту, междугородние перевозки, гиды-переводчики.',

         // Legal & Partners
    'footer.legal': 'Правовая информация',
    'footer.terms': 'Пользовательское соглашение',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.partners': 'Партнёрам',
    'footer.becomeDriver': 'Стать водителем',
    'footer.driverDashboard': 'Кабинет водителя →',
    'footer.becomeGuide': 'Стать гидом-переводчиком',
    'footer.guideDashboard': 'Кабинет гида →',
    'footer.copyright': 'Copyright © 2026 NomadWay. Все права защищены.',
  },
  en: {
    // Header
    'header.brand': 'NomadWay',
    'header.brand.alt': 'Kyrgyzstan',
    'nav.route': 'Route',
    'nav.selection': 'Selection',
    'nav.confirmation': 'Confirmation',

    // Hero
    'hero.title': 'Transfers in Kyrgyzstan',
    'hero.subtitle': 'Reliable airport transfers, intercity trips, and translator guides',

    // Search form
    'search.title': 'Find a transfer',
    'search.from': 'From',
    'search.to': 'To',
    'search.placeholder': 'Select location',
    'search.airports': 'Airports',
    'search.cities': 'Cities and towns',
    'search.tourists': 'Tourists',
    'search.date': 'Date',
    'search.time': 'Pickup time',
    'search.vehicleType': 'Vehicle type',
    'search.guideLang': 'Guide language',
    'search.submit': 'Find transfer',

    // Vehicle categories
    'vehicle.sedan': 'Sedans',
    'vehicle.minivan': 'Minivans',
    'vehicle.suv': 'SUVs',
    'vehicle.minibus': 'Minibuses',

    // Guide languages
    'guide.english': 'English',
    'guide.german': 'German',
    'guide.japanese': 'Japanese',
    'guide.chinese': 'Chinese',
    'guide.korean': 'Korean',

    // Results
    'results.backToSearch': 'New search',
    'results.distance': 'km',
    'results.people': 'ppl',

    // Vehicle selection
    'vehicleSelect.title': 'Select vehicle',
    'vehicleSelect.all': 'All available vehicles',
    'vehicleSelect.shown': 'Showing:',
    'vehicleSelect.none': 'No vehicles found for selected parameters',
    'vehicleSelect.selected': 'Selected',
    'vehicleSelect.recommended': 'Recommended',
    'vehicleSelect.insufficientCapacity': 'Not enough seats',
    'vehicleSelect.trips': 'trips',
    'vehicleSelect.upTo': 'up to',

    // Route indicators
    'route.mountain': 'Mountain route',
    'route.airport': 'Airport transfer',
    'route.group': 'Group',
    'route.from': 'from',

    // Vehicle recommendations
    'recommend.mountain': 'Recommended for mountain routes',
    'recommend.group': 'Optimal for groups',
    'recommend.city': 'Economical for airport transfer',
    'recommend.capacity': 'Perfect capacity match',

    // Guide selection
    'guideSelect.title': 'Select a guide-translator',
    'guideSelect.subtitle': 'Guide is optional — you can continue without one',
    'guideSelect.shown': 'Showing guides:',
    'guideSelect.noGuide': 'Without guide',
    'guideSelect.noGuideDesc': 'Transfer only, no accompanying guide',
    'guideSelect.none': 'No guides found',
    'guideSelect.back': 'Back to vehicle selection',
    'guideSelect.hours': 'h',

    // Booking details
    'details.title': 'Booking details',
    'details.subtitle': 'Fill in contact information',
    'details.contactInfo': 'Contact information',
    'details.name': 'Name',
    'details.namePlaceholder': 'Your full name',
    'details.phone': 'Phone',
    'details.email': 'Email',
    'details.orderDetails': 'Order details',
    'details.vehicle': 'Vehicle',
    'details.driver': 'Driver',
    'details.route': 'Route',
    'details.datetime': 'Date and time',
    'details.tourists': 'Tourists',
    'details.guide': 'Guide',
    'details.cost': 'Cost',
    'details.transport': 'Transport',
    'details.total': 'Total',
    'details.currency': 'KGS',
    'details.submit': 'Book now',
    'details.secure': 'Secure payment',
    'details.instant': 'Instant confirmation',
    'details.back': 'Back to selection',

    // Validation errors
    'error.nameRequired': 'Enter your name',
    'error.nameLetters': 'Name can only contain letters',
    'error.nameMin': 'Minimum 2 characters',
    'error.phoneRequired': 'Enter phone number',
    'error.phoneComplete': 'Enter complete number',
    'error.emailRequired': 'Enter email',
    'error.emailInvalid': 'Enter a valid email (e.g.: name@mail.com)',
    'error.digits': 'digits',

    // Confirmation
    'confirmation.title': 'Booking confirmed!',
    'confirmation.id': 'Booking number',
    'confirmation.thankYou': 'Thank you for choosing NomadWay',
    'confirmation.details': 'Trip details',
    'confirmation.from': 'From',
    'confirmation.to': 'To',
    'confirmation.date': 'Date',
    'confirmation.time': 'Time',
    'confirmation.vehicle': 'Vehicle',
    'confirmation.driver': 'Driver',
    'confirmation.guide': 'Guide',
    'confirmation.price': 'Price',
    'confirmation.newSearch': 'New search',
    'confirmation.contactSoon': 'We will contact you to confirm the details',

    // Footer
    'footer.services': 'Services',
    'footer.airport': 'Airport-hotel transfer',
    'footer.intercity': 'Intercity transfers',
    'footer.guides': 'Guide-translators',
    'footer.mountains': 'Mountain routes',
    'footer.contacts': 'Contacts',
    'footer.hours': 'Available 24/7',
    'footer.copyright': 'NomadWay — transfer services in Kyrgyzstan',
    'footer.description': 'Reliable transfer services throughout Kyrgyzstan. Airport pickup, intercity transportation, guide-translators.',

        // Legal & Partners
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.partners': 'Partners',
    'footer.becomeDriver': 'Become a driver',
    'footer.driverDashboard': 'Driver dashboard →',
    'footer.becomeGuide': 'Become a guide',
    'footer.guideDashboard': 'Guide dashboard →',
    'footer.copyright': 'Copyright © 2026 NomadWay. All rights reserved.',
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ru');

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}

export function useLang() {
  const { lang } = useTranslation();
  return lang;
}
