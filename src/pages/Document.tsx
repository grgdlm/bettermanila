import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Banner } from '@bettergov/kapwa/banner';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  loadMarkdownContent,
  type MarkdownContent,
} from '../lib/markdownLoader';
import { createMarkdownComponents } from '../lib/markdownComponents';
import { Card, CardContent } from '@bettergov/kapwa/card';
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
 * Layout: a single centered column (max-w-4xl). Prose inside it is capped at
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
  const [markdownContent, setMarkdownContent] =
    useState<MarkdownContent | null>(null);
  const [nestedIndex, setNestedIndex] = useState<CategoryIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const markdownComponents = createMarkdownComponents(
    getTypographyTheme(initialTheme)
  );

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Home', href: '/' },
  ]);

  useEffect(() => {
    if (!documentSlug || !category || !categoryType) {
      setError('No document specified');
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const isGovernment = categoryType === 'government';
        const categories = isGovernment
          ? governmentCategories.categories
          : serviceCategories.categories;
        const sectionLabel = isGovernment ? 'Government' : 'Services';
        const sectionHref = isGovernment ? '/government' : '/services';
        const categoryData = categories.find(c => c.slug === category);

        // If the slug maps to its own index, render it as a nested listing
        if (isNestedCategory(documentSlug)) {
          const index = await getCategorySubcategories(documentSlug);
          setNestedIndex(index);
          setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: sectionLabel, href: sectionHref },
            {
              label: categoryData?.category ?? category,
              href: `${sectionHref}/${category}`,
            },
            {
              label: documentSlug,
              href: `${sectionHref}/${category}/${documentSlug}`,
            },
          ]);
          return;
        }

        const content = await loadMarkdownContent(
          documentSlug,
          category,
          categoryType
        );
        setMarkdownContent(content);

        setBreadcrumbs([
          { label: 'Home', href: '/' },
          { label: sectionLabel, href: sectionHref },
          {
            label: categoryData?.category ?? category,
            href: `${sectionHref}/${category}`,
          },
          {
            label: content.title ?? documentSlug,
            href: `${sectionHref}/${category}/${documentSlug}`,
          },
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load document'
        );
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [documentSlug, category, categoryType]);

  if (loading) {
    return (
      <Section>
        <div className="mx-auto max-w-4xl" aria-busy="true">
          <span className="sr-only">Loading document</span>
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
      <Section>
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs className="mb-8" items={breadcrumbs} />
          <Banner
            type="error"
            title="Document Not Found"
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
        <Section>
          <div className="mx-auto max-w-4xl">
            <Breadcrumbs className="mb-6 sm:mb-8" items={breadcrumbs} />
            {nestedIndex.title && (
              <Heading
                level={1}
                className="font-display mb-3 text-3xl font-extrabold tracking-tight text-primary-800 sm:text-4xl"
              >
                {nestedIndex.title}
              </Heading>
            )}
            {nestedIndex.description && (
              <Text className="mb-8 max-w-[65ch] text-gray-700">
                {nestedIndex.description}
              </Text>
            )}
            {nestedIndex.layout === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {nestedPages.map((page, i) => (
                  <Card hoverable key={page.slug ?? i} className="h-full">
                    <CardContent>
                      <h2 className="font-display text-lg font-bold tracking-tight text-primary-800">
                        {page.name}
                      </h2>
                      {page.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {page.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {nestedPages.map((page, i) => (
                  <Card key={page.slug ?? i}>
                    <CardContent>
                      <h2 className="font-display text-lg font-bold tracking-tight text-primary-800">
                        {page.name}
                      </h2>
                      {page.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {page.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
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
      <Section>
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs className="mb-6 sm:mb-8" items={breadcrumbs} />
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
