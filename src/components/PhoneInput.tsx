import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
  code: string;
  dial: string;
  flag: string;
  name: string;
  mask: string;
}

const COUNTRIES: Country[] = [
  { code: 'KG', dial: '+996', flag: '🇰🇬', name: 'Кыргызстан', mask: '### ## ## ##' },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Россия', mask: '### ### ## ##' },
  { code: 'KZ', dial: '+7', flag: '🇰🇿', name: 'Казахстан', mask: '### ### ## ##' },
  { code: 'UZ', dial: '+998', flag: '🇺🇿', name: 'Узбекистан', mask: '## ### ## ##' },
  { code: 'TJ', dial: '+992', flag: '🇹🇯', name: 'Таджикистан', mask: '## ### ####' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'США', mask: '(###) ###-####' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Англия', mask: '#### ######' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Германия', mask: '#### #######' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'Франция', mask: '# ## ## ## ##' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Турция', mask: '### ### ## ##' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'Китай', mask: '### #### ####' },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function applyMask(digits: string, mask: string): string {
  let result = '';
  let d = 0;
  for (let i = 0; i < mask.length && d < digits.length; i++) {
    if (mask[i] === '#') {
      result += digits[d];
      d++;
    } else {
      result += mask[i];
    }
  }
  return result;
}

function stripNonDigits(s: string): string {
  return s.replace(/\D/g, '');
}

function getMaskLength(mask: string): number {
  return mask.split('').filter(c => c === '#').length;
}

function PhoneInput({ value, onChange, error }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Country>(COUNTRIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = useCallback((country: Country) => {
    setSelected(country);
    setIsOpen(false);
    const dialSpace = selected.dial + ' ';
    let localPart = value;
    if (value.startsWith(dialSpace)) localPart = value.slice(dialSpace.length);
    else if (value.startsWith(selected.dial)) localPart = value.slice(selected.dial.length);
    const digits = stripNonDigits(localPart);
    const maxLen = getMaskLength(country.mask);
    const trimmed = digits.slice(0, maxLen);
    const newFormatted = trimmed ? applyMask(trimmed, country.mask) : '';
    onChange(country.dial + (newFormatted ? ' ' + newFormatted : ''));
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value, selected, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = stripNonDigits(raw);
    const maxLen = getMaskLength(selected.mask);
    const trimmed = digits.slice(0, maxLen);
    const formatted = trimmed ? applyMask(trimmed, selected.mask) : '';
    onChange(selected.dial + (formatted ? ' ' + formatted : ''));
  }, [selected, onChange]);

  const dialSpace = selected.dial + ' ';
  const displayValue = (() => {
    if (value.startsWith(dialSpace)) return value.slice(dialSpace.length);
    if (value.startsWith(selected.dial)) return value.slice(selected.dial.length).trim();
    return value;
  })();

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Телефон</label>
      <div className="flex">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm hover:bg-gray-100 transition-colors ${
              error ? 'border-red-300' : ''
            }`}
          >
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="font-medium text-gray-700">{selected.dial}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden">
              <div className="max-h-64 overflow-y-auto py-1">
                {COUNTRIES.map(c => (
                  <button
                    key={c.code + c.dial}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      selected.code === c.code && selected.dial === c.dial ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 text-left">{c.name}</span>
                    <span className="text-gray-400 text-xs">{c.dial}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="tel"
            value={displayValue}
            onChange={handleInputChange}
            placeholder={selected.mask.replace(/#/g, '0')}
            className={`w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all ${
              error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''
            }`}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default PhoneInput;
export { COUNTRIES, stripNonDigits, getMaskLength };
