import type { CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heading } from '../components/ui/Heading';
import { ManilaSkyline } from './ManilaSkyline';

/**
 * Holding page shown on every route while COMING_SOON is on.
 *
 * Direction: white sky, blue city. A light, airy hero around the owner's ML
 * lockup, over an original Manila skyline that drops into a deep indigo band
 * carrying the 16 districts.
 *
 * Palette is sampled from the logo artwork and defined inline (this is a
 * fork; theme tokens in index.css are shared with upstream and stay
 * untouched):
 *   #210b6f ink    darkest indigo: district band, dark gradient stops
 *   #282896 deep   pill text, skyline detail ink
 *   #2846b4 royal  CTA, gradient mid, skyline front layer
 *   #285abe        CTA hover
 *   #0078d2 azure  gradient end, status dot, accents
 * The artwork has no red, so the page carries none either.
 */

/** The 16 administrative districts of the City of Manila. */
const DISTRICTS = [
  'Binondo',
  'Ermita',
  'Intramuros',
  'Malate',
  'Paco',
  'Pandacan',
  'Port Area',
  'Quiapo',
  'Sampaloc',
  'San Andres',
  'San Miguel',
  'San Nicolas',
  'Santa Ana',
  'Santa Cruz',
  'Santa Mesa',
  'Tondo',
];

const REPO_URL = 'https://github.com/grgdlm/bettermanila';

/** Keeps staggered elements hidden until their delay elapses. */
const FILL = '[animation-fill-mode:both] motion-reduce:animate-none';

/**
 * Archivo at width 125 gives the wide civic-banner stance the display type
 * needs; Inter has no width axis. Loaded once in the Helmet below.
 */
const DISPLAY_FONT: CSSProperties = {
  fontFamily: 'var(--font-kapwa-display)',
  fontStretch: '125%',
};

export default function ComingSoon() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-gray-700">
      <Helmet>
        <title>
          BetterManila: a public-service portal for the City of Manila
        </title>
        <meta
          name="description"
          content="An independent, open-source public-service portal for the City of Manila. Services, departments, budgets and ordinances in plain language. Currently in development."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="BetterManila" />
        <meta
          property="og:description"
          content="An independent, open-source public-service portal for the City of Manila. In development."
        />
        <meta property="og:url" content="https://bettermanila.org" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600..800&display=swap"
        />
      </Helmet>

      {/* Atmosphere: soft azure glow and two faint light streaks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-16 left-1/2 h-[380px] w-[620px] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(80,118,238,0.07),rgba(255,255,255,0))]" />
        <div className="bg-linear-to-r via-[#8fa8f0]/25 absolute top-40 -left-24 h-px w-96 -rotate-[24deg] from-transparent to-transparent" />
        <div className="bg-linear-to-l via-[#8fa8f0]/25 absolute top-64 -right-24 h-px w-96 rotate-[24deg] from-transparent to-transparent" />
      </div>

      <div className="relative container mx-auto flex w-full flex-1 flex-col px-4 pt-8 md:pt-10">
        {/* Status rail */}
        <header
          className={`animate-fade-in ${FILL} flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-widest uppercase`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dcdff6] bg-[#eef0fb] px-3 py-1.5 font-semibold text-primary-700">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500 motion-reduce:animate-none"
            />
            <span>In development</span>
          </span>
          <span className="ml-auto">A BetterGov.ph community project</span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-14 text-center md:py-20">
          {/* The owner's ML lockup is a wide 1.6:1 mark, not a square badge:
              give it width and let the wordmark below carry the name. */}
          <img
            src="/logo.webp"
            alt=""
            width={960}
            height={600}
            className={`animate-fade-in ${FILL} h-auto w-36 drop-shadow-[0_10px_22px_rgba(40,70,180,0.18)] sm:w-40 md:w-48`}
          />

          <Heading
            level={1}
            className={`animate-slide-in ${FILL} mt-6 mb-0 text-4xl leading-[1.04] sm:text-5xl md:mt-8 md:text-6xl lg:text-7xl`}
          >
            <span
              style={DISPLAY_FONT}
              className="bg-linear-to-r from-primary-800 via-primary-600 to-accent-500 bg-clip-text font-extrabold tracking-tight text-transparent uppercase"
            >
              BetterManila
            </span>
          </Heading>

          <p
            className={`animate-slide-in ${FILL} mt-5 max-w-2xl text-lg leading-relaxed text-balance md:text-xl`}
            style={{ animationDelay: '120ms' }}
          >
            A public-service portal for the City of Manila. Services,
            departments, budgets and ordinances, written in plain language.
          </p>
          <p
            className={`animate-slide-in ${FILL} mt-3 max-w-xl text-gray-700`}
            style={{ animationDelay: '200ms' }}
          >
            Built in the open by volunteers. Not finished yet.
          </p>

          <div
            className={`animate-slide-in ${FILL} mt-9`}
            style={{ animationDelay: '280ms' }}
          >
            <a
              href={REPO_URL}
              className="inline-flex items-center rounded-lg bg-primary-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-500 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Follow the build on GitHub
            </a>
          </div>
        </main>
      </div>

      {/* The skyline drops the white sky into the indigo city band */}
      <ManilaSkyline
        className={`animate-fade-in ${FILL} relative mt-auto block h-28 w-full sm:h-40 md:aspect-[6/1] md:h-auto`}
      />

      <div className="relative bg-primary-800 text-white">
        {/* The city it is being built for, district by district */}
        <section
          aria-labelledby="districts-label"
          className="container mx-auto px-4 pt-10 pb-8 text-center md:pt-12"
        >
          <h2
            id="districts-label"
            className={`animate-fade-in ${FILL} text-xs font-semibold tracking-[0.25em] text-[#8fa8f0] uppercase`}
            style={{ animationDelay: '240ms' }}
          >
            The city it is being built for
          </h2>
          <ul className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2">
            {DISTRICTS.map((district, i) => (
              <li
                key={district}
                className={`animate-fade-in ${FILL} text-base font-semibold text-[#dbe4ff] md:text-lg`}
                style={{ animationDelay: `${320 + i * 40}ms` }}
              >
                {district}
              </li>
            ))}
          </ul>
          <p
            className={`animate-fade-in ${FILL} mt-6 font-mono text-xs tracking-wide text-[#b3c4f8] md:text-sm`}
            style={{ animationDelay: '1000ms' }}
          >
            14 districts, 897 barangays, one place to look things up.
          </p>
        </section>

        <footer
          className={`animate-fade-in ${FILL} border-t border-white/10`}
          style={{ animationDelay: '1080ms' }}
        >
          <p className="container mx-auto max-w-3xl px-4 py-6 text-center text-xs leading-relaxed text-[#b3c4f8]/75">
            An independent volunteer project. Not affiliated with, or endorsed
            by, the City Government of Manila. For official announcements, refer
            to the city government&rsquo;s own channels.
          </p>
        </footer>
      </div>
    </div>
  );
}
