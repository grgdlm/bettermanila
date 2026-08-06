import { useState, type FormEvent } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { QUICK_LINKS } from '../../data/quickLinks';
import HeroImages from './HeroImages';

/**
 * Home page hero.
 *
 * A front door, not a landing splash. Someone arriving usually has a specific
 * question, so the first screen offers the two fastest routes to an answer:
 * a search box, and direct links to the pages people actually look up.
 *
 * Naming: the brand is BetterManila, which the navbar above already states.
 * The city is the City of Manila. The headline addresses what the reader came
 * to do; the body names BetterManila as the guide, so the relationship stays
 * plain: a portal about the city, built by residents, not by City Hall.
 *
 * Colour comes from the shared tokens in src/index.css. No hardcoded hex.
 */

/** Keeps staggered elements hidden until their delay elapses. */
const FILL = '[animation-fill-mode:both] motion-reduce:animate-none';

/**
 * Per the PSA's PSGC entry for the City of Manila (counts as of 31 July
 * 2025) and the 2024 POPCEN: 897 barangays grouped into 14 districts, and
 * six legislative districts. Full figures with sources live on
 * /government/reports-and-statistics/manila-by-the-numbers.
 *
 * The figures are language-independent; only the noun after each one is
 * translated, via `hero.facts.<key>`.
 */
const CITY_FACTS = [
  { value: '897', key: 'barangays' },
  { value: '14', key: 'districts' },
  { value: '6', key: 'legislativeDistricts' },
];

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Atmosphere: a single soft glow, kept faint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[340px] w-[720px] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-primary-100),transparent)] opacity-70" />
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-16">
        {/* Two columns from lg up: the copy and the search box keep the left,
            the photo panel fills what used to be empty gutter. Below lg the
            panel is not rendered at all, so a phone downloads none of it and
            the layout stays exactly as it was. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-14">
          <div>
            <p
              className={`animate-fade-in ${FILL} text-xs font-semibold tracking-[0.2em] text-primary-700 uppercase`}
            >
              {t('common.eyebrowIndependent')}
            </p>

            <Heading
              level={1}
              className={`animate-slide-in ${FILL} mt-3 mb-0 max-w-3xl text-3xl leading-[1.1] font-extrabold tracking-tight text-balance text-primary-800 sm:text-4xl md:text-5xl`}
            >
              <Trans
                i18nKey="hero.title"
                components={{
                  city: (
                    <span className="bg-linear-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent" />
                  ),
                }}
              />
            </Heading>

            <p
              className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg`}
              style={{ animationDelay: '100ms' }}
            >
              {t('hero.subtitle')}
            </p>

            <form
              onSubmit={onSubmit}
              role="search"
              className={`animate-slide-in ${FILL} mt-7 max-w-2xl`}
              style={{ animationDelay: '160ms' }}
            >
              <label htmlFor="hero-search" className="sr-only">
                {t('common.searchLabel')}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="hero-search"
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t('common.searchPlaceholder')}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pr-4 pl-12 text-base text-gray-900 shadow-sm transition-colors placeholder:text-gray-600 focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-500 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t('hero.searchButton')}
                </button>
              </div>
            </form>

            <p
              className={`animate-fade-in ${FILL} mt-4 max-w-2xl text-sm text-gray-700`}
              style={{ animationDelay: '220ms' }}
            >
              <Trans
                i18nKey="hero.disclaimer"
                components={{
                  link: (
                    <a
                      href="https://manila.gov.ph"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    />
                  ),
                }}
              />
            </p>
          </div>

          <div
            className={`animate-fade-in ${FILL} mt-10 hidden lg:mt-0 lg:block`}
            style={{ animationDelay: '200ms' }}
          >
            <HeroImages />
          </div>
        </div>

        {/* The things people actually come here for */}
        <div className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
            {t('hero.startHere')}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`animate-fade-in ${FILL} group flex h-full items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 motion-reduce:transform-none hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none`}
                    style={{ animationDelay: `${260 + i * 60}ms` }}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-display block text-sm leading-tight font-bold tracking-tight text-primary-800">
                        {t(`quickLinks.${link.key}.label`)}
                      </span>
                      <span className="mt-1 block text-sm leading-snug text-gray-700">
                        {t(`quickLinks.${link.key}.note`)}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 motion-reduce:transform-none group-hover:text-primary-600"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* The scale of the city this site covers, kept to one line */}
      <div className="relative bg-primary-800 text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3.5 text-center text-sm">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {CITY_FACTS.map(fact => (
              <li key={fact.key} className="flex items-baseline gap-1.5">
                <span className="font-display font-extrabold">
                  {fact.value}
                </span>
                <span className="text-primary-200">
                  {t(`hero.facts.${fact.key}`)}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-primary-200">{t('hero.hospitalNote')}</p>
        </div>
      </div>
    </section>
  );
}
