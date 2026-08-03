import { CalendarDays } from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import {
  HOLIDAY_SOURCE,
  daysUntil,
  upcomingHolidays,
} from '../../data/holidays';

/**
 * The next few Philippine holidays.
 *
 * The clock, weather and peso rate that used to sit beside this now ride in
 * the navbar's utility band, where they stay visible while scrolling. Holidays
 * stayed here because they are something you read once and plan around, not
 * something you glance at.
 *
 * Dates come from the proclamation named in the footnote. Later proclamations
 * can add or move dates, and the footnote says so rather than implying this is
 * a live feed.
 */
export default function UpcomingHolidays() {
  const now = new Date();
  const holidays = upcomingHolidays(4, now);

  if (!holidays.length) return null;

  return (
    <Section className="bg-gray-50">
      <Heading
        level={2}
        className="mb-0 text-2xl font-extrabold tracking-tight text-primary-800 md:text-3xl"
      >
        Upcoming holidays
      </Heading>
      <p className="mt-3 mb-8 max-w-2xl text-base leading-relaxed text-gray-600">
        Regular holidays and special days declared for {HOLIDAY_SOURCE.year}.
        City offices generally close on these, so plan any transaction around
        them.
      </p>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {holidays.map(holiday => {
          const days = daysUntil(holiday.date, now);
          const when = new Intl.DateTimeFormat('en-PH', {
            timeZone: 'Asia/Manila',
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }).format(new Date(`${holiday.date}T00:00:00+08:00`));

          return (
            <li
              key={holiday.date}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5"
            >
              <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                {days === 0
                  ? 'Today'
                  : days === 1
                    ? 'Tomorrow'
                    : `In ${days} days`}
              </span>
              <span className="font-display mt-3 text-lg leading-snug font-bold tracking-tight text-primary-800">
                {holiday.name}
              </span>
              <span className="mt-1 text-sm text-gray-700">{when}</span>
              <span className="mt-3 text-xs text-gray-600">
                {holiday.kind === 'regular' && 'Regular holiday'}
                {holiday.kind === 'special' && 'Special non-working day'}
                {holiday.kind === 'working' &&
                  'Special working day, offices open'}
                {holiday.note ? `. ${holiday.note}` : ''}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-gray-600">
        Source: {HOLIDAY_SOURCE.label}. Later proclamations can add, move or
        cancel dates.{' '}
        <a
          href={HOLIDAY_SOURCE.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-600"
        >
          Read the proclamation
        </a>
      </p>
    </Section>
  );
}
