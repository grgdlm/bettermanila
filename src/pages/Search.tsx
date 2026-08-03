import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Book,
  Building2,
  ChartBar,
  FileText,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  MessagesSquare,
  Newspaper,
  Search as SearchIcon,
  SearchX,
  Shield,
  Siren,
  Trash2,
  TreePine,
  Users,
  Wheat,
  Wrench,
  X,
} from 'lucide-react';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import { Heading } from '../components/ui/Heading';
import {
  activeGovernmentCategories,
  activeServiceCategories,
  type Category,
} from '../data/yamlLoader';
import { SAMPLE_ALIAS_TERMS } from '../lib/searchAliases';
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

/** Icons named in services.yaml and government.yaml, imported by name so the
 *  bundler can drop the rest of the icon set. */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  GraduationCap,
  Building2,
  Users,
  Wheat,
  Wrench,
  Trash2,
  TreePine,
  Shield,
  Home: HomeIcon,
  Newspaper,
  FileText,
  Book,
  ChartBar,
  MessagesSquare,
  Siren,
};

/** Real tasks that map onto pages that exist. */
const COMMON_SEARCHES = [
  'hospital',
  'garbage schedule',
  'business permit',
  'scholarship',
  'class suspension',
  'city budget',
];

const TREE_LABEL: Record<string, string> = {
  services: 'Services',
  government: 'Government',
};

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
        results.length === 1
          ? `1 result for ${outcome.query}`
          : `${results.length} results for ${outcome.query}`
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [outcome, results.length, query]);

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
    { value: 'all', label: 'All', count: outcome?.counts.all ?? 0 },
    {
      value: 'services',
      label: 'Services',
      count: outcome?.counts.services ?? 0,
    },
    {
      value: 'government',
      label: 'Government',
      count: outcome?.counts.government ?? 0,
    },
  ];

  return (
    <>
      <SEO
        title="Search"
        description="Search every service, office and document on Better Manila."
        keywords="search, Manila services, city hall, find a service"
      />

      {/* Section applies its className to both the section and the inner
          container, so padding is set on the column below instead. */}
      <Section className="bg-white py-0">
        <div className="mx-auto max-w-3xl py-10 md:py-14">
          <Heading level={1} className="mb-2 text-3xl md:text-4xl lg:text-4xl">
            Search
          </Heading>
          <p className="mb-6 text-gray-700">
            Every service page, department and transparency document on Better
            Manila, in one box.
          </p>

          <form
            role="search"
            onSubmit={event => event.preventDefault()}
            className="relative"
          >
            <label htmlFor="site-search" className="sr-only">
              Search Better Manila
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
              placeholder="Try hospital, business permit, basura"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-describedby="search-hint"
              className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-14 pl-12 text-base text-gray-900 shadow-xs transition-colors placeholder:text-gray-500 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
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
                <span className="sr-only">Clear search</span>
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

          <p id="search-hint" className="mt-2 text-sm text-gray-600">
            Press <span className="font-medium text-gray-700">/</span> to jump
            here, arrow keys to move through results, Enter to open.
          </p>

          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>

          {/* ---- results ---- */}
          {hasResults && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {results.length}
                  </span>{' '}
                  {results.length === 1 ? 'result' : 'results'} for{' '}
                  <span className="font-semibold text-gray-900">
                    {outcome?.query}
                  </span>
                </p>
                {outcome &&
                  outcome.counts.services > 0 &&
                  outcome.counts.government > 0 && (
                    <div
                      role="group"
                      aria-label="Filter results by section"
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
                          {TREE_LABEL[result.tree]}
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
                            Section listing
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
            <p className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              Keep typing. Search starts at two characters.
            </p>
          )}

          {/* ---- no results ---- */}
          {showNoResults && (
            <div className="mt-8">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-start gap-3">
                  <SearchX
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-600"
                  />
                  <div>
                    <p className="text-gray-900">
                      No results for{' '}
                      <span className="font-semibold">{outcome?.query}</span>
                    </p>
                    {outcome?.suggestion && (
                      <p className="mt-2 text-sm text-gray-700">
                        Did you mean{' '}
                        <button
                          type="button"
                          onClick={() => runQuery(outcome.suggestion as string)}
                          className="rounded font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                        >
                          {outcome.suggestion}
                        </button>
                        ?
                      </p>
                    )}
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      <li>Try one or two words instead of a full sentence.</li>
                      <li>
                        Search the task, not the office. Try{' '}
                        <button
                          type="button"
                          onClick={() => runQuery('business permit')}
                          className="rounded font-medium text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                        >
                          business permit
                        </button>{' '}
                        rather than a department name.
                      </li>
                      <li>
                        Filipino words work.{' '}
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
                      <li>
                        Not everything is written up yet. This portal is built
                        by volunteers and pages are still being added.
                      </li>
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
                    Common searches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SEARCHES.map(term => (
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
                Browse services
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {browseServices.map(category => (
                  <CategoryCard
                    key={category.slug}
                    category={category}
                    tree="services"
                  />
                ))}
              </div>

              <h2 className="mt-8 mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
                Browse government
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
