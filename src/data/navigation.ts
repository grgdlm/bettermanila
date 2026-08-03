import type { NavigationItem } from '../types';
import {
  activeGovernmentCategories,
  activeServiceCategories,
} from './yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: (activeServiceCategories as Category[]).map(category => ({
      label: category.category,
      href: `/services/${category.slug}`,
    })),
  },
  {
    label: 'Government',
    href: '/government/departments',
  },
  {
    label: 'Transparency',
    href: '/government/transparency-documents',
  },
  {
    label: 'News',
    href: '/government/news',
  },
  {
    // The city publishes its hotlines only as images, which cannot be searched,
    // copied into a dialer or read by a screen reader. This points at our
    // transcription, which links prominently back to the city's own page so
    // anyone can verify it against the source.
    label: 'Hotlines',
    href: '/government/emergency/hotlines',
  },
];

/**
 * Footer navigation.
 *
 * Everything listed here has to resolve to a page that exists. The starter
 * kit this site was forked from shipped the national BetterGov site map, so
 * the footer pointed at /about, /accessibility, /privacy, /terms, /sitemap,
 * /discord and /philippines/holidays. None of those are routes here, and the
 * catch-all document route swallows unknown paths, so they did not even fail
 * honestly: they rendered "Document not found" under a working-looking URL.
 *
 * Category links are built from the active lists in yamlLoader, never from
 * the raw lists in services.yaml and government.yaml. Several categories are
 * declared as the intended shape of the site but have no pages written yet,
 * and linking those sends a resident to a page with nothing on it.
 *
 * There is no social row. The starter kit aimed all four icons at the
 * national accounts (facebook.com/govph and friends), which do not belong to
 * this project. Better Manila does have a Facebook page, but its address has
 * not been confirmed, and a guessed link in the footer of a civic site is
 * worse than no link at all. Add it below once someone verifies it.
 */

export interface FooterLink {
  /**
   * Literal text. Used where the label comes from content data, which is
   * authored in English only, the same way the navbar renders its category
   * children.
   */
  label?: string;
  /** i18next key in the `common` namespace, for interface strings. */
  labelKey?: string;
  href: string;
  /** Off site. Rendered as a plain anchor and marked as leaving the site. */
  external?: boolean;
}

export interface FooterSection {
  titleKey: string;
  links: FooterLink[];
}

export const REPO_URL = 'https://github.com/grgdlm/bettermanila';
export const OFFICIAL_CITY_URL = 'https://manila.gov.ph';

/**
 * Deep links that beat the category page they would otherwise produce.
 *
 * Emergency holds exactly one page, the hotline numbers. Someone reaching for
 * a number to call should land on the numbers, not on a list with one item.
 */
const GOVERNMENT_DEEP_LINKS: Record<string, FooterLink | undefined> = {
  emergency: {
    label: 'Emergency hotlines',
    href: '/government/emergency/hotlines',
  },
};

export const footerNavigation: {
  sections: FooterSection[];
  repoUrl: string;
  officialCityUrl: string;
} = {
  sections: [
    {
      titleKey: 'footer.sections.services',
      links: [
        { labelKey: 'footer.links.allServices', href: '/services' },
        ...activeServiceCategories.map(category => ({
          label: category.category,
          href: `/services/${category.slug}`,
        })),
      ],
    },
    {
      titleKey: 'footer.sections.government',
      links: [
        { labelKey: 'footer.links.allGovernment', href: '/government' },
        ...activeGovernmentCategories.map(
          category =>
            GOVERNMENT_DEEP_LINKS[category.slug] ?? {
              label: category.category,
              href: `/government/${category.slug}`,
            }
        ),
      ],
    },
    {
      titleKey: 'footer.sections.site',
      links: [
        { labelKey: 'footer.links.home', href: '/' },
        { labelKey: 'footer.links.about', href: '/about' },
        { labelKey: 'footer.links.search', href: '/search' },
      ],
    },
    {
      // National, not municipal. The heading says so, because a resident
      // looking for Manila's own budget should not be handed data.gov.ph and
      // left to work out that it is a different government.
      titleKey: 'footer.sections.national',
      links: [
        {
          label: 'Official Gazette',
          href: 'https://www.officialgazette.gov.ph',
          external: true,
        },
        {
          label: 'Freedom of Information',
          href: 'https://www.foi.gov.ph',
          external: true,
        },
        { label: 'data.gov.ph', href: 'https://data.gov.ph', external: true },
        {
          label: '8888 Citizens Complaint Center',
          href: 'https://contactcenterngbayan.gov.ph',
          external: true,
        },
      ],
    },
  ],
  repoUrl: REPO_URL,
  officialCityUrl: OFFICIAL_CITY_URL,
};
