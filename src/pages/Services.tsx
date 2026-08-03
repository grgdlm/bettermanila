import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Banner } from '@bettergov/kapwa/banner';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import Breadcrumbs from '../components/ui/Breadcrumbs';
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
          title="Services"
          description={`Step-by-step guides to ${import.meta.env.VITE_GOVERNMENT_NAME || 'local government'} services: health, education, business permits, garbage collection and more.`}
          keywords="government services, public services, local government, civic services"
        />
        <Section className="pb-16">
          <Breadcrumbs className="mb-8" />
          <p className="text-xs font-semibold tracking-[0.2em] text-primary-700 uppercase">
            City services
          </p>
          <Heading
            level={1}
            className="mt-3 mb-0 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-primary-800 md:text-4xl lg:text-4xl"
          >
            City services, explained step by step
          </Heading>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
            What the City of Manila offers, who qualifies, what to bring, and
            where to go. Volunteers research each guide and check it against
            official sources.
          </p>
          {loaded && totalGuides > 0 && (
            <p className="mt-2 text-sm text-gray-700">
              {totalGuides} guides in {activeServiceCategories.length}{' '}
              categories so far, with more being written.
            </p>
          )}

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
                      ? `${pages.length} ${pages.length === 1 ? 'guide' : 'guides'}`
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
                  Looking for City Hall itself?
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-gray-700">
                  Departments, emergency hotlines, advisories and transparency
                  records.
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
          title="Category not found"
          description="The category you are looking for does not exist."
          icon
        />
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
        >
          Browse all service categories
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
        keywords={`${categoryData.category}, government services, public services, local government`}
      />
      <Section className="pb-16">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: categoryData.category },
          ]}
        />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary-700 uppercase">
              City services
            </p>
            <div className="mt-3 flex items-center gap-4">
              <IconTile
                icon={categoryData.icon}
                className="h-12 w-12 rounded-xl"
                iconClassName="h-6 w-6"
              />
              <Heading
                level={1}
                className="mb-0 text-2xl leading-tight font-extrabold tracking-tight text-primary-800 md:text-3xl lg:text-3xl"
              >
                {categoryData.category}
              </Heading>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
              {categoryData.description}
            </p>

            <div className="mt-9">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
                In this category
              </h2>
              {!loaded ? (
                <p className="mt-4 text-sm text-gray-700">Loading guides...</p>
              ) : pages.length === 0 ? (
                <div className="mt-4 max-w-2xl rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
                  <p className="text-sm leading-relaxed text-gray-700">
                    No guides have been written for this category yet. This site
                    is volunteer-built, and sections open as the research is
                    finished.
                  </p>
                  <Link
                    to="/services"
                    className="mt-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    See the categories that are ready
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              ) : pages.length === 1 ? (
                <div className="mt-4 max-w-2xl">
                  <FeaturedPageCard
                    to={`/services/${category}/${pages[0].slug}`}
                    title={pages[0].name}
                    description={pages[0].description}
                    cta="Read the guide"
                  />
                  <p className="mt-3 text-sm text-gray-700">
                    Everything in this category lives on one page.
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
            <CategoryRail heading="All service categories" items={railItems} />
            <div className="mt-8 border-t border-gray-200 pt-6">
              <Link
                to="/government"
                className="group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                City government section
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Link>
              <p className="mt-1 text-sm text-gray-700">
                Departments, hotlines, advisories and city records.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
};

export default Services;
