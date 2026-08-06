import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Banner } from '@bettergov/kapwa/banner';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  isChunkLoadError,
  loadMarkdownContent,
  type MarkdownContent,
} from '../lib/markdownLoader';
import { createMarkdownComponents } from '../lib/markdownComponents';
import { PageHeader } from '../components/ui/PageHeader';
import { PageRow } from '../components/ui/CategoryCard';
import { getTypographyTheme } from '../lib/typographyThemes';
import {
  serviceCategories,
  governmentCategories,
  getCategorySubcategories,
  isNestedCategory,
  type Subcategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import SEO from '../components/SEO';

interface DocumentProps {
  theme?: string;
  categoryType?: 'service' | 'government';
}

/**
 * The document reader. Everything under /content renders through this page,
 * so it is where residents actually spend their time: hospital lists, fee
 * tables, office hours and hotline numbers.
 *
 * Layout: a single reading column (max-w-4xl), left-aligned in the container
 * so its left edge lines up with the listings a reader arrives from — the
 * content must not jump sideways on navigation. Prose inside it is capped at
 * a readable measure by the typography theme, while tables use the full
 * column width. The markdown's own h1 and lead paragraph act as the page
 * header, so nothing is rendered twice.
 */
const skeletonLine = (extra: string) =>
  `animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none ${extra}`;

export default function Document({
  theme: initialTheme = 'default',
  categoryType,
}: DocumentProps) {
  const { documentSlug, category } = useParams();
  const { t } = useTranslation();
  const [markdownContent, setMarkdownContent] =
    useState<MarkdownContent | null>(null);
  const [nestedIndex, setNestedIndex] = useState<CategoryIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const markdownComponents = createMarkdownComponents(
    getTypographyTheme(initialTheme)
  );

  // href is optional: the final crumb omits it so Breadcrumbs renders the
  // current page as aria-current text rather than a link to itself.
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href?: string }[]
  >([{ label: t('common.home'), href: '/' }]);

  useEffect(() => {
    if (!documentSlug || !category || !categoryType) {
      setError(t('document.noneSpecified'));
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Reset both content states: this component instance survives
        // navigation between documents, and a stale nestedIndex would win
        // over freshly loaded markdown in the render order below.
        setNestedIndex(null);
        setMarkdownContent(null);

        const isGovernment = categoryType === 'government';
        const categories = isGovernment
          ? governmentCategories.categories
          : serviceCategories.categories;
        const sectionLabel = isGovernment
          ? t('common.government')
          : t('common.services');
        const sectionHref = isGovernment ? '/government' : '/services';
        const categoryData = categories.find(c => c.slug === category);

        // If the slug maps to its own index, render it as a nested listing
        if (isNestedCategory(documentSlug)) {
          const index = await getCategorySubcategories(documentSlug);
          setNestedIndex(index);
          setBreadcrumbs([
            { label: t('common.home'), href: '/' },
            { label: sectionLabel, href: sectionHref },
            {
              label: categoryData?.category ?? category,
              href: `${sectionHref}/${category}`,
            },
            // Current page: no href, so the breadcrumb renders as
            // aria-current text instead of a link to itself.
            { label: documentSlug },
          ]);
          return;
        }

        const content = await loadMarkdownContent(
          documentSlug,
          category,
          categoryType
        );
        setMarkdownContent(content);
        // Loading succeeded, so any earlier stale-session marker for this
        // URL has served its purpose.
        sessionStorage.removeItem(`reloaded:${window.location.pathname}`);

        setBreadcrumbs([
          { label: t('common.home'), href: '/' },
          { label: sectionLabel, href: sectionHref },
          {
            label: categoryData?.category ?? category,
            href: `${sectionHref}/${category}`,
          },
          { label: content.title ?? documentSlug },
        ]);
      } catch (err) {
        // A failed chunk fetch means this tab predates the latest deploy:
        // the old hashed files it knows about are gone. One automatic
        // reload fetches the current build; the sessionStorage guard stops
        // a reload loop if something else is actually wrong.
        if (isChunkLoadError(err)) {
          const key = `reloaded:${window.location.pathname}`;
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, '1');
            window.location.reload();
            return;
          }
          setError(t('document.staleSession'));
          return;
        }
        setError(err instanceof Error ? err.message : t('document.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [documentSlug, category, categoryType, t]);

  if (loading) {
    return (
      <Section className="pb-16">
        <div className="max-w-4xl" aria-busy="true">
          <span className="sr-only">{t('document.loading')}</span>
          <div className={skeletonLine('h-4 w-56')} />
          <div className={skeletonLine('mt-10 h-9 w-3/4 rounded-lg')} />
          <div className="mt-6 space-y-3">
            <div className={skeletonLine('h-4 w-full')} />
            <div className={skeletonLine('h-4 w-11/12')} />
            <div className={skeletonLine('h-4 w-2/3')} />
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="pb-16">
        <div className="max-w-4xl">
          <Breadcrumbs className="mb-8" items={breadcrumbs} />
          <Banner
            type="error"
            title={t('document.notFoundTitle')}
            description={error}
            icon
          />
        </div>
      </Section>
    );
  }

  if (nestedIndex) {
    const nestedPages: Subcategory[] = nestedIndex.pages;
    return (
      <>
        <SEO
          title={documentSlug}
          keywords={`${documentSlug}, government services, local government`}
        />
        <Section className="pb-16">
          <div className="max-w-4xl">
            <Breadcrumbs className="mb-8" items={breadcrumbs} />
            <PageHeader
              size="md"
              eyebrow={
                categoryType === 'government'
                  ? t('government.directory.eyebrow')
                  : t('services.catalogue.eyebrow')
              }
              title={nestedIndex.title ?? documentSlug}
              lead={nestedIndex.description}
            />
            {/* These render through the shared page rows rather than plain
                cards, so every listing on the site is clickable and looks
                the same. The old kapwa Card markup was a bare div: it looked
                like a link and did nothing. */}
            {nestedPages.length > 0 && (
              <ul className="mt-9 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
                {nestedPages.map((page, i) => (
                  <PageRow
                    key={page.slug ?? i}
                    to={`/${categoryType === 'government' ? 'government' : 'services'}/${category}/${page.slug}`}
                    title={page.name}
                    description={page.description}
                  />
                ))}
              </ul>
            )}
          </div>
        </Section>
      </>
    );
  }

  if (!markdownContent) {
    return null;
  }

  return (
    <>
      <SEO
        title={markdownContent.title || documentSlug}
        description={
          markdownContent.description ||
          `Government service information for ${documentSlug}`
        }
        keywords={`${documentSlug}, government services, public services, local government`}
      />
      <Section className="pb-16">
        <div className="max-w-4xl">
          <Breadcrumbs className="mb-8" items={breadcrumbs} />
          <article>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {markdownContent.content}
            </ReactMarkdown>
          </article>
        </div>
      </Section>
    </>
  );
}
