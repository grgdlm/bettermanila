import React, { useState } from 'react';
import { X, Menu, ChevronDown, Globe, Search } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import type { LanguageType } from '../../types/index';
import { Link } from 'react-router-dom';
import LiveStrip from './LiveStrip';
import { useTranslation } from 'react-i18next';
import { DRAFT_LANGUAGES, REVIEWED_LANGUAGES } from '../../i18n/languages';

/**
 * Colour comes from the shared `primary` scale in `src/index.css`, which is
 * derived from the Better Manila logo artwork. primary-800 is the logo's
 * darkest ink, primary-600 the royal blue in the body of the M. Do not
 * hardcode hex here; change the tokens instead so the whole site follows.
 */

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const changeLanguage = (newLanguage: LanguageType) => {
    i18n.changeLanguage(newLanguage);
  };

  const utilityLinks = [
    { href: 'https://bettergov.ph/about', label: 'About BetterGov' },
    { href: 'https://www.gov.ph', label: 'Official Gov.ph' },
    {
      href: 'https://manila.gov.ph/emergency-police-fire-station-hotlines/',
      label: 'Emergency hotlines',
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md">
      {/* Keyboard users get a way past the whole header. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-60 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-800 focus:shadow-lg focus:ring-2 focus:ring-primary-600"
      >
        Skip to content
      </a>
      {/* Utility band */}
      <div className="bg-primary-800 text-white">
        <div className="container mx-auto flex h-10 items-center gap-x-5 px-4">
          <LiveStrip />
          <div className="ml-auto flex items-center gap-x-5">
            <a
              href="https://bettergov.ph/join-us"
              target="_blank"
              rel="noreferrer"
              className="rounded text-xs font-semibold text-primary-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              Join us
            </a>
            {utilityLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hidden rounded text-xs text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none sm:block"
              >
                {link.label}
              </a>
            ))}
            <div className="hidden md:block">
              <label htmlFor="lang-desktop" className="sr-only">
                Language
              </label>
              {/*
                Bind to resolvedLanguage, never i18n.language: a first-time
                visitor's detected locale is region-tagged ("en-US", "fil-PH"),
                which matches no <option value> and leaves the select blank.
              */}
              <select
                id="lang-desktop"
                value={i18n.resolvedLanguage ?? 'en'}
                onChange={e => changeLanguage(e.target.value as LanguageType)}
                className="rounded border border-white/25 bg-transparent px-2 py-0.5 text-xs text-white transition-colors hover:border-white/60 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
              >
                {REVIEWED_LANGUAGES.map(lang => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="text-gray-900"
                  >
                    {lang.nativeName}
                  </option>
                ))}
                <optgroup
                  label="Draft, not yet checked"
                  className="text-gray-900"
                >
                  {DRAFT_LANGUAGES.map(lang => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="text-gray-900"
                    >
                      {lang.nativeName}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-gray-900/8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-5">
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3 rounded focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <img
                src="/logo.webp"
                alt=""
                width={960}
                height={600}
                className="h-9 w-auto sm:h-10"
              />
              <span className="min-w-0">
                <span className="text-primary-800 block truncate text-base leading-tight font-extrabold tracking-tight sm:text-[17px]">
                  BetterManila
                </span>
                <span className="mt-0.5 hidden truncate text-xs text-gray-700 sm:block">
                  {t('site_description')}
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-x-1 lg:flex">
              {mainNavigation.map(item => (
                <div key={item.label} className="group relative">
                  {/* Client-side Link, not <a>: a raw anchor forces a full
                      document reload on every top-level navigation. */}
                  <Link
                    to={item.href}
                    className="flex items-center rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    {t(`navbar.${item.label.replace(' ', '').toLowerCase()}`)}
                    {item.children && (
                      <ChevronDown
                        aria-hidden="true"
                        className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                      />
                    )}
                  </Link>
                  {/* focus-within keeps the dropdown open while its links are
                      tabbed through, so the submenu works without a mouse. */}
                  {item.children && (
                    <div className="invisible absolute left-0 z-50 mt-1 w-60 origin-top-left translate-y-1 rounded-xl border border-gray-200/80 bg-white p-1.5 opacity-0 shadow-xl shadow-gray-900/10 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div>
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/about"
                className="rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                About
              </Link>
              <Link
                to="/search"
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                <span className="sr-only">
                  {isOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="container mx-auto space-y-1 border-b border-gray-200 bg-white px-3 pt-3 pb-4">
          {/* Every top-level item is a real link. Items with children get a
              separate disclosure button beside the link — the old single
              button meant that tapping Government, Transparency, News or
              Hotlines toggled state and navigated nowhere, leaving those
              sections unreachable from a phone. */}
          {mainNavigation.map(item => (
            <div key={item.label}>
              <div className="flex items-center gap-1">
                <Link
                  to={item.href}
                  onClick={closeMenu}
                  className="flex-1 rounded-lg px-4 py-2.5 text-base font-medium text-gray-800 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                >
                  {t(`navbar.${item.label.replace(' ', '').toLowerCase()}`)}
                </Link>
                {item.children && (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    aria-expanded={activeMenu === item.label}
                    aria-label={`Show ${item.label} sections`}
                    className="rounded-lg p-2.5 text-gray-800 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 transition-transform duration-200 ${
                        activeMenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>
              {item.children && activeMenu === item.label && (
                <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-primary-200 pl-3">
                  {item.children.map(child => (
                    <Link
                      key={child.label}
                      to={child.href}
                      onClick={closeMenu}
                      className="block rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="!mt-3 space-y-1 border-t border-gray-200 pt-3">
            <Link
              to="/about"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-2.5 text-base font-medium text-gray-800 transition-colors hover:bg-primary-50 hover:text-primary-600"
            >
              About
            </Link>
            <Link
              to="/search"
              onClick={closeMenu}
              className="hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-medium text-gray-800 transition-colors"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
            </Link>
            <a
              href="https://bettergov.ph/join-us"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-4 py-2.5 text-base font-medium text-primary-600 transition-colors hover:bg-primary-50"
            >
              Join us
            </a>
          </div>

          <div className="!mt-3 border-t border-gray-200 px-4 pt-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-500" aria-hidden="true" />
              <label htmlFor="lang-mobile" className="sr-only">
                Language
              </label>
              <select
                id="lang-mobile"
                value={i18n.resolvedLanguage ?? 'en'}
                onChange={e => changeLanguage(e.target.value as LanguageType)}
                className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 transition-colors hover:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                {REVIEWED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
                <optgroup label="Draft, not yet checked">
                  {DRAFT_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
