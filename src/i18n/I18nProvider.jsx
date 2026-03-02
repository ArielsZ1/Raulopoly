import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import es from './locales/es/translation.json';
import en from './locales/en/translation.json';

const STORAGE_KEY = 'raulopolyLanguage';
const resources = { es, en };
const fallbackLng = 'es';

const I18nContext = createContext(null);

const getByPath = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);
const interpolate = (template, options) => template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
  const value = options[key];
  return value === undefined || value === null ? '' : String(value);
});

const getInitialLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && resources[stored]) return stored;

  const browserLang = navigator.language?.split('-')[0];
  return resources[browserLang] ? browserLang : fallbackLng;
};

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key, options = {}) => {
    const value = getByPath(resources[language], key) ?? getByPath(resources[fallbackLng], key);
    if (options.returnObjects) return value;
    if (typeof value !== 'string') {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing key: "${key}"`);
      }
      return key;
    }
    if (typeof value !== 'string') return key;
    return interpolate(value, options);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
