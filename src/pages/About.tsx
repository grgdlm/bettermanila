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
import SEO from '../components/SEO';
import { Heading } from '../components/ui/Heading';

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

const REPO_URL = 'https://github.com/grgdlm/bettermanila';

/** Where the facts on this site come from. Official publications only. */
const SOURCES = [
  {
    icon: Building2,
    name: 'City Government of Manila',
    domain: 'manila.gov.ph',
    href: 'https://manila.gov.ph',
    note: 'The official city website. Departments, offices, announcements and online services.',
  },
  {
    icon: FolderOpen,
    name: 'DILG Full Disclosure Policy Portal',
    domain: 'fdpp.dilg.gov.ph',
    href: 'https://fdpp.dilg.gov.ph',
    note: 'Budgets, financial statements and procurement disclosures that every LGU is required to publish.',
  },
  {
    icon: ShieldCheck,
    name: 'Commission on Audit',
    domain: 'coa.gov.ph',
    href: 'https://www.coa.gov.ph',
    note: 'Annual audit reports on how the city actually spent public money.',
  },
  {
    icon: Banknote,
    name: 'Bureau of Local Government Finance',
    domain: 'blgf.gov.ph',
    href: 'https://blgf.gov.ph',
    note: 'Local revenue, income and fiscal performance data for cities and municipalities.',
  },
  {
    icon: Gavel,
    name: 'PhilGEPS',
    domain: 'open.philgeps.gov.ph',
    href: 'https://open.philgeps.gov.ph',
    note: 'Public bid notices and contract awards from the government procurement system.',
  },
];

/** The kinds of contribution the project needs. */
const WAYS_TO_HELP = [
  {
    icon: PenLine,
    title: 'Write and verify',
    body: 'Add a page that is missing, or check an existing one against its official source and cite it. Content lives as plain markdown in the same repository as the code.',
  },
  {
    icon: Languages,
    title: 'Translate',
    body: 'The site ships in English and Filipino today. Bisaya, Bikol, Ilocano and the other languages in the switcher are listed as needing a translator, and stay listed until a speaker writes them.',
  },
  {
    icon: MapPin,
    title: 'Share local knowledge',
    body: 'Which window is actually open, which number gets answered, what you are asked to bring. No document records that, and it is often what a resident needs most.',
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="BetterManila is a free, independent, volunteer-built guide to City of Manila services, departments, budgets and ordinances. Not the official city website."
        keywords="about bettermanila, independent, volunteer, open source, city of manila, sources, corrections"
      />
      <main className="flex-grow">
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
              Independent. Open source. Volunteer-built.
            </p>

            <Heading
              level={1}
              className={`animate-slide-in ${FILL} mt-3 mb-0 max-w-3xl text-3xl leading-[1.1] font-extrabold tracking-tight text-primary-800 sm:text-4xl md:text-5xl`}
            >
              About BetterManila
            </Heading>

            <p
              className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg`}
              style={{ animationDelay: '100ms' }}
            >
              A free guide to City of Manila services, departments, budgets and
              ordinances, written in plain language by volunteers who live here.
            </p>

            <p
              className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700`}
              style={{ animationDelay: '140ms' }}
            >
              Most of what a resident needs to know is already public. It is
              just spread across separate portals, buried in PDFs, and written
              for auditors rather than for the person standing in the queue.
              This site gathers that material in one place, checks it against
              the office that published it, and rewrites it so it can be read on
              a phone in a few minutes.
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
                    This is not the official city website
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-gray-700">
                    BetterManila is an independent project. It is not affiliated
                    with, endorsed by, or operated by the City Government of
                    Manila. Nothing published here is an official notice, and no
                    transaction on this site is a government transaction.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    For official business, announcements and online services, go
                    to{' '}
                    <a
                      href="https://manila.gov.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    >
                      manila.gov.ph
                    </a>
                    . Where that site and this one disagree, that site is right.
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
              Where the information comes from
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
              Everything on this site is sourced from official Philippine
              government publications. Every page carries the source it came
              from and the date it was retrieved, so you can check the original
              yourself and judge how current it is. Where the document is public
              and stable, the page links straight to it.
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
                      className="group flex h-full items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                        <span className="mt-1.5 block text-sm leading-snug text-gray-600">
                          {source.note}
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
                    Found a mistake? Tell us
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-primary-100">
                    This site publishes facts about a real city government, so a
                    wrong hotline number, an out of date fee or a department
                    that has since moved is not a small thing. Reporting one is
                    the single most useful thing you can do here, and you do not
                    need to know how to code.
                  </p>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-primary-100">
                    Open an issue on GitHub. Say which page is wrong and what
                    the correct information is. If you have the official source,
                    link it. If you do not, report it anyway and it will be
                    looked up.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href={`${REPO_URL}/issues/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary-800 shadow-sm transition-colors hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 focus-visible:outline-none"
                    >
                      Report a mistake on GitHub
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                    <a
                      href={REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 focus-visible:outline-none"
                    >
                      Browse the repository
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
              How to help
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
              BetterManila is open source and built by volunteers. The site,
              including every word of its content, lives in one public
              repository under the handle{' '}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                grgdlm/bettermanila
              </a>
              , so anyone can read it, question it or add to it.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WAYS_TO_HELP.map(way => {
                const Icon = way.icon;
                return (
                  <li
                    key={way.title}
                    className="h-full rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display mt-3.5 text-base font-bold tracking-tight text-primary-800">
                      {way.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                      {way.body}
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
                    Where the site stands today
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-gray-700">
                    This site is early, and it says so on the pages themselves.
                    Where a fact could not be confirmed against an official
                    source, the page carries a visible note asking readers to
                    help complete the section instead of filling the gap with a
                    confident guess.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    That is deliberate. A gap you can see is safer than a number
                    that looks authoritative and is wrong. Those notes come down
                    as sources are checked, and each one is an open invitation
                    to anyone who knows the answer.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    Looking for something specific?{' '}
                    <Link
                      to="/services"
                      className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    >
                      Browse services
                    </Link>
                    ,{' '}
                    <Link
                      to="/government"
                      className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    >
                      the city government
                    </Link>
                    , or{' '}
                    <Link
                      to="/search"
                      className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    >
                      search the site
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
