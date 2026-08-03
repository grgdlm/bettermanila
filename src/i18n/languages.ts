import type { LanguageType } from '../types';

export interface LanguageInfo {
  code: LanguageType;
  name: string;
  nativeName: string;
  /**
   * True only when `public/locales/<code>/common.json` exists and was written
   * by someone who speaks the language.
   *
   * Every language below is one Manila residents actually speak, so the list
   * stays as the goal. But i18next silently falls back to English when a file
   * is missing, so offering an untranslated language shows the reader English
   * while claiming to show them their own language. That is worse than not
   * offering it. Unavailable languages are surfaced as a call for help.
   */
  available: boolean;
}

export const LANGUAGES: Record<LanguageType, LanguageInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', available: true },
  fil: {
    code: 'fil',
    name: 'Tagalog',
    nativeName: 'Filipino/Tagalog',
    available: true,
  },
  ceb: {
    code: 'ceb',
    name: 'Cebuano',
    nativeName: 'Bisaya/Sinugboanon',
    available: false,
  },
  ilo: {
    code: 'ilo',
    name: 'Ilocano',
    nativeName: 'Ilokano',
    available: false,
  },
  hil: {
    code: 'hil',
    name: 'Hiligaynon',
    nativeName: 'Ilonggo',
    available: false,
  },
  war: {
    code: 'war',
    name: 'Waray',
    nativeName: 'Waray-Waray',
    available: false,
  },
  pam: {
    code: 'pam',
    name: 'Kapampangan',
    nativeName: 'Kapampangan',
    available: false,
  },
  bcl: {
    code: 'bcl',
    name: 'Bikol',
    nativeName: 'Bikol Central',
    available: false,
  },
  pag: {
    code: 'pag',
    name: 'Pangasinan',
    nativeName: 'Pangasinan',
    available: false,
  },
  mag: {
    code: 'mag',
    name: 'Maguindanao',
    nativeName: 'Maguindanaon',
    available: false,
  },
  tsg: {
    code: 'tsg',
    name: 'Tausug',
    nativeName: 'Bahasa Sūg',
    available: false,
  },
  mdh: {
    code: 'mdh',
    name: 'Maranao',
    nativeName: 'Meranaw',
    available: false,
  },
};

export const DEFAULT_LANGUAGE: LanguageType = 'en';

/** Languages with a translation file behind them. */
export const AVAILABLE_LANGUAGES = Object.values(LANGUAGES).filter(
  language => language.available
);

/** Languages we want, and need a speaker to write. */
export const WANTED_LANGUAGES = Object.values(LANGUAGES).filter(
  language => !language.available
);
