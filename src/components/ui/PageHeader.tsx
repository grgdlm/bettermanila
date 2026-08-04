import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Heading } from './Heading';
import { IconTile } from './CategoryCard';

/**
 * The standard header for an index or catalogue page: a small eyebrow naming
 * the section, the page title, a lead paragraph, and an optional line of
 * counts underneath.
 *
 * It exists because Services, Government and Search each grew their own copy
 * of this block and drifted — different type scales, different colours, and
 * on one page no eyebrow at all. Rendering them from one component is what
 * keeps the three pages looking like one site.
 *
 * Two sizes:
 *  - `lg` for a section's front page (/services, /government, /search)
 *  - `md` for a category inside it, where the title sits beside its icon
 *
 * Landing pages — the home hero, About, the 404 — deliberately use their own
 * larger treatment with a background glow, and are not built from this.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  icon,
  size = 'lg',
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Secondary line under the lead, typically a count of what is listed. */
  meta?: ReactNode;
  /** lucide icon name; renders in a tile beside the title. `md` size only. */
  icon?: string;
  size?: 'lg' | 'md';
  className?: string;
}) {
  const titleClass =
    size === 'lg'
      ? 'mb-0 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-primary-800 md:text-4xl lg:text-4xl'
      : 'mb-0 text-2xl leading-tight font-extrabold tracking-tight text-primary-800 md:text-3xl lg:text-3xl';

  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-[0.2em] text-primary-700 uppercase">
        {eyebrow}
      </p>

      {icon ? (
        <div className="mt-3 flex items-center gap-4">
          <IconTile
            icon={icon}
            className="h-12 w-12 rounded-xl"
            iconClassName="h-6 w-6"
          />
          <Heading level={1} className={titleClass}>
            {title}
          </Heading>
        </div>
      ) : (
        <Heading level={1} className={cn('mt-3', titleClass)}>
          {title}
        </Heading>
      )}

      {lead && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
          {lead}
        </p>
      )}
      {meta && <p className="mt-2 text-sm text-gray-700">{meta}</p>}
    </div>
  );
}
