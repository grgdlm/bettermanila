/**
 * Build time search index for Better Manila.
 *
 * Every markdown page under content/ is pulled in as raw text with
 * import.meta.glob, converted to plain text, and folded into an inverted
 * index. Nothing is fetched at runtime: the whole corpus ships in the chunk
 * that imports this module, so search works on a slow connection and after
 * the first load it costs nothing.
 *
 * This module is deliberately only imported dynamically (see Search.tsx) so
 * the corpus is not part of the bundle every other page pays for.
 *
 * Two kinds of document go in:
 *
 * - 'page'    a markdown file that really exists, so the result link always
 *             opens real content.
 * - 'section' a category listing, built from the YAML catalogue. Roughly half
 *             the pages listed in the YAML have no markdown file yet, so
 *             those titles are searchable through their section rather than
 *             being offered as links that would land on "Document Not Found".
 */

import yaml from 'js-yaml';
import { serviceCategories, governmentCategories } from '../data/yamlLoader';

/** Which part of a document a term was found in. Bit flags. */
export const FIELD = {
  TITLE: 1,
  ALIAS: 2,
  HEADING: 4,
  DESCRIPTION: 8,
  CATEGORY: 16,
  BODY: 32,
} as const;

export type Tree = 'services' | 'government';

export interface SearchDoc {
  id: string;
  kind: 'page' | 'section';
  title: string;
  url: string;
  tree: Tree;
  categoryName: string;
  categorySlug: string;
  description: string;
  /** Plain text of the page, used for snippets. */
  body: string;
}

export interface Posting {
  /** index into SearchIndex.docs */
  doc: number;
  /** OR of FIELD flags */
  fields: number;
  /** occurrences in the body, used as a weak tie breaker */
  count: number;
}

export interface SearchIndex {
  docs: SearchDoc[];
  postings: Map<string, Posting[]>;
  /** every indexed term, sorted, for prefix and fuzzy lookups */
  vocab: string[];
  pageCount: number;
  sectionCount: number;
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'can',
  'do',
  'does',
  'for',
  'from',
  'has',
  'have',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'they',
  'this',
  'to',
  'was',
  'were',
  'will',
  'with',
  'you',
  'your',
]);

/** Lowercase, strip diacritics, straighten curly quotes. */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .toLowerCase();
}

/**
 * Split text into match tokens. Hyphenated words are indexed both split and
 * joined, so "check-ups" is reachable from "checkup" and "e-waste" from
 * "ewaste". Apostrophes are dropped, so "mayor's" indexes as "mayors".
 */
