import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Banner } from '@bettergov/kapwa/banner';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { PageHeader } from '../components/ui/PageHeader';
import SEO from '../components/SEO';
import {
  CategoryRail,
  CategorySectionCard,
  FeaturedPageCard,
  IconTile,
  PageRow,
} from '../components/ui/CategoryCard';
import {
  activeGovernmentCategories,
  getCategorySubcategories,
  governmentCategories,
  type Subcategory,
} from '../data/yamlLoader';

/**
 * The government tree: /government is the full directory, /government/:category
 * is one section.
 *
 * Most government sections hold a single page today, so the directory links
 * straight to every page, and a single-page section gets one prominent panel
 * instead of a grid with a lone card in it.
 */
const Government: React.FC = () => {
  const { category } = useParams();
  const { t } = useTranslation();
  const [pagesBySlug, setPagesBySlug] = useState<Record<
    string,
    Subcategory[]
  > | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      activeGovernmentCategories.map(
        async c =>
          [c.slug, (await getCategorySubcategories(c.slug)).pages] as const
      )
    ).then(entries => {
      if (!cancelled) setPagesBySlug(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loaded = pagesBySlug !== null;

  // The full directory at /government.
  if (!category) {
    const totalPages = pagesBySlug
      ? Object.values(pagesBySlug).reduce((n, pages) => n + pages.length, 0)
      : 0;
    return (
      <>
        <SEO
          title={t('seo.government.title')}
          description={t('seo.government.description', {
            name:
              import.meta.env.VITE_GOVERNMENT_NAME ||
              t('seo.governmentFallback'),
          })}
          keywords={t('seo.government.keywords')}
        />
        <Section className="pb-16">
          <Breadcrumbs className="mb-8" />
          <PageHeader
            eyebrow={t('government.directory.eyebrow')}
            title={t('government.directory.title')}
            lead={t('government.directory.lead')}
            meta={
              loaded && totalPages > 0
                ? t('government.directory.meta', {
                    count: totalPages,
                    sections: activeGovernmentCategories.length,
                  })
                : undefined
            }
          />

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {activeGovernmentCategories.map(c => {
              const pages = pagesBySlug?.[c.slug] ?? [];
              return (
                <CategorySectionCard
                  key={c.slug}
                  to={`/government/${c.slug}`}
                  icon={c.icon}
                  title={c.category}
                  description={c.description}
                  meta={
                    loaded
                      ? t('government.directory.pageCount', {
                          count: pages.length,
                        })
                      : undefined
                  }
                  pages={pages.map(page => ({
                    to: `/government/${c.slug}/${page.slug}`,
                    name: page.name,
                  }))}
                />
              );
            })}
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <Link
              to="/services"
              className="group flex max-w-xl items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transform-none"
            >
              <IconTile
                icon="BookOpen"
                className="transition-colors group-hover:bg-primary-100"
              />
              <span className="min-w-0 flex-1">
                <span className="font-display block text-base leading-tight font-bold tracking-tight text-primary-800">
                  {t('government.directory.crossLinkTitle')}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-gray-700">
                  {t('government.directory.crossLinkNote')}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-600 motion-reduce:transform-none"
              />
            </Link>
          </div>
        </Section>
      </>
    );
  }

  // Direct URLs may point at sections that exist in government.yaml but have
  // no published pages yet, so look the slug up in the full list.
  const categoryData = governmentCategories.categories.find(
    c => c.slug === category
  );

  if (!categoryData) {
    return (
      <Section className="pb-16">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title={t('government.section.notFoundTitle')}
          description={t('government.section.notFoundBody')}
          icon
        />
        <Link
          to="/government"
          className="mt-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
        >
          {t('government.section.notFoundCta')}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </Section>
    );
  }

  const pages = pagesBySlug?.[category] ?? [];
  const railItems = activeGovernmentCategories.map(c => ({
    to: `/government/${c.slug}`,
    icon: c.icon,
    name: c.category,
    count: pagesBySlug?.[c.slug]?.length,
    current: c.slug === category,
  }));

  return (
    <>
      <SEO
        title={categoryData.category || category}
        description={categoryData.description}
        keywords={t('seo.government.categoryKeywords', {
          category: categoryData.category,
        })}
      />
      <Section className="pb-16">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.government'), href: '/government' },
            { label: categoryData.category },
          ]}
        />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <PageHeader
              size="md"
              eyebrow={t('government.directory.eyebrow')}
              icon={categoryData.icon}
              title={categoryData.category}
              lead={categoryData.description}
            />

            <div className="mt-9">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
                {t('government.section.inThisSection')}
              </h2>
              {!loaded ? (
                <p className="mt-4 text-sm text-gray-700">
                  {t('government.section.loading')}
                </p>
              ) : pages.length === 0 ? (
                <div className="mt-4 max-w-2xl rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {t('government.section.emptyBody')}
                  </p>
                  <Link
                    to="/government"
                    className="mt-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    {t('government.section.emptyCta')}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              ) : pages.length === 1 ? (
                <div className="mt-4 max-w-2xl">
                  <FeaturedPageCard
                    to={`/government/${category}/${pages[0].slug}`}
                    title={pages[0].name}
                    description={pages[0].description}
                    cta={t('government.section.singleCta')}
                  />
                  <p className="mt-3 text-sm text-gray-700">
                    {t('government.section.singleNote')}
                  </p>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {pages.map(page => (
                    <PageRow
                      key={page.slug}
                      to={`/government/${category}/${page.slug}`}
                      title={page.name}
                      description={page.description}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="mt-12 lg:mt-0">
            <CategoryRail
              heading={t('government.section.railHeading')}
              items={railItems}
            />
            <div className="mt-8 border-t border-gray-200 pt-6">
              <Link
                to="/services"
                className="group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                {t('government.section.crossLink')}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Link>
              <p className="mt-1 text-sm text-gray-700">
                {t('government.section.crossLinkNote')}
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
};

export default Government;
