#!/usr/bin/env node

/**
 * Sitemap generator, run after `vite build`.
 *
 * The site is a client-routed SPA behind a catch-all rewrite, so a crawler
 * has no way to discover any URL except by following links from the home
 * page — and every unknown path returns 200 with the same shell, so guessing
 * is worse than useless. The sitemap is the only honest statement of what
 * actually exists.
 *
 * URLs come from the content tree rather than a hand-kept list, so a page
 * added under content/ is in the sitemap without anyone remembering to do
 * anything. Categories with no pages are left out: they render an empty
 * state, and there is nothing there to index.
 *
 * `lastmod` comes from git, which is the only date that survives a fresh
 * clone — file mtimes are the checkout time, not the edit time. If git is
 * unavailable the entry simply omits lastmod, which is valid.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), '..');

const BASE_URL = (
  process.env.VITE_WEBSITE_URL || 'https://bettermanila.org'
).replace(/\/+$/, '');

const OUT = path.join(projectRoot, 'dist', 'sitemap.xml');

/** Sections of the content tree, and the URL prefix each one lives under. */
const SECTIONS = [
  { dir: 'services', prefix: '/services' },
  { dir: 'government', prefix: '/government' },
];

/**
 * Routes that exist in App.tsx but are not content. /search is deliberately
 * absent: it is a search box, not a page, and its results are just these
 * same URLs seen through a query string.
 */
const STATIC_ROUTES = ['/', '/about', '/services', '/government'];

/** Last commit date for a path, as an ISO date, or null if git cannot say. */
function lastCommitDate(relPath) {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', relPath],
      {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}

/**
 * Every category directory holding at least one page, with the pages it
 * lists. Only the top level is walked: a nested directory such as
 * departments/legislative is registered in the loader but has no route of
 * its own, so it cannot be linked to.
 */
function collect() {
  const urls = [];

  for (const { dir, prefix } of SECTIONS) {
    const sectionDir = path.join(projectRoot, 'content', dir);
    if (!fs.existsSync(sectionDir)) continue;

    for (const category of fs.readdirSync(sectionDir).sort()) {
      const indexPath = path.join(sectionDir, category, 'index.yaml');
      if (!fs.existsSync(indexPath)) continue;

      let pages;
      try {
        const parsed = yaml.load(fs.readFileSync(indexPath, 'utf8'));
        pages = Array.isArray(parsed?.pages) ? parsed.pages : [];
      } catch (error) {
        console.error(
          `  ! ${path.relative(projectRoot, indexPath)} did not parse: ${error.message}`
        );
        process.exitCode = 1;
        continue;
      }

      const withSlugs = pages.filter(page => page && page.slug);
      if (withSlugs.length === 0) continue;

      urls.push({
        loc: `${prefix}/${category}`,
        lastmod: lastCommitDate(path.join('content', dir, category)),
      });

      for (const page of withSlugs) {
        const markdown = path.join('content', dir, category, `${page.slug}.md`);
        if (!fs.existsSync(path.join(projectRoot, markdown))) {
          console.error(
            `  ! ${prefix}/${category}/${page.slug} is listed in index.yaml but has no ${page.slug}.md`
          );
          process.exitCode = 1;
          continue;
        }
        urls.push({
          loc: `${prefix}/${category}/${page.slug}`,
          lastmod: lastCommitDate(markdown),
        });
      }
    }
  }

  return urls;
}

const entries = [
  ...STATIC_ROUTES.map(loc => ({ loc, lastmod: null })),
  ...collect(),
];

const body = entries
  .map(({ loc, lastmod }) => {
    const lines = [`    <loc>${BASE_URL}${loc === '/' ? '/' : loc}</loc>`];
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    return `  <url>\n${lines.join('\n')}\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

if (!fs.existsSync(path.dirname(OUT))) {
  console.error('dist/ does not exist — run this after vite build.');
  process.exit(1);
}

fs.writeFileSync(OUT, xml);
console.log(`✅ sitemap.xml — ${entries.length} URLs`);
