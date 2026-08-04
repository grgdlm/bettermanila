import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CloudRain,
  Compass,
  FileText,
  HeartPulse,
  Landmark,
  Search,
  Siren,
  Trash2,
} from 'lucide-react';
import SEO from '../components/SEO';
import { Heading } from '../components/ui/Heading';
import { REPO_URL } from '../data/navigation';

/**
 * 404 page.
 *
 * Someone lands here after mistyping a URL or following a dead link, and the
 * thing they were actually after is usually a hotline, a permit or a
 * department. So this page is a redirect desk, not an apology: it says plainly
 * that the page does not exist, then hands over the two routes that work,
 * search and the pages people most often arrive looking for.
 *
 * No joke copy. A resident chasing an emergency number is not in the mood.
 *
 * Colour comes from the shared tokens in src/index.css. No hardcoded hex.
 */

/** Keeps staggered elements hidden until their delay elapses. */
const FILL = '[animation-fill-mode:both] motion-reduce:animate-none';

/**
 * The pages people actually arrive looking for. All of these exist, and this
 * list is deliberately kept in step with the home page hero.
 */
const QUICK_LINKS = [
  {
    icon: Siren,
    label: 'Emergency hotlines',
    note: 'Fire, flood, rescue and police numbers',
    href: '/government/emergency/hotlines',
  },
  {
    icon: HeartPulse,
    label: 'City hospitals',
    note: 'One in every district, and what is free',
    href: '/services/health-services/go-to-the-local-hospital-for-treatment-or-confinement',
  },
  {
    icon: FileText,
    label: 'Business permits',
    note: 'Apply, renew and pay local taxes',
    href: '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
  },
  {
    icon: CloudRain,
    label: 'Class suspensions',
    note: 'Where advisories get announced',
    href: '/government/news/suspensions-and-advisories',
  },
  {
    icon: Trash2,
    label: 'Garbage collection',
    note: 'Schedules and pickup requests',
    href: '/services/garbage-waste-disposal/check-garbage-collection-schedules-and-request-pickup',
  },
  {
    icon: Landmark,
    label: 'Your Mayor',
    note: 'Who leads the city, and how to reach them',
    href: '/government/departments/executive',
  },
];

/** Broader entry points, for readers who would rather browse than search. */
const SECTIONS = [
  {
    icon: Compass,
    label: 'All services',
    note: 'Every guide, grouped by what you need to do',
    href: '/services',
  },
  {
    icon: Building2,
    label: 'City government',
    note: 'Departments, offices, budgets and ordinances',
    href: '/government',
  },
];

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <>
      <SEO
        title="Page not found"
        description="That page does not exist on BetterManila. Search the site, or jump to city hotlines, hospitals, permits and departments."
        noindex
      />
      <div>
        <section className="relative overflow-hidden bg-white">
          {/* Atmosphere: a single soft glow, kept faint */}
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
              Error 404
            </p>

            <Heading
              level={1}
              className={`animate-slide-in ${FILL} mt-3 mb-0 max-w-3xl text-3xl leading-[1.1] font-extrabold tracking-tight text-primary-800 sm:text-4xl md:text-5xl`}
            >
              We could not find that page
            </Heading>

            <p
              className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg`}
              style={{ animationDelay: '100ms' }}
            >
              The address may have a typo in it, or the page may have moved
              since the link was written. Nothing is wrong on your end.
            </p>

            {pathname && pathname !== '/' && (
              <p
                className={`animate-fade-in ${FILL} mt-3 max-w-2xl text-sm text-gray-700`}
                style={{ animationDelay: '140ms' }}
              >
                You asked for{' '}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] break-all text-gray-800">
                  {pathname}
                </code>
              </p>
            )}

            <form
              onSubmit={onSubmit}
              role="search"
              className={`animate-slide-in ${FILL} mt-7 max-w-2xl`}
              style={{ animationDelay: '160ms' }}
            >
              <label htmlFor="notfound-search" className="sr-only">
                Search BetterManila
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="notfound-search"
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Try ospital, business permit, amilyar"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pr-4 pl-12 text-base text-gray-900 shadow-sm transition-colors placeholder:text-gray-600 focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-500 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Search
                </button>
              </div>
            </form>

            {/* The things people actually come here for */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
                Most looked up
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
                            {link.label}
                          </span>
                          <span className="mt-1 block text-sm leading-snug text-gray-700">
                            {link.note}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-600 motion-reduce:transform-none"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Wider entry points for readers who would rather browse */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
                Or start from the top
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {SECTIONS.map(section => {
                  const Icon = section.icon;
                  return (
                    <li key={section.href}>
                      <Link
                        to={section.href}
                        className="group flex h-full items-start gap-3.5 rounded-xl border border-primary-200 bg-primary-50/60 p-4 transition-all hover:-translate-y-0.5 motion-reduce:transform-none hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="font-display block text-sm leading-tight font-bold tracking-tight text-primary-800">
                            {section.label}
                          </span>
                          <span className="mt-1 block text-sm leading-snug text-gray-700">
                            {section.note}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary-300 transition-all group-hover:translate-x-0.5 motion-reduce:transform-none group-hover:text-primary-600"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-700">
              Did a link on this site bring you here? That is our mistake, and
              we would like to fix it.{' '}
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                Report the broken link on GitHub
              </a>
              , or read more{' '}
              <Link
                to="/about"
                className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                about this site
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
