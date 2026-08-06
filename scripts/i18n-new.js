#!/usr/bin/env node

/**
 * Scaffold a locale file for a translator to work through.
 *
 *   npm run i18n:new -- ceb
 *
 * The stub is a copy of the English file, English values and all, rather than
 * a file of empty strings. A translator needs to see the sentence they are
 * replacing — including its {{variables}} and <components>, which have to
 * survive into the translation or the page breaks — and overwriting in place
 * is the least error-prone way to do that. `npm run i18n:check` reports how
 * many values are still identical to English, so progress stays visible.
 *
 * The new language is deliberately NOT switched on. It stays `available:
 * false` until a speaker has read it, because offering a language and then
 * rendering English is worse than not offering it at all.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const LANGUAGES_TS = path.join(__dirname, '../src/i18n/languages.ts');
const REFERENCE = 'en';
const NAMESPACE = 'common.json';

const code = process.argv[2];

/** The declared languages, as { code: { name, available } }. */
function readDeclaredLanguages() {
  const source = fs.readFileSync(LANGUAGES_TS, 'utf8');
  const declared = {};
  const entry =
    /code:\s*'([a-z]+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?available:\s*(true|false)/g;
  let match;
  while ((match = entry.exec(source)) !== null) {
    declared[match[1]] = { name: match[2], available: match[3] === 'true' };
  }
  return declared;
}

const declared = readDeclaredLanguages();

if (!code) {
  const pending = Object.entries(declared)
    .filter(([, info]) => !info.available)
    .map(([id, info]) => `  ${id.padEnd(5)} ${info.name}`)
    .join('\n');
  console.error(
    'Usage: npm run i18n:new -- <code>\n\n' +
      'Languages declared in src/i18n/languages.ts that still need a translator:\n' +
      pending
  );
  process.exit(1);
}

if (!(code in declared)) {
  console.error(
    `❌ "${code}" is not declared in src/i18n/languages.ts.\n` +
      '   Add it to LanguageType in src/types/index.ts and to LANGUAGES first, ' +
      'so the switcher knows its name.'
  );
  process.exit(1);
}

const targetDir = path.join(LOCALES_DIR, code);
const targetPath = path.join(targetDir, NAMESPACE);

if (fs.existsSync(targetPath)) {
  console.error(
    `❌ ${path.relative(process.cwd(), targetPath)} already exists. ` +
      'Edit it, or delete it first if you meant to start over.'
  );
  process.exit(1);
}

const reference = fs.readFileSync(
  path.join(LOCALES_DIR, REFERENCE, NAMESPACE),
  'utf8'
);

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetPath, reference);

const { name } = declared[code];

/** Leaf values only — nested group names are not strings to translate. */
function countLeaves(value) {
  return Object.values(value).reduce(
    (total, child) =>
      total +
      (child && typeof child === 'object' && !Array.isArray(child)
        ? countLeaves(child)
        : 1),
    0
  );
}
const keyCount = countLeaves(JSON.parse(reference));

console.log(
  `✅ Created public/locales/${code}/${NAMESPACE} for ${name}\n\n` +
    `It is a copy of the English file. Translate the values in place, leaving\n` +
    `every {{variable}} and <component> tag exactly as it appears.\n\n` +
    `Check progress at any time:\n` +
    `  npm run i18n:check\n\n` +
    `When a ${name} speaker has reviewed the whole file, switch it on:\n` +
    `  1. src/i18n/languages.ts  → set ${code}.available = true\n` +
    `  2. src/i18n.ts            → add '${code}' to supportedLngs\n\n` +
    `Until then the switcher keeps listing ${name} under "Needs a translator",\n` +
    `which is the honest state. (${keyCount} strings to work through.)`
);
