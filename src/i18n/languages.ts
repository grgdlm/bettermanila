import type { LanguageType } from '../types';

export interface LanguageInfo {
  code: LanguageType;
  name: string;
  nativeName: string;
  /**
   * True when `public/locales/<code>/common.json` exists. i18next falls back
   * to English when a file is missing, so a language without one must never
   * be selectable: the reader would ask for their language and be shown
   * English. Languages with no file are surfaced as a call for help instead.
   */
  available: boolean;
  /**
   * True only when a speaker of the language has read the file through.
   *
   * A translation drafted by a machine and a translation checked by a person
   * are different things, and a site that asks readers to trust it about
   * hotline numbers and permit fees does not get to blur them. Drafts are
   * selectable — a rough translation beats no translation for someone who
   * reads little English — but the switcher groups them separately and every
   * page carries a notice saying so, with a link to report what is wrong.
   *
   * Flip this only when a speaker has actually reviewed the file. Not when it
   * looks fluent, and not because it has been sitting there a while.
   */
  reviewed: boolean;
}

export const LANGUAGES: Record<LanguageType, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    available: true,
    reviewed: true,
  },
  fil: {
    code: 'fil',
    name: 'Tagalog',
    nativeName: 'Filipino/Tagalog',
    available: true,
    reviewed: true,
  },
  ceb: {
    code: 'ceb',
    name: 'Cebuano',
    nativeName: 'Bisaya/Sinugboanon',
    available: true,
    reviewed: false,
  },
  ilo: {
    code: 'ilo',
    name: 'Ilocano',
    nativeName: 'Ilokano',
    available: true,
    reviewed: false,
  },
  hil: {
    code: 'hil',
    name: 'Hiligaynon',
    nativeName: 'Ilonggo',
    available: true,
    reviewed: false,
  },
  war: {
    code: 'war',
    name: 'Waray',
    nativeName: 'Waray-Waray',
    available: true,
    reviewed: false,
  },
  pam: {
    code: 'pam',
    name: 'Kapampangan',
    nativeName: 'Kapampangan',
    available: true,
    reviewed: false,
  },
  bcl: {
    code: 'bcl',
    name: 'Bikol',
    nativeName: 'Bikol Central',
    available: true,
    reviewed: false,
  },
  pag: {
    code: 'pag',
    name: 'Pangasinan',
    nativeName: 'Pangasinan',
    available: false,
    reviewed: false,
  },
  mag: {
    code: 'mag',
    name: 'Maguindanao',
    nativeName: 'Maguindanaon',
    available: false,
    reviewed: false,
  },
  tsg: {
    code: 'tsg',
    name: 'Tausug',
    nativeName: 'Bahasa Sūg',
    available: false,
    reviewed: false,
  },
  mdh: {
    code: 'mdh',
    name: 'Maranao',
    nativeName: 'Meranaw',
    available: false,
    reviewed: false,
  },
};

export const DEFAULT_LANGUAGE: LanguageType = 'en';

/** Languages with a translation file behind them, draft or not. */
export const AVAILABLE_LANGUAGES = Object.values(LANGUAGES).filter(
  language => language.available
);

/** Checked by a speaker. Offered without qualification. */
export const REVIEWED_LANGUAGES = AVAILABLE_LANGUAGES.filter(
  language => language.reviewed
);

/** Translated, but by a machine and not yet read by a speaker. */
export const DRAFT_LANGUAGES = AVAILABLE_LANGUAGES.filter(
  language => !language.reviewed
);

/** Languages we want, and need a speaker to write. */
export const WANTED_LANGUAGES = Object.values(LANGUAGES).filter(
  language => !language.available
);

export const isDraftLanguage = (code?: string) =>
  Boolean(code && LANGUAGES[code as LanguageType]?.available === true) &&
  LANGUAGES[code as LanguageType].reviewed === false;

/**
 * The codes i18next is allowed to load, derived rather than repeated.
 *
 * This used to be a hand-written array in src/i18n.ts, which meant a language
 * could be switched on in one file and missing from the other — the switcher
 * offers it, i18next refuses to load it, and the reader gets English.
 */
export const SUPPORTED_LANGUAGE_CODES = AVAILABLE_LANGUAGES.map(
  language => language.code
);
