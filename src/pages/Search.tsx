import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Search as SearchIcon, SearchX, X } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import {
  activeGovernmentCategories,
  activeServiceCategories,
  type Category,
} from '../data/yamlLoader';
import { SAMPLE_ALIAS_TERMS } from '../lib/searchAliases';
import { CATEGORY_ICONS } from '../lib/categoryIcons';
import type { Highlight, SearchOutcome } from '../lib/searchEngine';

/**
 * Site search.
 *
 * The index and the scorer live in src/lib/search*.ts and are pulled in with
 * a dynamic import, so the markdown corpus is downloaded once, only by people
 * who actually open this page, and never again. Everything after that is
 * local: no request per keystroke, which matters on mobile data.
 *
 * The page has four states and all four are designed:
 *
 *   idle       nothing typed yet, so offer the whole catalogue to browse
 *   typing     under two characters, say so rather than flashing "no results"
 *   results    ranked list with the matched passage quoted and highlighted
 *   no results a spelling suggestion when there is one, then advice, then
 *              the catalogue again so the page is never a dead end
 */

type Engine = typeof import('../lib/searchEngine');
type TreeFilter = 'all' | 'services' | 'government';

/** Mirrors MIN_QUERY_LENGTH in searchEngine, kept separate so the engine
 *  chunk stays lazy. */
const MIN_QUERY = 2;

/** Icons named in services.yaml and government.yaml, from the shared map so
 *  this page and the category cards cannot drift apart. */
const ICONS = CATEGORY_ICONS;

function renderHighlights(parts: Highlight[]) {
  return parts.map((part, index) =>
    part.hit ? (
      <mark
        key={index}
        className="rounded-sm bg-primary-100 px-0.5 text-primary-900"
      >
        {part.text}
      </mark>
    ) : (
      <span key={index}>{part.text}</span>
    )
  );
}

function CategoryCard({
  category,
  tree,
}: {
  category: Category;
  tree: string;
}) {
  const Icon = ICONS[category.icon] ?? FileText;
  return (
    <Link
      to={`/${tree}/${category.slug}`}
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/40 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Icon className="mb-3 h-5 w-5 text-primary-600" />
      <span className="font-semibold text-gray-900 group-hover:text-primary-700">
        {category.category}
      </span>
      <span className="mt-1 line-clamp-2 text-sm text-gray-700">
        {category.description}
      </span>
    </Link>
  );
}

