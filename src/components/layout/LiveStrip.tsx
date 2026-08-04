import { useEffect, useState } from 'react';
import { CloudSun, Clock } from 'lucide-react';

/**
 * The live Manila strip that rides in the navbar's utility band.
 *
 * It sits there rather than in its own row so the header stays two rows tall.
 * The band is sticky, so the time and the weather stay glanceable while
 * reading, which is the whole point of showing them.
 *
 * Rules, since these are numbers we did not write ourselves:
 *  - A failed fetch renders nothing at all. No zero, no NaN, no error chip in
 *    the chrome of every page. The network fails during storms, which is
 *    exactly when someone is reading.
 *  - The peso figure is an indicative market rate, not the Bangko Sentral
 *    reference rate. The strip has no room to say so, so the value carries a
 *    title attribute and the full caveat lives on the home page panel.
 *  - Time is always Asia/Manila, whatever the visitor's own timezone.
 */

const MANILA = 'Asia/Manila';

export default function LiveStrip() {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<number | null>(null);
  const [usd, setUsd] = useState<number | null>(null);

  useEffect(() => {
    // Half a minute is enough resolution for a header clock, and it avoids
    // waking the render loop every second on a phone.
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842' +
        '&current=temperature_2m&timezone=Asia%2FManila',
      { signal: controller.signal }
    )
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('weather'))))
      .then(d => setWeather(Math.round(d.current.temperature_2m)))
      .catch(() => setWeather(null));

    fetch('https://open.er-api.com/v6/latest/PHP', {
      signal: controller.signal,
    })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('rates'))))
      .then(d => setUsd(d.rates?.USD ? 1 / d.rates.USD : null))
      .catch(() => setUsd(null));

    return () => controller.abort();
  }, []);

  const time = new Intl.DateTimeFormat('en-PH', {
    timeZone: MANILA,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now);

  const date = new Intl.DateTimeFormat('en-PH', {
    timeZone: MANILA,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(now);

  const divider = (
    <span aria-hidden="true" className="h-3 w-px bg-white/20 max-sm:hidden" />
  );

  return (
    <div className="flex min-w-0 items-center gap-2.5 text-xs sm:gap-3">
      <span className="flex items-center gap-1.5 whitespace-nowrap text-white">
        <Clock aria-hidden="true" className="h-3.5 w-3.5 text-primary-300" />
        <span className="tabular-nums">{time}</span>
        <span className="text-primary-200 max-sm:hidden">{date}</span>
        <span className="sr-only">Manila time</span>
      </span>

      {weather !== null && (
        <>
          {divider}
          <span className="flex items-center gap-1.5 whitespace-nowrap text-white">
            <CloudSun
              aria-hidden="true"
              className="h-3.5 w-3.5 text-primary-300"
            />
            <span className="tabular-nums">{weather}&deg;C</span>
            <span className="sr-only">current temperature in Manila</span>
          </span>
        </>
      )}

      {usd !== null && (
        <>
          {divider}
          <span
            className="whitespace-nowrap text-white max-sm:hidden"
            title="Indicative market rate, not the Bangko Sentral reference rate"
          >
            <span className="text-primary-200">$1 = </span>
            <span className="tabular-nums">&#8369;{usd.toFixed(2)}</span>
            {/* The title attribute is invisible to keyboard, touch and
                screen-reader users, so state the caveat for them too. */}
            <span className="sr-only">
              (indicative market rate, not the Bangko Sentral reference rate)
            </span>
          </span>
        </>
      )}
    </div>
  );
}
