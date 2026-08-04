import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
          title="Government"
          description={`How the ${import.meta.env.VITE_GOVERNMENT_NAME || 'local'} government is organized: departments, emergency hotlines, news and transparency documents.`}
          keywords="local government, city departments, emergency hotlines, transparency, government offices"
        />
        <Section className="pb-16">
          <Breadcrumbs className="mb-8" />
          <PageHeader
            eyebrow="City government"
            title="The people, offices and records behind the city"
            lead="Who runs the City of Manila, the hotlines that answer when something goes wrong, and the documents every city is required to publish."
            meta={
              loaded && totalPages > 0
                ? `${totalPages} pages in ${activeGovernmentCategories.length} sections so far, with more being added.`
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
                      ? `${pages.length} ${pages.length === 1 ? 'page' : 'pages'}`
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
                  Looking for a service instead?
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-gray-700">
                  Step-by-step guides to clinics, permits, schools and garbage
                  collection.
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
          title="Section not found"
          description="The section you are looking for does not exist."
          icon
        />
        <Link
          to="/government"
          className="mt-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
        >
          Browse the government section
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
        keywords={`${categoryData.category}, local government, city government, government offices`}
      />
      <Section className="pb-16">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
            { label: categoryData.category },
          ]}
        />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <PageHeader
              size="md"
              eyebrow="City government"
              icon={categoryData.icon}
              title={categoryData.category}
              lead={categoryData.description}
            />

            <div className="mt-9">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-700 uppercase">
                In this section
              </h2>
              {!loaded ? (
                <p className="mt-4 text-sm text-gray-700">Loading pages...</p>
              ) : pages.length === 0 ? (
                <div className="mt-4 max-w-2xl rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
                  <p className="text-sm leading-relaxed text-gray-700">
                    Nothing has been published in this section yet. This site is
                    volunteer-built, and sections open as the research is
                    finished.
                  </p>
                  <Link
                    to="/government"
                    className="mt-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
                  >
                    See the sections that are ready
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              ) : pages.length === 1 ? (
                <div className="mt-4 max-w-2xl">
                  <FeaturedPageCard
                    to={`/government/${category}/${pages[0].slug}`}
                    title={pages[0].name}
                    description={pages[0].description}
                    cta="Open the page"
                  />
                  <p className="mt-3 text-sm text-gray-700">
                    Everything in this section lives on one page.
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
            <CategoryRail heading="All government sections" items={railItems} />
            <div className="mt-8 border-t border-gray-200 pt-6">
              <Link
                to="/services"
                className="group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-700 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
              >
                City services guides
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Link>
              <p className="mt-1 text-sm text-gray-700">
                Step-by-step help with permits, clinics and city programs.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
};

export default Government;
