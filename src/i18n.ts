import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // Only languages with a translation file. Without this, i18next requests
    // /locales/<any>/common.json for whatever the browser reports, 404s, and
    // silently renders English as if it were a translation.
    supportedLngs: ['en', 'fil'],
    load: 'languageOnly',
    debug: import.meta.env.DEV,
    defaultNS: 'common',
    ns: ['common'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
