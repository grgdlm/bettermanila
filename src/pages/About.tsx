import { Link } from 'react-router-dom';
import {
  Banknote,
  Bug,
  Building2,
  ExternalLink,
  FolderOpen,
  Gavel,
  HeartHandshake,
  Languages,
  MapPin,
  PenLine,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { Heading } from '../components/ui/Heading';
import { REPO_URL } from '../data/navigation';

/**
 * About page.
 *
 * This is the page that decides whether a reader trusts the rest of the site.
 * A volunteer project publishing facts about a real city government has to be
 * straight about four things, in this order of importance: that it is not City
 * Hall, where its facts came from, how to correct one, and how far along it
 * actually is.
 *
 * The disclaimer sits directly under the headline rather than in fine print at
 * the bottom, because someone who mistakes this for the official site could
 * act on that mistake. The route to report a mistake is the loudest block on
 * the page for the same reason: a wrong hotline number matters.
 *
 * Nothing here claims a history, a team, funding or a launch date, because
 * none of that is established fact.
 *
 * Colour comes from the shared tokens in src/index.css. No hardcoded hex.
 */

/** Keeps staggered elements hidden until their delay elapses. */
const FILL = '[animation-fill-mode:both] motion-reduce:animate-none';

/**
 * Where the facts on this site come from. Official publications only.
 *
 * Names and domains are proper nouns and stay as published in every language;
 * only the note explaining what each source carries is translated, under
 * `about.sources.<key>`.
 */
const SOURCES = [
  {
    icon: Building2,
    key: 'manila',
    name: 'City Government of Manila',
    domain: 'manila.gov.ph',
    href: 'https://manila.gov.ph',
  },
  {
    icon: FolderOpen,
    key: 'dilg',
    name: 'DILG Full Disclosure Policy Portal',
    domain: 'fdpp.dilg.gov.ph',
    href: 'https://fdpp.dilg.gov.ph',
  },
  {
    icon: ShieldCheck,
    key: 'coa',
    name: 'Commission on Audit',
    domain: 'coa.gov.ph',
    href: 'https://www.coa.gov.ph',
  },
  {
    icon: Banknote,
    key: 'blgf',
    name: 'Bureau of Local Government Finance',
    domain: 'blgf.gov.ph',
    href: 'https://blgf.gov.ph',
  },
  {
    icon: Gavel,
    key: 'philgeps',
    name: 'PhilGEPS',
    domain: 'open.philgeps.gov.ph',
    href: 'https://open.philgeps.gov.ph',
  },
];

/** The kinds of contribution the project needs. */
const WAYS_TO_HELP = [
  { icon: PenLine, key: 'write' },
  { icon: Languages, key: 'translate' },
  { icon: MapPin, key: 'local' },
];

export default function About() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        keywords={t('seo.about.keywords')}
      />
      <div>
        {/* Headline and the disclaimer, in that order and nothing between */}
        <section className="relative overflow-hidden bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 h-[340px] w-[720px] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-primary-100),transparent)] opacity-70" />
          </div>

          <div className="relative container mx-auto px-4 py-12 md:py-16">
            <p
              className={`animate-fade-in ${FILL} text-xs font-semibold tracking-[0.2em] text-primary-700 uppercase`}
            >
              {t('common.eyebrowIndependent')}
            </p>

            <Heading
              level={1}
              className={`animate-slide-in ${FILL} mt-3 mb-0 max-w-3xl text-3xl leading-[1.1] font-extrabold tracking-tight text-primary-800 sm:text-4xl md:text-5xl`}
            >
              {t('about.title')}
            </Heading>

            <p
              className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg`}
              style={{ animationDelay: '100ms' }}
            >
              {t('about.lead')}
            </p>

            <p
              className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700`}
              style={{ animationDelay: '140ms' }}
            >
              {t('about.intro')}
            </p>

            {/* Unmissable, and deliberately above everything else */}
            <div
              className="mt-8 max-w-3xl rounded-xl border border-primary-200 bg-primary-50 p-5 sm:p-6"
              role="note"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
                >
                  <TriangleAlert className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-primary-800 sm:text-xl">
                    {t('about.disclaimer.title')}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-gray-700">
                    {t('about.disclaimer.body')}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    <Trans
                      i18nKey="about.disclaimer.official"
                      components={{
                        link: (
                          <a
                            href="https://manila.gov.ph"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                          />
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <h2 className="font-display max-w-3xl text-2xl font-extrabold tracking-tight text-primary-800 sm:text-3xl">
              {t('about.sources.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
              {t('about.sources.lead')}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SOURCES.map(source => {
                const Icon = source.icon;
                return (
                  <li key={source.domain}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 motion-reduce:transform-none hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block text-sm leading-tight font-bold tracking-tight text-primary-800">
                          {source.name}
                        </span>
                        <span className="mt-1 block text-xs break-all text-primary-700">
                          {source.domain}
                        </span>
                        <span className="mt-1.5 block text-sm leading-snug text-gray-700">
                          {t(`about.sources.${source.key}`)}
                        </span>
                      </span>
                      <ExternalLink
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-primary-600"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Corrections. The most important thing on the page, and it looks it */}
        <section className="bg-white">
          <div className="container mx-auto px-4 pb-12 md:pb-14">
            <div className="rounded-xl bg-primary-800 p-6 text-white sm:p-8">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white"
                >
                  <Bug className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {t('about.corrections.title')}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-primary-100">
                    {t('about.corrections.body')}
                  </p>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-primary-100">
                    {t('about.corrections.how')}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href={`${REPO_URL}/issues/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary-800 shadow-sm transition-colors hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 focus-visible:outline-none"
                    >
                      {t('about.corrections.report')}
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                    <a
                      href={REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 focus-visible:outline-none"
                    >
                      {t('about.corrections.browse')}
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contributing */}
        <section className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <h2 className="font-display max-w-3xl text-2xl font-extrabold tracking-tight text-primary-800 sm:text-3xl">
              {t('about.help.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
              <Trans
                i18nKey="about.help.lead"
                components={{
                  link: (
                    <a
                      href={REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    />
                  ),
                }}
              />
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WAYS_TO_HELP.map(way => {
                const Icon = way.icon;
                return (
                  <li
                    key={way.key}
                    className="h-full rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display mt-3.5 text-base font-bold tracking-tight text-primary-800">
                      {t(`about.help.${way.key}Title`)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                      {t(`about.help.${way.key}Body`)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Honest status */}
        <section className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <div className="max-w-3xl rounded-xl border border-primary-100 bg-primary-50/70 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
                >
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-primary-800 sm:text-xl">
                    {t('about.status.title')}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-gray-700">
                    {t('about.status.body')}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    {t('about.status.why')}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    <Trans
                      i18nKey="about.status.browse"
                      components={{
                        services: (
                          <Link
                            to="/services"
                            className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                          />
                        ),
                        government: (
                          <Link
                            to="/government"
                            className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                          />
                        ),
                        search: (
                          <Link
                            to="/search"
                            className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                          />
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
