import yaml from 'js-yaml';

// Type definitions for the services data
export interface Subcategory {
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
  subcategories?: Subcategory[]; // Keep for backward compatibility
}

export interface CategoryData {
  categories: Category[];
  description: string;
}

export interface CategoryIndexData {
  title?: string;
  description?: string;
  layout?: 'grid' | 'list';
  pages: Subcategory[];
}

// Import the YAML file as raw text
import servicesYamlContent from './services.yaml?raw';
import governmentActivitiesYamlContent from './government.yaml?raw';

// Import all category index files statically
import healthServicesIndex from '../../content/services/health-services/index.yaml?raw';
import educationIndex from '../../content/services/education/index.yaml?raw';
import businessIndex from '../../content/services/business/index.yaml?raw';
import socialWelfareIndex from '../../content/services/social-welfare/index.yaml?raw';
import agricultureFisheriesIndex from '../../content/services/agriculture-fisheries/index.yaml?raw';
import infrastructurePublicWorksIndex from '../../content/services/infrastructure-public-works/index.yaml?raw';
import garbageWasteDisposalIndex from '../../content/services/garbage-waste-disposal/index.yaml?raw';
import environmentIndex from '../../content/services/environment/index.yaml?raw';
import disasterPreparednessIndex from '../../content/services/disaster-preparedness/index.yaml?raw';
import housingLandUseIndex from '../../content/services/housing-land-use/index.yaml?raw';
import governmentEmergencyIndex from '../../content/government/emergency/index.yaml?raw';
import governmentDepartmentsIndex from '../../content/government/departments/index.yaml?raw';
import governmentDepartmentsLegislativeIndex from '../../content/government/departments/legislative/index.yaml?raw';
import governmentNewsIndex from '../../content/government/news/index.yaml?raw';
import governmentReportsAndStatisticsIndex from '../../content/government/reports-and-statistics/index.yaml?raw';
import governmentTransparencyIndex from '../../content/government/transparency-documents/index.yaml?raw';

// Create a mapping of category slugs to their YAML content
const categoryIndexMap: { [key: string]: string } = {
  'health-services': healthServicesIndex,
  education: educationIndex,
  business: businessIndex,
  'social-welfare': socialWelfareIndex,
  'agriculture-fisheries': agricultureFisheriesIndex,
  'infrastructure-public-works': infrastructurePublicWorksIndex,
  'garbage-waste-disposal': garbageWasteDisposalIndex,
  environment: environmentIndex,
  'disaster-preparedness': disasterPreparednessIndex,
  'housing-land-use': housingLandUseIndex,
  emergency: governmentEmergencyIndex,
  departments: governmentDepartmentsIndex,
  legislative: governmentDepartmentsLegislativeIndex,
  news: governmentNewsIndex,
  'reports-and-statistics': governmentReportsAndStatisticsIndex,
  'transparency-documents': governmentTransparencyIndex,
};

// Parse the YAML content
export const serviceCategories: CategoryData = yaml.load(
  servicesYamlContent
) as CategoryData;

export const governmentCategories: CategoryData = yaml.load(
  governmentActivitiesYamlContent
) as CategoryData;

export interface CategoryIndex {
  title?: string;
  description?: string;
  layout: 'grid' | 'list';
  pages: Subcategory[];
}

// Function to load category index data
export async function loadCategoryIndex(
  categorySlug: string
): Promise<CategoryIndex> {
  const yamlContent = categoryIndexMap[categorySlug];
  if (!yamlContent) {
    return { layout: 'list', pages: [] };
  }
  try {
    const indexData: CategoryIndexData = yaml.load(
      yamlContent
    ) as CategoryIndexData;
    return {
      title: indexData.title,
      description: indexData.description,
      layout: indexData.layout ?? 'list',
      pages: indexData.pages || [],
    };
  } catch (parseError) {
    console.warn(
      `Failed to parse YAML content for category ${categorySlug}:`,
      parseError
    );
    return { layout: 'list', pages: [] };
  }
}

// Function to get subcategories for a category (with caching)
const categoryCache = new Map<string, CategoryIndex>();

export async function getCategorySubcategories(
  categorySlug: string
): Promise<CategoryIndex> {
  if (categoryCache.has(categorySlug)) {
    return categoryCache.get(categorySlug)!;
  }

  const result = await loadCategoryIndex(categorySlug);
  categoryCache.set(categorySlug, result);
  return result;
}

/** Returns true if a slug has a registered index in categoryIndexMap */
export function isNestedCategory(slug: string): boolean {
  return slug in categoryIndexMap;
}

/**
 * True when a category has at least one page with real content behind it.
 *
 * Categories are declared in services.yaml and government.yaml as the
 * intended shape of the site, which is useful as a roadmap. Several of them
 * have no pages written yet. Listing those for a resident produces a category
 * that opens onto nothing, so browsing surfaces filter on this while direct
 * URL lookups keep using the full list.
 */
export function categoryHasPages(slug: string): boolean {
  const raw = categoryIndexMap[slug];
  if (!raw) return false;
  try {
    const data = yaml.load(raw) as CategoryIndexData;
    return Array.isArray(data?.pages) && data.pages.length > 0;
  } catch {
    return false;
  }
}

/** Service categories that currently have something to show. */
export const activeServiceCategories: Category[] =
  serviceCategories.categories.filter(c => categoryHasPages(c.slug));

/** Government categories that currently have something to show. */
export const activeGovernmentCategories: Category[] =
  governmentCategories.categories.filter(c => categoryHasPages(c.slug));
