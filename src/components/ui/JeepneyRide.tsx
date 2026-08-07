/**
 * A jeepney driving across the page.
 *
 * The site is deliberately plain almost everywhere — it carries hotline
 * numbers and permit fees, and cleverness in that context reads as
 * untrustworthy. This is the one page where a little joy is the honest
 * register: the jeepney is the most cheerfully decorated object in Manila,
 * and a page about riding one can afford to smile.
 *
 * It is decoration and nothing else, so it is hidden from assistive
 * technology entirely. A screen reader user loses nothing: every fact on the
 * page is in the text.
 *
 * Motion rules, same as everywhere else on the site. On
 * prefers-reduced-motion the jeepney parks in the middle of the road and the
 * wheels stop — a still illustration, which is a complete experience rather
 * than a broken one. Nothing here loads a file or blocks paint; it is inline
 * SVG and two CSS keyframes.
 *
 * Written in markdown as a fenced block with no content:
 *
 *     ```jeepney
 *     ```
 */
export function JeepneyRide() {
  return (
    <div
      aria-hidden="true"
      className="@container relative my-8 h-28 overflow-hidden rounded-xl border border-gray-200 bg-linear-to-b from-sky-50 to-gray-50"
    >
      {/* The road */}
      <div className="absolute inset-x-0 bottom-0 h-9 bg-gray-700" />
      {/* Centre line, dashed the way a road is */}
      <div
        className="absolute inset-x-0 bottom-4 h-0.5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, #fbbf24 0 24px, transparent 24px 44px)',
        }}
      />

      <div className="animate-jeepney-drive absolute bottom-2 motion-reduce:animate-none motion-reduce:left-1/2">
        <svg
          width="132"
          height="62"
          viewBox="0 0 132 62"
          fill="none"
          className="drop-shadow-sm"
        >
          {/* Body */}
          <path
            d="M6 44V26c0-2 1-3 3-3h18l9-13c1-1.4 2.3-2 4-2h56c1.7 0 3 .6 4 2l9 13h14c2 0 3 1 3 3v18c0 2-1 3-3 3H9c-2 0-3-1-3-3Z"
            fill="var(--color-primary-600)"
          />
          {/* Roof rack, the classic loaded jeepney silhouette */}
          <rect
            x="34"
            y="4"
            width="66"
            height="5"
            rx="2"
            fill="var(--color-primary-700)"
          />
          <rect
            x="44"
            y="0"
            width="14"
            height="5"
            rx="1.5"
            fill="var(--color-accent-500)"
          />
          <rect
            x="64"
            y="0"
            width="20"
            height="5"
            rx="1.5"
            fill="var(--color-accent-500)"
          />
          {/* Passenger windows */}
          <rect x="40" y="15" width="15" height="10" rx="2" fill="#e0f2fe" />
          <rect x="60" y="15" width="15" height="10" rx="2" fill="#e0f2fe" />
          <rect x="80" y="15" width="15" height="10" rx="2" fill="#e0f2fe" />
          {/* Windshield */}
          <path d="M100 25l-7-10h9l6 10h-8Z" fill="#e0f2fe" />
          {/* Signboard, where the route name would be */}
          <rect
            x="38"
            y="28"
            width="58"
            height="8"
            rx="2"
            fill="var(--color-accent-500)"
          />
          {/* Chrome strip */}
          <rect
            x="6"
            y="38"
            width="120"
            height="3"
            fill="var(--color-primary-800)"
            opacity="0.5"
          />
          {/* Wheels */}
          <g className="animate-jeepney-wheel origin-center [transform-box:fill-box] motion-reduce:animate-none">
            <circle cx="30" cy="47" r="9" fill="#1f2937" />
            <circle cx="30" cy="47" r="3.5" fill="#9ca3af" />
          </g>
          <g className="animate-jeepney-wheel origin-center [transform-box:fill-box] motion-reduce:animate-none">
            <circle cx="102" cy="47" r="9" fill="#1f2937" />
            <circle cx="102" cy="47" r="3.5" fill="#9ca3af" />
          </g>
        </svg>
      </div>
    </div>
  );
}