const Search: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [engine, setEngine] = useState<Engine | null>(null);
  const [treeFilter, setTreeFilter] = useState<TreeFilter>('all');
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Only sections that have something listed under them. The rest would open
  // on an empty page.
  const browseServices = activeServiceCategories;
  const browseGovernment = activeGovernmentCategories;

  // Suggested queries are translated, not transliterated: the Filipino list
  // is made of terms the alias layer in searchAliases.ts actually resolves,
  // so a chip never leads to an empty result page.
  const commonSearches = t('searchPage.commonTerms', {
    returnObjects: true,
  }) as string[];

  const treeLabel: Record<string, string> = {
    services: t('common.services'),
    government: t('common.government'),
  };

  // Load the corpus once, on mount, and warm the index before the first
  // keystroke so the first result list is instant.
  useEffect(() => {
    let cancelled = false;
    import('../lib/searchEngine')
      .then(module => {
        module.getIndexStats();
        if (!cancelled) setEngine(module);
      })
      .catch(() => {
        // Leaving `engine` null keeps the page usable as a browse page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep ?q= in step with the box, without a history entry per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get('q') ?? '';
      if (current === query) return;
      const next = new URLSearchParams(searchParams);
      if (query) next.set('q', query);
      else next.delete('q');
      setSearchParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchParams, setSearchParams]);

  const outcome: SearchOutcome | null = useMemo(
    () => (engine ? engine.runSearch(query) : null),
    [engine, query]
  );

  const results = useMemo(() => {
    if (!outcome) return [];
    return treeFilter === 'all'
      ? outcome.results
      : outcome.results.filter(result => result.tree === treeFilter);
  }, [outcome, treeFilter]);

  // A filter that survives into a different query reads as a bug.
  useEffect(() => setTreeFilter('all'), [query]);

  useEffect(() => {
    resultRefs.current.length = results.length;
  }, [results.length]);

  // Announce late so a screen reader is not read a count for every keystroke.
  useEffect(() => {
    if (!outcome || query.trim().length < MIN_QUERY) {
      setAnnouncement('');
      return;
    }
    const timer = setTimeout(() => {
      setAnnouncement(
        t('searchPage.announce', {
          count: results.length,
          query: outcome.query,
        })
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [outcome, results.length, query, t]);

  // "/" focuses the box from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const focusResult = useCallback((index: number) => {
    const links = resultRefs.current;
    if (links.length === 0) return;
    const clamped = Math.max(0, Math.min(index, links.length - 1));
    links[clamped]?.focus();
  }, []);

  const runQuery = (value: string) => {
    setQuery(value);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'ArrowDown' ||
      (event.key === 'Enter' && results.length)
    ) {
      event.preventDefault();
      focusResult(0);
    } else if (event.key === 'Escape' && query) {
      event.preventDefault();
      setQuery('');
    }
  };

  const handleResultKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusResult(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) inputRef.current?.focus();
      else focusResult(index - 1);
    } else if (event.key === 'Escape' || event.key === 'Home') {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  const trimmed = query.trim();
  const isIdle = trimmed.length === 0;
  const isTooShort = !isIdle && trimmed.length < MIN_QUERY;
  const hasResults = results.length > 0;
  const showNoResults =
    !isIdle && !isTooShort && outcome !== null && !hasResults;

  const filters: { value: TreeFilter; label: string; count: number }[] = [
    {
      value: 'all',
      label: t('searchPage.filterAll'),
      count: outcome?.counts.all ?? 0,
    },
    {
      value: 'services',
      label: t('common.services'),
      count: outcome?.counts.services ?? 0,
    },
    {
      value: 'government',
      label: t('common.government'),
      count: outcome?.counts.government ?? 0,
    },
  ];

  return (
    <>
      <SEO
        title={t('seo.search.title')}
        description={t('seo.search.description')}
        keywords={t('seo.search.keywords')}
      />

      {/* Full container width, like the services and government catalogues:
          the text and the search box are capped individually so the browse
          grid below can still use the whole column. */}
      <Section className="pb-16">
        <div>
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('common.home'), href: '/' },
              { label: t('common.search') },
            ]}
          />
          <PageHeader
            eyebrow={t('searchPage.eyebrow')}
            title={t('searchPage.title')}
            lead={t('searchPage.lead')}
            className="mb-6"
          />

          <form
            role="search"
            onSubmit={event => event.preventDefault()}
            className="relative max-w-2xl"
          >
            <label htmlFor="site-search" className="sr-only">
              {t('common.searchLabel')}
            </label>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-600"
            />
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={t('searchPage.placeholder')}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-describedby="search-hint"
              className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-14 pl-12 text-base text-gray-900 shadow-xs transition-colors placeholder:text-gray-600 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{t('searchPage.clear')}</span>
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md border border-gray-300 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-600 sm:block"
              >
                /
              </kbd>
            )}
          </form>

          <p id="search-hint" className="mt-2 max-w-2xl text-sm text-gray-700">
            <Trans
              i18nKey="searchPage.hint"
              components={{
                kbd: <span className="font-medium text-gray-700" />,
              }}
            />
          </p>

          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>

          {/* ---- results ---- */}
          {hasResults && (
            <div className="mt-8 max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-700">
                  <Trans
                    i18nKey="searchPage.resultCount"
                    count={results.length}
                    values={{ query: outcome?.query }}
                    components={{
                      count: <span className="font-semibold text-gray-900" />,
                      query: <span className="font-semibold text-gray-900" />,
                    }}
                  />
                </p>
                {outcome &&
                  outcome.counts.services > 0 &&
                  outcome.counts.government > 0 && (
                    <div
                      role="group"
                      aria-label={t('searchPage.filterLabel')}
                      className="flex gap-1 rounded-lg bg-gray-100 p-1"
                    >
                      {filters.map(filter => (
                        <button
                          key={filter.value}
                          type="button"
                          onClick={() => setTreeFilter(filter.value)}
                          aria-pressed={treeFilter === filter.value}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none ${
                            treeFilter === filter.value
                              ? 'bg-white text-primary-700 shadow-xs'
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          {filter.label}{' '}
                          <span className="tabular-nums opacity-70">
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              <ol className="space-y-3">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      to={result.url}
                      ref={element => {
                        resultRefs.current[index] = element;
                      }}
                      onKeyDown={event => handleResultKeyDown(event, index)}
                      className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/40 focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-5"
                    >
                      <p className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                        <span className="font-medium text-primary-700">
                          {treeLabel[result.tree]}
                        </span>
                        {result.kind === 'page' && (
                          <>
                            <span aria-hidden="true" className="text-gray-400">
                              ›
                            </span>
                            <span className="text-gray-700">
                              {result.categoryName}
                            </span>
                          </>
                        )}
                        {result.kind === 'section' && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                            {t('searchPage.sectionListing')}
                          </span>
                        )}
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {renderHighlights(result.titleParts)}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-gray-700">
                        {renderHighlights(result.snippetParts)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* ---- too short ---- */}
          {isTooShort && (
            <p className="mt-8 max-w-2xl rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              {t('searchPage.tooShort')}
            </p>
          )}

          {/* ---- no results ---- */}
          {showNoResults && (
            <div className="mt-8 max-w-3xl">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-start gap-3">
                  <SearchX
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-600"
                  />
                  <div>
                    <p className="text-gray-900">
                      <Trans
                        i18nKey="searchPage.noResults"
                        values={{ query: outcome?.query }}
                        components={{
                          query: <span className="font-semibold" />,
                        }}
                      />
                    </p>
                    {outcome?.suggestion && (
                      <p className="mt-2 text-sm text-gray-700">
                        <Trans
                          i18nKey="searchPage.didYouMean"
                          values={{ suggestion: outcome.suggestion }}
                          components={{
                            suggestion: (
                              <button
                                type="button"
                                onClick={() =>
                                  runQuery(outcome.suggestion as string)
                                }
                                className="rounded font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                              />
                            ),
                          }}
                        />
                      </p>
                    )}
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      <li>{t('searchPage.tipShort')}</li>
                      <li>
                        <Trans
                          i18nKey="searchPage.tipTask"
                          components={{
                            // The label comes from the translation, so the
                            // query has to as well — otherwise the Filipino
                            // page offers one term and searches another.
                            term: (
                              <button
                                type="button"
                                onClick={() =>
                                  runQuery(t('searchPage.tipTaskTerm'))
                                }
                                className="rounded font-medium text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                              />
                            ),
                          }}
                        />
                      </li>
                      <li>
                        {t('searchPage.tipFilipino')}{' '}
                        {SAMPLE_ALIAS_TERMS.map((term, index) => (
                          <span key={term}>
                            {index > 0 && ', '}
                            <button
                              type="button"
                              onClick={() => runQuery(term)}
                              className="rounded font-medium text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                            >
                              {term}
                            </button>
                          </span>
                        ))}
                        .
                      </li>
                      <li>{t('searchPage.tipIncomplete')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- idle, and as a floor under the no results state ---- */}
          {(isIdle || showNoResults) && (
            <div className="mt-10">
              {isIdle && (
                <div className="mb-8">
                  <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
                    {t('searchPage.commonSearches')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {commonSearches.map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => runQuery(term)}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
                {t('searchPage.browseServices')}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {browseServices.map(category => (
                  <CategoryCard
                    key={category.slug}
                    category={category}
                    tree="services"
                  />
                ))}
              </div>

              <h2 className="mt-8 mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
                {t('searchPage.browseGovernment')}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {browseGovernment.map(category => (
                  <CategoryCard
                    key={category.slug}
                    category={category}
                    tree="government"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default Search;
