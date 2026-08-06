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
  activeServiceCategories,
  getCategorySubcategories,
  serviceCategories,
  type Subcategory,
} from '../data/yamlLoader';

/**
 * The services tree: /services is the full catalogue, /services/:category is
 * one category.
 *
 * The catalogue lists every published guide under its category header, so it
 * adds a level of detail the home page grid does not have. The category page
 * pairs the guide list with a rail of sibling categories, so a reader always
 * knows which tree they are in and can move sideways without going back.
 */
const Services: React.FC = () => {
  const { category } = useParams();
  const { t } = useTranslation();
  const [pagesBySlug, setPagesBySlug] = useState<Record<
    string,
    Subcategory[]
  > | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      activeServiceCategories.map(
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

  // The full catalogue at /services.
  if (!category) {
    const totalGuides = pagesBySlug
      ? Object.values(pagesBySlug).reduce((n, pages) => n + pages.length, 0)
      : 0;
    return (
      <>
        <SEO
          title={t('seo.services.title')}
          description={t('seo.services.description', {
            name:
              import.meta.env.VITE_GOVERNMENT_NAME || t('seo.servicesFallback'),
          })}
          keywords={t('seo.services.keywords')}
        />
        <Section className="pb-16">
          <Breadcrumbs className="mb-8" />
          <PageHeader
            eyebrow={t('services.catalogue.eyebrow')}
            title={t('services.catalogue.title')}
            lead={t('services.catalogue.lead')}
            meta={
              loaded && totalGuides > 0
                ? t('services.catalogue.meta', {
                    count: totalGuides,
                    categories: activeServiceCategories.length,
                  })
                : undefined
            }
          />

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {activeServiceCategories.map(c => {
              const pages = pagesBySlug?.[c.slug] ?? [];
              return (
                <CategorySectionCard
                  key={c.slug}
                  to={`/services/${c.slug}`}
                  icon={c.icon}
                  title={c.category}
                  description={c.description}
                  meta={
                    loaded
                      ? t('services.catalogue.guideCount', {
                          count: pages.length,
                        })
                      : undefined
                  }
                  pages={pages.map(page => ({
                    to: `/services/${c.slug}/${page.slug}`,
                    name: page.name,
                  }))}
                />
              );
            })}
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <Link
              to="/government"
              className="group flex max-w-xl items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/5 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transform-none"
            >
              <IconTile
                icon="Landmark"
                className="transition-colors group-hover:bg-primary-100"
              />
              <span className="min-w-0 flex-1">
                <span className="font-display block text-base leading-tight font-bold tracking-tight text-primary-800">
                  {t('services.catalogue.crossLinkTitle')}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-gray-700">
                  {t('services.catalogue.crossLinkNote')}
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

  // Direct URLs may point at categories that exist in services.yaml but have
  // no published guides yet, so look the slug up in the full list.
  const categoryData = serviceCategories.categories.find(
    c => c.slug === category
  );

  if (!categoryData) {
    return (
      <Section className="pb-16">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title={t('services.category.notFoundTitle')}
          description={t('services.category.notFoundBody')}
          icon
        />
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
        >
          {t('services.category.notFoundCta')}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </Section>
    );
  }

  const pages = pagesBySlug?.[category] ?? [];
  const railItems = activeServiceCategories.map(c => ({
    to: `/services/${c.slug}`,
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
        keywords={t('seo.services.categoryKeywords', {
          category: categoryData.category,
        })}
      />
      <Section className="pb-16">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.services'), href: '/services' },
            { label: categoryData.category },
          ]}
        />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <PageHeader
              size="md"
              eyebrow={t('services.catalogue.eyebrow')}
              icon={categoryData.icon}
              title={categoryData.category}
              lead={categoryData.description}
            />

            <div className="mt-9">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
                {t('services.category.inThisCategory')}
              </h2>
              {!loaded ? (
                <p className="mt-4 text-sm text-gray-700">
                  {t('services.category.loading')}
                </p>
              ) : pages.length === 0 ? (
                <div className="mt-4 max-w-2xl rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {t('services.category.emptyBody')}
                  </p>
                  <Link
                    to="/services"
                    className="mt-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    {t('services.category.emptyCta')}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              ) : pages.length === 1 ? (
                <div className="mt-4 max-w-2xl">
                  <FeaturedPageCard
                    to={`/services/${category}/${pages[0].slug}`}
                    title={pages[0].name}
                    description={pages[0].description}
                    cta={t('services.category.singleCta')}
                  />
                  <p className="mt-3 text-sm text-gray-700">
                    {t('services.category.singleNote')}
                  </p>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {pages.map(page => (
                    <PageRow
                      key={page.slug}
                      to={`/services/${category}/${page.slug}`}
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
              heading={t('services.category.railHeading')}
              items={railItems}
            />
            <div className="mt-8 border-t border-gray-200 pt-6">
              <Link
                to="/government"
                className="group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                {t('services.category.crossLink')}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Link>
              <p className="mt-1 text-sm text-gray-700">
                {t('services.category.crossLinkNote')}
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
};

export default Services;
