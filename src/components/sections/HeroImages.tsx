import { useEffect, useState } from 'react';
import { IMAGE_CREDITS, IMAGE_DIMENSIONS } from '../../data/imageCredits';

/**
 * The photo panel beside the hero copy.
 *
 * Four views of the city on a slow crossfade. It is decoration, not
 * information — nothing here tells a reader anything the page does not say in
 * words — so the whole panel is hidden from assistive technology rather than
 * announcing four rotating photo descriptions at someone trying to reach the
 * search box.
 *
 * Three rules it has to keep:
 *
 *  - It never moves the layout. The panel has a fixed aspect ratio and every
 *    slide is stacked in the same box, so nothing reflows as images arrive.
 *  - It never animates for a reader who asked it not to. On
 *    prefers-reduced-motion the timer never starts and the first photo simply
 *    stays, which is a complete and correct experience, not a degraded one.
 *  - It never costs a phone anything. This is why the panel is gated on a
 *    matchMedia check rather than a `hidden lg:block` class: a display:none
 *    image is still fetched, so the CSS-only version quietly cost every
 *    mobile visitor four downloads for a panel they never see. Measured, not
 *    assumed — all four appeared in the resource timings at a 606px viewport.
 *    The check is seeded from matchMedia during the first render, so a wide
 *    screen still paints the panel immediately with no flash.
 *
 * The credit line is not optional furniture. These photographs are CC BY, so
 * naming the photographer is the condition of using them at all.
 */
const SLIDES = [
  { src: '/images/hero/city-centre.webp', label: "Manila's city centre" },
  { src: '/images/hero/bay-sunset.webp', label: 'Sunset over Manila Bay' },
  { src: '/images/hero/pasig-river.webp', label: 'The Pasig River' },
  {
    src: '/images/hero/manila-cathedral.webp',
    label: 'Manila Cathedral, Intramuros',
  },
];

const INTERVAL_MS = 6000;

/** Matches the `lg` breakpoint the hero grid uses. */
const WIDE = '(min-width: 64rem)';

export default function HeroImages() {
  const [index, setIndex] = useState(0);
  const [isWide, setIsWide] = useState(() => window.matchMedia(WIDE).matches);

  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const onChange = () => setIsWide(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isWide) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(
      () => setIndex(current => (current + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, [isWide]);

  if (!isWide) return null;

  const current = SLIDES[index];
  const credit = IMAGE_CREDITS[current.src];

  return (
    <div
      aria-hidden="true"
      className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg shadow-primary-900/5"
    >
      {SLIDES.map((slide, i) => {
        const size = IMAGE_DIMENSIONS[slide.src];
        return (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            width={size?.width}
            height={size?.height}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        );
      })}

      {/* A scrim, so the caption stays legible over a bright sky */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />

      <p className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-1.5 px-4 py-3 text-xs text-white/85">
        <span className="font-medium text-white">{current.label}</span>
        {credit ? (
          <span>
            Photo: {credit.author}, {credit.license}
          </span>
        ) : null}
      </p>
    </div>
  );
}
