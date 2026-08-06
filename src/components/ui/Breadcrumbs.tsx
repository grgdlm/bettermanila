import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

/**
 * Path segments that name a section of the site rather than a piece of
 * content, so they have a translation. Everything deeper is a content slug —
 * a category or page name authored in English — and is title-cased as-is.
 */
const SECTION_KEYS: Record<string, string> = {
  services: 'common.services',
  government: 'common.government',
  search: 'common.search',
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const capitalize = (label: string) =>
  label.charAt(0).toUpperCase() + label.slice(1);

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  const { t } = useTranslation();

  // Generate breadcrumbs from current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('common.home'), href: '/' },
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Section names translate; content slugs are title-cased as authored.
      const sectionKey = SECTION_KEYS[segment];
      const label = sectionKey
        ? t(sectionKey)
        : segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav
      aria-label={t('common.breadcrumbLabel')}
      className={cn('text-sm', className)}
    >
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex min-w-0 items-center gap-x-1.5">
            {index > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-gray-400"
              />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="inline-flex items-center gap-1.5 rounded-sm text-gray-700 transition-colors hover:text-primary-700 hover:underline focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                {index === 0 && (
                  <Home aria-hidden="true" className="h-3.5 w-3.5" />
                )}
                {capitalize(item.label)}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="min-w-0 font-medium text-gray-900"
              >
                {capitalize(item.label)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
