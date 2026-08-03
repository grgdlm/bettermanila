import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  CloudRain,
  FileText,
  HeartPulse,
  Landmark,
  Search,
  Siren,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Heading } from '../ui/Heading';

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

/** The pages people actually arrive looking for. All of these exist. */
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

const CITY_FACTS = [
  { value: '16', label: 'districts' },
  { value: '896', label: 'barangays' },
  { value: '6', label: 'legislative districts' },
];

export default function Hero() {
  const navigate = useNavigate();
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
        <p
          className={`animate-fade-in ${FILL} text-xs font-semibold tracking-[0.2em] text-primary-700 uppercase`}
        >
          Independent. Open source. Volunteer-built.
        </p>

        <Heading
          level={1}
          className={`animate-slide-in ${FILL} mt-3 mb-0 max-w-3xl text-3xl leading-[1.1] font-extrabold tracking-tight text-primary-800 sm:text-4xl md:text-5xl`}
        >
          Find what you need from the{' '}
          <span className="bg-linear-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            City of Manila
          </span>
        </Heading>

        <p
          className={`animate-slide-in ${FILL} mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg`}
          style={{ animationDelay: '100ms' }}
        >
          BetterManila is a free guide to city services, departments, budgets
          and ordinances, researched and written by volunteers who live here.
        </p>

        <form
          onSubmit={onSubmit}
          role="search"
          className={`animate-slide-in ${FILL} mt-7 max-w-2xl`}
          style={{ animationDelay: '160ms' }}
        >
          <label htmlFor="hero-search" className="sr-only">
            Search BetterManila
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
                placeholder="Try ospital, business permit, amilyar"
                className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pr-4 pl-12 text-base text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
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

        <p
          className={`animate-fade-in ${FILL} mt-4 max-w-2xl text-sm text-gray-600`}
          style={{ animationDelay: '220ms' }}
        >
          Not the official city website. For official business, visit{' '}
          <a
            href="https://manila.gov.ph"
            target="_blank"
            rel="noreferrer"
            className="rounded font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
          >
            manila.gov.ph
          </a>
          .
        </p>

        {/* The things people actually come here for */}
        <div className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
            Start here
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`animate-fade-in ${FILL} group flex h-full items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none`}
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
                      <span className="mt-1 block text-sm leading-snug text-gray-600">
                        {link.note}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-600"
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
        <dl className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3.5 text-center text-sm">
          {CITY_FACTS.map(fact => (
            <div key={fact.label} className="flex items-baseline gap-1.5">
              <dt className="sr-only">{fact.label}</dt>
              <dd className="font-display font-extrabold">{fact.value}</dd>
              <span className="text-primary-200">{fact.label}</span>
            </div>
          ))}
          <p className="text-primary-200">A city-run hospital in every one</p>
        </dl>
      </div>
    </section>
  );
}
