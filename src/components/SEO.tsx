import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  /** Set on pages that must not enter search indexes, such as the 404. */
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = import.meta.env.VITE_SITE_NAME || 'BetterManila',
  noindex = false,
}: SEOProps) {
  const { i18n } = useTranslation();
  // og:locale has to name the language actually rendered. It was pinned to
  // en_PH, which mislabelled every page once the site started shipping
  // Filipino.
  const ogLocale = `${i18n.resolvedLanguage ?? 'en'}_PH`;
  // This is an independent volunteer project. The fallbacks must never claim
  // to be the official government website — that is the one thing every
  // disclaimer on the site exists to deny.
  const defaultTitle = `${siteName} — an independent guide to the City of Manila`;
  const defaultDescription =
    import.meta.env.VITE_SITE_DESCRIPTION ||
    `${siteName} is an independent, open-source portal that makes City of Manila public information easy to find: services, departments, budgets and ordinances, in plain language.`;
  const defaultKeywords =
    import.meta.env.VITE_SITE_KEYWORDS ||
    'government, local government, services, public services, civic services';

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  // Fall back to the production domain so og:url and og:image stay absolute
  // even when no environment variables are configured on the host.
  const siteUrl = (
    import.meta.env.VITE_WEBSITE_URL || 'https://bettermanila.org'
  ).replace(/\/+$/, '');
  const fullUrl = url || siteUrl;
  const ogImage = image || import.meta.env.VITE_OG_IMAGE_URL || '/og-image.jpg';
  // Scrapers (Facebook included) require an absolute og:image URL.
  const fullImage = /^https?:\/\//.test(ogImage)
    ? ogImage
    : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  const twitterHandle = import.meta.env.VITE_TWITTER_HANDLE || '';

  return (
    <Helmet>
      {/* Per-page tags only. Static tags that never change per route —
          viewport, charset, favicons, preconnects — ship once in index.html
          and are not repeated here. */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={siteName} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter card tags use name=, not property=, per their spec */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      {/* Matches --color-primary-600 in src/index.css; meta tags cannot read
          CSS custom properties, so the hex is repeated here. */}
      <meta name="theme-color" content="#2846b4" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
