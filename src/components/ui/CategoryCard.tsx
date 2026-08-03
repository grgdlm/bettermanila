import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * The shared building blocks of every category browsing surface: the home
 * page grids, the /services and /government catalogues, and the category
 * pages between them.
 *
 * They live together in one file so the two content trees render the same
 * way and cannot drift apart, which is how the home page once ended up with
 * two diverging copies of the same card.
 */

type IconComponent = React.ComponentType<{ className?: string }>;

function iconByName(name?: string): IconComponent | undefined {
  return name
    ? (LucideIcons[name as keyof typeof LucideIcons] as IconComponent)
    : undefined;
}

/** The icon-in-a-tinted-tile motif established by the home page hero. */
export function IconTile({
  icon,
  className,
  iconClassName,
}: {
  icon?: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = iconByName(icon);
  if (!Icon) return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600',
        className
      )}
    >
      <Icon className={cn('h-5 w-5', iconClassName)} />
    </span>
  );
}

/**
 * One card, used by the home page category grids.
 *
 * The whole card is a single link rather than a card wrapping a link, so the
 * entire surface is clickable and assistive tech announces one target instead
 * of a nested pair.
 */
export function CategoryCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transform-none"
    >
      <div className="flex items-center gap-3">
        <IconTile
          icon={icon}
          className="transition-colors group-hover:bg-primary-100"
        />
        <h3 className="font-display text-base leading-tight font-bold tracking-tight text-primary-800">
          {title}
        </h3>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      )}

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
        Open
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
        />
      </span>
    </Link>
  );
}

/**
 * One row in a category page's list of content pages. Renders an <li>, so
 * wrap a set of these in a <ul> (the pages use a bordered, divided list).
 */
export function PageRow({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description?: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-start gap-4 p-4 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none focus-visible:ring-inset sm:p-5"
      >
        <span className="min-w-0 flex-1">
          <span className="font-display block text-base leading-snug font-bold tracking-tight text-primary-800 transition-colors group-hover:text-primary-600">
            {title}
          </span>
          {description && (
            <span className="mt-1 block text-sm leading-relaxed text-gray-700">
              {description}
            </span>
          )}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-600 motion-reduce:transform-none"
        />
      </Link>
    </li>
  );
}

/**
 * The single prominent panel a category shows when it holds exactly one
 * page. A grid with one card in it reads as broken; this reads as a front
 * door to the page itself.
 */
export function FeaturedPageCard({
  to,
  title,
  description,
  cta = 'Open the page',
}: {
  to: string;
  title: string;
  description?: string;
  cta?: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-xl border border-primary-200 bg-primary-50 p-6 transition-all hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-8"
    >
      <span className="font-display block text-xl leading-tight font-bold tracking-tight text-primary-800">
        {title}
      </span>
      {description && (
        <span className="mt-3 block max-w-xl text-base leading-relaxed text-gray-700">
          {description}
        </span>
      )}
      <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-primary-500">
        {cta}
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
        />
      </span>
    </Link>
  );
}

export interface CategoryRailItem {
  to: string;
  icon?: string;
  name: string;
  count?: number;
  current?: boolean;
}

/**
 * Sideways navigation between the categories of one content tree. Sits
 * beside the page list on a category page so a reader can move to a sibling
 * category without going back up.
 */
export function CategoryRail({
  heading,
  items,
}: {
  heading: string;
  items: CategoryRailItem[];
}) {
  return (
    <nav aria-label={heading}>
      <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
        {heading}
      </h2>
      <ul className="mt-3 space-y-1">
        {items.map(item => {
          const Icon = iconByName(item.icon);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={item.current ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm leading-snug transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none',
                  item.current
                    ? 'bg-primary-50 font-semibold text-primary-800'
                    : 'font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700'
                )}
              >
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      'h-4 w-4 shrink-0',
                      item.current
                        ? 'text-primary-600'
                        : 'text-gray-500 transition-colors group-hover:text-primary-600'
                    )}
                  />
                )}
                <span className="min-w-0 flex-1">{item.name}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                      item.current
                        ? 'bg-white text-primary-700'
                        : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * One category block on the /services or /government catalogue page: the
 * category header plus direct links to every page inside it, so the
 * catalogue answers "what exactly is here" rather than repeating the home
 * page grid.
 */
export function CategorySectionCard({
  to,
  icon,
  title,
  description,
  meta,
  pages,
}: {
  to: string;
  icon?: string;
  title: string;
  description?: string;
  meta?: string;
  pages: { to: string; name: string }[];
}) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <IconTile icon={icon} />
          <div className="min-w-0">
            <h2 className="font-display text-lg leading-tight font-bold tracking-tight">
              <Link
                to={to}
                className="rounded text-primary-800 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                {title}
              </Link>
            </h2>
            {meta && (
              <p className="mt-0.5 text-xs font-semibold text-gray-700">
                {meta}
              </p>
            )}
          </div>
        </div>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {description}
          </p>
        )}
      </div>
      {pages.length > 0 && (
        <ul className="mt-auto divide-y divide-gray-100 border-t border-gray-200">
          {pages.map(page => (
            <li key={page.to}>
              <Link
                to={page.to}
                className="group flex items-center gap-3 px-5 py-3 text-sm leading-snug font-medium text-gray-800 transition-colors hover:bg-gray-50 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none focus-visible:ring-inset sm:px-6"
              >
                <span className="min-w-0 flex-1">{page.name}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-600 motion-reduce:transform-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
