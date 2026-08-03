import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { footerNavigation, type FooterLink } from '../../data/navigation';

/**
 * Site footer.
 *
 * Three jobs, in this order: say plainly what this site is and is not, invite
 * the reader to correct it, and offer a site map of pages that actually
 * exist. The link data lives in src/data/navigation.ts, where the service and
 * government columns are generated from the categories that have content, so
 * an empty category can never appear here.
 *
 * Colour comes from the shared primary scale in src/index.css. primary-900 is
 * the ground; primary-200 and primary-300 are the muted inks that still clear
 * 4.5:1 against it (12.2:1 and 8.6:1). No hardcoded hex.
 */

/** Shared link styling for the columns. */
const LINK_CLASS =
  'inline-flex items-start gap-1.5 rounded text-sm text-primary-200 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  const renderLink = (link: FooterLink) => {
    const label = link.labelKey ? t(link.labelKey) : link.label;

    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
        >
          <span>{label}</span>
          <ExternalLink
            aria-hidden="true"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70"
          />
          <span className="sr-only">{t('footer.newTab')}</span>
        </a>
      );
    }

    return (
      <Link to={link.href} className={LINK_CLASS}>
        {label}
      </Link>
    );
  };

  return (
    <footer className="bg-primary-900 text-white">
      <h2 className="sr-only">{t('footer.landmark')}</h2>

      <div className="container mx-auto px-4 pt-14 pb-8">
        {/* What this site is, and how to fix it when it is wrong */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              {/* The white mark, for dark surfaces. logo-dark is its
                  counterpart for light ones. */}
              <img
                src="/logo-white.webp"
                alt=""
                width={600}
                height={371}
                className="h-10 w-auto"
              />
              <div>
                <div className="font-display text-base leading-tight font-bold">
                  {t('site_name')}
                </div>
                <div className="mt-0.5 text-xs text-primary-300">
                  {t('footer.tagline')}
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-primary-200">
              {t('footer.disclaimer')}
            </p>

            <a
              href={footerNavigation.officialCityUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-white underline decoration-primary-400 underline-offset-4 transition-colors hover:decoration-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              {t('footer.officialSite')}
              <ExternalLink
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 opacity-70"
              />
              <span className="sr-only">{t('footer.newTab')}</span>
            </a>
          </div>

          <div className="w-full rounded-xl border border-white/15 bg-white/5 p-5 lg:max-w-sm">
            <h3 className="font-display text-sm font-bold">
              {t('footer.contribute.title')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-200">
              {t('footer.contribute.body')}
            </p>
            <a
              href={footerNavigation.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              <Github aria-hidden="true" className="h-4 w-4 shrink-0" />
              {t('footer.contribute.cta')}
              <span className="sr-only">{t('footer.newTab')}</span>
            </a>
          </div>
        </div>

        {/* The site map. Every destination below is a page that exists. */}
        <nav
          aria-label={t('footer.navLabel')}
          className="mt-12 border-t border-white/10 pt-10"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerNavigation.sections.map(section => (
              <div key={section.titleKey}>
                <h3 className="font-display text-xs font-bold tracking-[0.16em] text-white uppercase">
                  {t(section.titleKey)}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map(link => (
                    <li key={link.href}>{renderLink(link)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-primary-300 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.copyright', { year })}</p>
          <p>{t('footer.builtBy')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
