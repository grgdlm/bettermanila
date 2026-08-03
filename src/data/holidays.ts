/**
 * Philippine holidays for 2026.
 *
 * Source: Proclamation No. 1006, s. 2025, declaring the regular holidays and
 * special (non-working) days for 2026.
 *   https://lawphil.net/executive/proc/proc2025/proc_1006_2025.html
 *   https://pco.gov.ph/issuances/proclamation-no-1006-declaring-the-regular-holidays-and-special-non-working-days-for-the-year-2026/
 *
 * Every weekday below was checked against the calendar rather than copied.
 *
 * Two caveats a reader deserves and the UI states:
 *  - Later proclamations can add, move or cancel dates. This list is what
 *    Proclamation 1006 declared, not a live feed.
 *  - The Islamic holidays are movable. Eid'l Fitr and Eid'l Adha were fixed by
 *    separate proclamation once the Islamic calendar dates were determined.
 *
 * When 2027 is proclaimed, add it here rather than guessing dates forward.
 */

export type HolidayKind = 'regular' | 'special' | 'working';

export interface Holiday {
  /** ISO date, Asia/Manila. */
  date: string;
  name: string;
  kind: HolidayKind;
  note?: string;
}

export const HOLIDAY_SOURCE = {
  label: 'Proclamation No. 1006, s. 2025',
  url: 'https://lawphil.net/executive/proc/proc2025/proc_1006_2025.html',
  year: 2026,
};

export const HOLIDAYS: Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day", kind: 'regular' },
  { date: '2026-02-17', name: 'Chinese New Year', kind: 'special' },
  {
    date: '2026-02-25',
    name: 'EDSA People Power Revolution anniversary',
    kind: 'working',
    note: 'Special working day, not a day off',
  },
  {
    date: '2026-03-20',
    name: "Eid'l Fitr",
    kind: 'regular',
    note: 'Date set by separate proclamation',
  },
  { date: '2026-04-02', name: 'Maundy Thursday', kind: 'regular' },
  { date: '2026-04-03', name: 'Good Friday', kind: 'regular' },
  { date: '2026-04-04', name: 'Black Saturday', kind: 'special' },
  { date: '2026-04-09', name: 'Araw ng Kagitingan', kind: 'regular' },
  { date: '2026-05-01', name: 'Labor Day', kind: 'regular' },
  {
    date: '2026-05-27',
    name: "Eid'l Adha",
    kind: 'regular',
    note: 'Date set by separate proclamation',
  },
  { date: '2026-06-12', name: 'Independence Day', kind: 'regular' },
  { date: '2026-08-21', name: 'Ninoy Aquino Day', kind: 'special' },
  { date: '2026-08-31', name: 'National Heroes Day', kind: 'regular' },
  { date: '2026-11-01', name: "All Saints' Day", kind: 'special' },
  { date: '2026-11-02', name: "All Souls' Day", kind: 'special' },
  { date: '2026-11-30', name: 'Bonifacio Day', kind: 'regular' },
  {
    date: '2026-12-08',
    name: 'Feast of the Immaculate Conception',
    kind: 'special',
  },
  { date: '2026-12-24', name: 'Christmas Eve', kind: 'special' },
  { date: '2026-12-25', name: 'Christmas Day', kind: 'regular' },
  { date: '2026-12-30', name: 'Rizal Day', kind: 'regular' },
  { date: '2026-12-31', name: 'Last Day of the Year', kind: 'special' },
];

/** Today's date in Manila as an ISO string, whatever the visitor's timezone. */
export function manilaToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Holidays from today onward, soonest first. */
export function upcomingHolidays(limit = 3, now: Date = new Date()): Holiday[] {
  const today = manilaToday(now);
  return HOLIDAYS.filter(h => h.date >= today).slice(0, limit);
}

/** Whole days from today in Manila until the given ISO date. */
export function daysUntil(isoDate: string, now: Date = new Date()): number {
  const start = Date.parse(`${manilaToday(now)}T00:00:00Z`);
  const end = Date.parse(`${isoDate}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}
