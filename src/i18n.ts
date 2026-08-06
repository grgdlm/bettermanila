import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { SUPPORTED_LANGUAGE_CODES } from './i18n/languages';

// Keep the document language attribute in step with the active language, so
// screen readers switch pronunciation rules when the reader switches to
// Filipino. index.html ships lang="en" and nothing else would update it.
i18n.on('languageChanged', lng => {
  document.documentElement.lang = lng;
});

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // Only languages with a translation file. Without this, i18next requests
    // /locales/<any>/common.json for whatever the browser reports, 404s, and
    // silently renders English as if it were a translation.
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
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