export function tokenize(input: string): string[] {
  const out: string[] = [];
  for (const raw of normalizeText(input).split(/[^a-z0-9'-]+/)) {
    if (!raw) continue;
    const word = raw.replace(/'/g, '');
    if (word.includes('-')) {
      const joined = word.replace(/-/g, '');
      if (joined.length > 1) out.push(joined);
      for (const part of word.split('-')) {
        if (part.length > 1) out.push(part);
      }
    } else if (word.length > 1) {
      out.push(word);
    }
  }
  return out;
}

/** Query side tokens: stop words go, unless that would leave nothing. */
export function tokenizeQuery(input: string): string[] {
  const all = tokenize(input);
  const meaningful = all.filter(term => !STOP_WORDS.has(term));
  return meaningful.length > 0 ? meaningful : all;
}

function stripInline(value: string): string {
  return value
    .replace(/\*\*|__|`/g, '')
    .replace(/(^|\s)[*_](\S)/g, '$1$2')
    .replace(/(\S)[*_](\s|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Markdown to readable plain text. Tables, lists and links are flattened
 * rather than dropped, because a lot of the useful detail on these pages
 * lives inside tables.
 */
function markdownToText(markdown: string): string {
  const source = markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ');

  const lines: string[] = [];
  for (const rawLine of source.split('\n')) {
    let line = rawLine.trim();
    if (!line) continue;
    // horizontal rules and table separator rows carry no meaning
    if (/^([-*_]\s*){3,}$/.test(line)) continue;
    if (line.startsWith('|') && /^[|\s:-]+$/.test(line)) continue;

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const text = stripInline(heading[2]);
      if (text) lines.push(text);
      continue;
    }

    line = line.replace(/^>\s?/, '');
    line = line.replace(/^(?:[-*+]|\d+\.)\s+/, '');
    line = line.replace(/^\[[ xX]\]\s*/, '');

    if (line.startsWith('|')) {
      line = line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => stripInline(cell))
        .filter(Boolean)
        .join(' - ');
    } else {
      line = stripInline(line);
    }
    if (line) lines.push(line);
  }
  return lines.join(' ').replace(/\s+/g, ' ').trim();
}

/** Collect the markdown headings, which rank between title and body. */
function collectHeadings(markdown: string): string[] {
  const out: string[] = [];
  for (const line of markdown.split('\n')) {
    const heading = line.trim().match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      const text = stripInline(heading[1]);
      if (text) out.push(text);
    }
  }
  return out;
}

/**
 * Same substitution rule the document viewer uses: companion JSON first, then
 * VITE_ env vars. Without it the mayor's name would not be searchable and
 * snippets would be full of {PLACEHOLDER} tokens.
 */
function interpolate(content: string, data: Record<string, unknown>): string {
  return content.replace(/\{([A-Z0-9_]+)\}/g, (match, key: string) => {
    if (key in data) return String(data[key]);
    const value = import.meta.env[`VITE_${key}`];
    return value !== undefined ? String(value) : match;
  });
}

const rawMarkdown = import.meta.glob('../../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const rawCompanionJson = import.meta.glob('../../content/**/*.json', {
  import: 'default',
  eager: true,
}) as Record<string, Record<string, unknown>>;

const rawCategoryIndex = import.meta.glob('../../content/**/index.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

interface YamlPage {
  name?: string;
  slug?: string;
  description?: string;
}

/** category slug -> pages listed in its index.yaml */
function readCategoryPages(): Map<string, YamlPage[]> {
  const map = new Map<string, YamlPage[]>();
  for (const [path, raw] of Object.entries(rawCategoryIndex)) {
    const match = path.match(
      /\/content\/(services|government)\/([^/]+)\/index\.yaml$/
    );
    if (!match) continue;
    try {
      const parsed = yaml.load(raw) as { pages?: YamlPage[] } | undefined;
      map.set(`${match[1]}/${match[2]}`, parsed?.pages ?? []);
    } catch {
      // A malformed index should not take search down with it.
      map.set(`${match[1]}/${match[2]}`, []);
    }
  }
  return map;
}

function titleFromSlug(slug: string): string {
  const words = slug.replace(/-/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

interface DocDraft {
  doc: SearchDoc;
  fields: { text: string; field: number }[];
}

function buildDrafts(): DocDraft[] {
  const drafts: DocDraft[] = [];
  const categoryPages = readCategoryPages();

  const categoryMeta = new Map<
    string,
    { name: string; description: string; tree: Tree }
  >();
  for (const category of serviceCategories.categories) {
    categoryMeta.set(`services/${category.slug}`, {
      name: category.category,
      description: category.description,
      tree: 'services',
    });
  }
  for (const category of governmentCategories.categories) {
    categoryMeta.set(`government/${category.slug}`, {
      name: category.category,
      description: category.description,
      tree: 'government',
    });
  }

  // ---- markdown pages ----------------------------------------------------
  for (const [path, raw] of Object.entries(rawMarkdown)) {
    // Only content/<tree>/<category>/<page>.md is routable. Anything nested
    // deeper has no route in App.tsx, so indexing it would produce dead links.
    const match = path.match(
      /\/content\/(services|government)\/([^/]+)\/([^/]+)\.md$/
    );
    if (!match) continue;
    const [, tree, categorySlug, slug] = match as [
      string,
      Tree,
      string,
      string,
    ];

    const jsonPath = path.replace(/\.md$/, '.json');
    const content = interpolate(raw, rawCompanionJson[jsonPath] ?? {});
    // An empty markdown file renders as a blank page. Sending someone there
    // from search would be a broken promise, so it is left out.
    if (content.trim().length === 0) continue;

    const meta = categoryMeta.get(`${tree}/${categorySlug}`);
    const yamlPage = categoryPages
      .get(`${tree}/${categorySlug}`)
      ?.find(page => page.slug === slug);

    const headings = collectHeadings(content);
    const fullText = markdownToText(content);
    const title = headings[0] ?? yamlPage?.name ?? titleFromSlug(slug);
    // The page title opens the body text. Leaving it there makes every
    // snippet start by repeating the heading printed right above it.
    const body = fullText.startsWith(title)
      ? fullText.slice(title.length).trim()
      : fullText;

    const firstParagraph = content.match(/^#\s+.+$\n\n(.+?)(?:\n\n|$)/s);
    const description =
      yamlPage?.description ??
      (firstParagraph
        ? stripInline(firstParagraph[1].replace(/^>\s*/, ''))
        : body.slice(0, 180));

    drafts.push({
      doc: {
        id: `${tree}/${categorySlug}/${slug}`,
        kind: 'page',
        title,
        url: `/${tree}/${categorySlug}/${slug}`,
        tree,
        categoryName: meta?.name ?? titleFromSlug(categorySlug),
        categorySlug,
        description,
        body,
      },
      fields: [
        { text: title, field: FIELD.TITLE },
        // The catalogue name is often worded differently from the heading, so
        // it is a second, equally intentional way of asking for the page.
        {
          text: `${yamlPage?.name ?? ''} ${slug.replace(/-/g, ' ')}`,
          field: FIELD.ALIAS,
        },
        { text: headings.slice(1).join(' \n '), field: FIELD.HEADING },
        { text: description, field: FIELD.DESCRIPTION },
        { text: meta?.name ?? '', field: FIELD.CATEGORY },
        { text: body, field: FIELD.BODY },
      ],
    });
  }

  // ---- category listings -------------------------------------------------
  for (const [key, meta] of categoryMeta) {
    const [tree, categorySlug] = key.split('/') as [Tree, string];
    const pages = categoryPages.get(key) ?? [];
    const hasIndexedPage = drafts.some(
      draft =>
        draft.doc.tree === tree && draft.doc.categorySlug === categorySlug
    );
    // Skip listings that would open on an empty page.
    if (pages.length === 0 && !hasIndexedPage) continue;

    const pageNames = pages.map(page => page.name ?? '').join(' \n ');
    const pageDescriptions = pages
      .map(page => page.description ?? '')
      .join(' \n ');

    drafts.push({
      doc: {
        id: key,
        kind: 'section',
        title: meta.name,
        url: `/${tree}/${categorySlug}`,
        tree,
        categoryName: meta.name,
        categorySlug,
        description: meta.description,
        body: [pageNames, pageDescriptions].filter(Boolean).join(' '),
      },
      fields: [
        { text: meta.name, field: FIELD.TITLE },
        { text: categorySlug.replace(/-/g, ' '), field: FIELD.ALIAS },
        // Page titles listed under the category, so a search for a topic with
        // no page yet still finds the place it will live.
        { text: pageNames, field: FIELD.HEADING },
        { text: meta.description, field: FIELD.DESCRIPTION },
        { text: pageDescriptions, field: FIELD.BODY },
      ],
    });
  }

  return drafts;
}

let cached: SearchIndex | null = null;

export function getSearchIndex(): SearchIndex {
  if (cached) return cached;

  const drafts = buildDrafts();
  drafts.sort((a, b) => {
    if (a.doc.kind !== b.doc.kind) return a.doc.kind === 'page' ? -1 : 1;
    return a.doc.title.localeCompare(b.doc.title);
  });

  const docs = drafts.map(draft => draft.doc);
  const postings = new Map<string, Posting[]>();

  drafts.forEach((draft, docIndex) => {
    const seen = new Map<string, Posting>();
    for (const { text, field } of draft.fields) {
      if (!text) continue;
      for (const term of tokenize(text)) {
        let posting = seen.get(term);
        if (!posting) {
          posting = { doc: docIndex, fields: 0, count: 0 };
          seen.set(term, posting);
        }
        posting.fields |= field;
        if (field === FIELD.BODY) posting.count += 1;
      }
    }
    for (const [term, posting] of seen) {
      const list = postings.get(term);
      if (list) list.push(posting);
      else postings.set(term, [posting]);
    }
  });

  cached = {
    docs,
    postings,
    vocab: [...postings.keys()].sort(),
    pageCount: docs.filter(doc => doc.kind === 'page').length,
    sectionCount: docs.filter(doc => doc.kind === 'section').length,
  };
  return cached;
}
