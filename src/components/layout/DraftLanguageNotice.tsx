import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, isDraftLanguage } from '../../i18n/languages';
import type { LanguageType } from '../../types';
import { REPO_URL } from '../../data/navigation';

/**
 * Shown on every page while the reader is on a machine-drafted language.
 *
 * The site's whole claim is that it checks things and marks what it could not
 * check. A translation nobody who speaks the language has read is exactly that
 * kind of gap, so it gets said out loud rather than hidden behind a fluent
 * looking interface. The notice names the language, says who wrote it, and
 * gives the two things a reader can do about it: switch to a checked language,
 * or tell us what is wrong.
 *
 * Deliberately in English as well as the draft language: if the draft is bad
 * enough to mislead, its own warning cannot be trusted to carry the message.
 */
export default function DraftLanguageNotice() {
  const { i18n } = useTranslation();
  const code = i18n.resolvedLanguage;

  if (!isDraftLanguage(code)) return null;

  const language = LANGUAGES[code as LanguageType];

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="container mx-auto flex items-start gap-3 px-4 py-2.5 text-sm">
        <Languages
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
        />
        <p className="text-amber-900">
          This {language.name} interface is a machine-written draft. No{' '}
          {language.name} speaker has checked it yet, so some of it is probably
          wrong. Page content stays in English.{' '}
          <a
            href={`${REPO_URL}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-semibold underline decoration-amber-400 underline-offset-2 transition-colors hover:text-amber-950 hover:decoration-amber-700 focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
          >
            Help fix it
          </a>
          , or switch to English or Filipino above.
        </p>
      </div>
    </div>
  );
}
