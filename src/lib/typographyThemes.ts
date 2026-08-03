/**
 * Typography theme configuration for markdown content.
 *
 * These classes are the whole design system for document pages. The content
 * under /content is plain markdown, so every heading, paragraph, table and
 * divider a resident reads is styled from here.
 *
 * Layout intent:
 *
 * - Reading measure: prose elements (p, ul, ol) are capped at 65ch so long
 *   explanations stay readable, while tables and headings take the full
 *   document column. That resolves the conflict between comfortable line
 *   length and tables that want width.
 * - Section rhythm: the markdown uses `---` between sections. The hr renders
 *   as a quiet hairline that owns the section gap, and any heading directly
 *   after one drops its own top margin via the [hr+&] variant so spacing
 *   stays even instead of doubling.
 * - Lead paragraph: the first paragraph after any h1 renders larger via the
 *   [&+p] variant, giving each page a proper standfirst.
 * - Contrast: body copy uses gray-700 or darker. In this palette gray-500
 *   and gray-600 fall below 4.5:1 on white, so they are reserved for
 *   decorative strokes only.
 */

export interface TypographyTheme {
  name: string;
  components: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
    p?: string;
    small?: string;
    ul?: string;
    ol?: string;
    li?: string;
    'li.ordered'?: string; // Special styling for ordered list items
    blockquote?: string;
    code?: string;
    pre?: string;
    a?: string;
    strong?: string;
    em?: string;
    hr?: string;
    table?: string;
    thead?: string;
    tbody?: string;
    tr?: string;
    th?: string;
    td?: string;
  };
}

// Default theme with Tailwind classes
export const defaultTheme: TypographyTheme = {
  name: 'default',
  components: {
    h1: 'font-display mt-2 mb-4 text-3xl leading-tight font-extrabold tracking-tight text-balance text-primary-800 sm:text-4xl [hr+&]:mt-0 [&+p]:mb-5 [&+p]:text-lg [&+p]:leading-relaxed',
    h2: 'font-display mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-primary-800 [hr+&]:mt-0',
    h3: 'font-display mt-10 mb-3 scroll-mt-24 text-xl font-bold tracking-tight text-gray-900 [hr+&]:mt-0',
    h4: 'mt-8 mb-2 scroll-mt-24 text-base font-semibold text-gray-900',
    h5: 'mt-6 mb-2 text-sm font-semibold text-gray-900',
    h6: 'mt-6 mb-2 text-sm font-semibold tracking-wide text-gray-700 uppercase',
    p: 'mb-4 max-w-[65ch] text-base leading-relaxed text-gray-700',
    small: 'text-sm text-gray-700',
    ul: 'mb-5 max-w-[65ch] list-disc space-y-2 pl-5 marker:text-primary-400',
    ol: 'mb-5 max-w-[65ch] list-decimal space-y-2 pl-5 marker:font-semibold marker:text-primary-700',
    li: 'pl-1.5 text-base leading-relaxed text-gray-700 [&>p]:mb-0',
    blockquote:
      'mt-10 mb-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5 [hr+&]:mt-0 [&_p]:mb-0 [&_p]:max-w-none [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p+p]:mt-2',
    code: 'rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800',
    pre: 'mb-5 overflow-x-auto rounded-xl bg-gray-900 p-4 font-mono text-sm leading-relaxed text-gray-100',
    a: 'rounded-sm font-medium text-primary-700 underline decoration-primary-300 underline-offset-[3px] transition-colors [overflow-wrap:anywhere] hover:text-primary-600 hover:decoration-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none',
    strong: 'font-semibold text-gray-900',
    em: 'italic',
    hr: 'my-10 h-px border-0 bg-gray-200',
    table:
      'w-full border-collapse text-left text-sm [&_td:first-child]:font-medium [&_td:first-child]:text-gray-900',
    thead: 'bg-primary-50',
    tbody:
      'divide-y divide-gray-100 bg-white [&>tr]:transition-colors [&>tr:hover]:bg-primary-50/40',
    tr: '',
    th: 'border-b border-primary-100 px-4 py-3 text-left text-xs font-semibold tracking-wider text-primary-800 uppercase',
    td: 'px-4 py-3 align-top leading-relaxed text-gray-700',
  },
};

// Available themes
export const typographyThemes: Record<string, TypographyTheme> = {
  default: defaultTheme,
};

/**
 * Get a typography theme by name
 */
export function getTypographyTheme(
  themeName: string = 'default'
): TypographyTheme {
  return typographyThemes[themeName] || defaultTheme;
}
