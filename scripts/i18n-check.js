#!/usr/bin/env node

/**
 * Locale consistency check.
 *
 * English is the reference. Every other locale file is compared against it,
 * because i18next falls back to English silently: a key that is missing, or
 * a `{{count}}` that got dropped in translation, does not throw — it just
 * renders English, or renders the literal placeholder, on a page about
 * hotlines and permit fees. Nobody notices until a reader does.
 *
 * What is an error (exit 1):
 *   - a key in en that the locale is missing, or a key it has that en does not
 *   - a different set of {{variables}} or <components> for the same key
 *   - a value that is a string in one file and an array in the other
 *   - a plural key (`_one`) without its partner (`_other`)
 *   - a language marked `available: true` with no locale file, or missing from
 *     `supportedLngs` in src/i18n.ts — the switcher would offer a language and
 *     then show English
 *
 * What is only reported:
 *   - values identical to English. Some are meant to be (a brand name, a
 *     domain, "Error 404"), so this is a count to eyeball, not a failure.
 *
 * Takes no arguments. Parity is a property of the whole tree, so any file
 * paths passed in (by lint-staged, say) are ignored and everything is checked.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const LANGUAGES_TS = path.join(__dirname, '../src/i18n/languages.ts');
const I18N_TS = path.join(__dirname, '../src/i18n.ts');
const REFERENCE = 'en';
const NAMESPACE = 'common.json';

const errors = [];
const notes = [];

/** Flatten to dotted paths. Arrays are leaves — order and length are content. */
function flatten(value, prefix = '', out = {}) {
  for (const [key, child] of Object.entries(value)) {
    const dotted = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      flatten(child, dotted, out);
    } else {
      out[dotted] = child;
    }
  }
  return out;
}

const varsIn = text => new Set(text.match(/\{\{(\w+)\}\}/g) ?? []);
const tagsIn = text => new Set(text.match(/<(\w+)>/g) ?? []);
const setsEqual = (a, b) =>
  a.size === b.size && [...a].every(item => b.has(item));
const show = set => (set.size ? [...set].sort().join(' ') : '(none)');

/** `LANGUAGES` in src/i18n/languages.ts, as { code: { available, reviewed } }. */
function readDeclaredLanguages() {
  const source = fs.readFileSync(LANGUAGES_TS, 'utf8');
  const declared = {};
  const entry =
    /code:\s*'([a-z]+)'[\s\S]*?available:\s*(true|false),\s*reviewed:\s*(true|false)/g;
  let match;
  while ((match = entry.exec(source)) !== null) {
    declared[match[1]] = {
      available: match[2] === 'true',
      reviewed: match[3] === 'true',
    };
  }
  return declared;
}

/**
 * supportedLngs is derived from LANGUAGES now, so there is no second list to
 * drift out of step. This only confirms the wiring is still derived: if
 * someone replaces it with a literal array, the two can diverge again and the
 * check should say so.
 */
function supportedLngsIsDerived() {
  const source = fs.readFileSync(I18N_TS, 'utf8');
  return /supportedLngs:\s*SUPPORTED_LANGUAGE_CODES/.test(source);
}

// ---------------------------------------------------------------------------

const referencePath = path.join(LOCALES_DIR, REFERENCE, NAMESPACE);
if (!fs.existsSync(referencePath)) {
  console.error(`❌ Reference locale missing: ${referencePath}`);
  process.exit(1);
}

const reference = flatten(JSON.parse(fs.readFileSync(referencePath, 'utf8')));
const referenceKeys = Object.keys(reference);

// Plural partners must exist in the reference itself.
for (const key of referenceKeys) {
  if (key.endsWith('_one') && !reference[`${key.slice(0, -4)}_other`]) {
    errors.push(`${REFERENCE}: ${key} has no matching _other`);
  }
  if (key.endsWith('_other') && !reference[`${key.slice(0, -6)}_one`]) {
    errors.push(`${REFERENCE}: ${key} has no matching _one`);
  }
}

const localeDirs = fs
  .readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

const declared = readDeclaredLanguages();

console.log(
  `Reference: ${REFERENCE} (${referenceKeys.length} keys)\n` +
    `Locales:   ${localeDirs.join(', ')}\n`
);

for (const locale of localeDirs) {
  if (locale === REFERENCE) continue;

  const localePath = path.join(LOCALES_DIR, locale, NAMESPACE);
  if (!fs.existsSync(localePath)) {
    errors.push(`${locale}: no ${NAMESPACE}`);
    continue;
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  } catch (error) {
    errors.push(`${locale}: invalid JSON — ${error.message}`);
    continue;
  }

  const translated = flatten(parsed);
  const missing = referenceKeys.filter(key => !(key in translated));
  const extra = Object.keys(translated).filter(key => !(key in reference));

  for (const key of missing) errors.push(`${locale}: missing key ${key}`);
  for (const key of extra) errors.push(`${locale}: unknown key ${key}`);

  let identical = 0;
  const identicalKeys = [];

  for (const key of referenceKeys) {
    if (!(key in translated)) continue;
    const source = reference[key];
    const target = translated[key];

    if (Array.isArray(source) !== Array.isArray(target)) {
      errors.push(
        `${locale}: ${key} is ${Array.isArray(target) ? 'an array' : 'a string'}, ` +
          `but ${Array.isArray(source) ? 'an array' : 'a string'} in ${REFERENCE}`
      );
      continue;
    }
    if (Array.isArray(source)) continue;

    if (!setsEqual(varsIn(source), varsIn(target))) {
      errors.push(
        `${locale}: ${key} interpolation differs — ` +
          `${REFERENCE} has ${show(varsIn(source))}, ${locale} has ${show(varsIn(target))}`
      );
    }
    if (!setsEqual(tagsIn(source), tagsIn(target))) {
      errors.push(
        `${locale}: ${key} components differ — ` +
          `${REFERENCE} has ${show(tagsIn(source))}, ${locale} has ${show(tagsIn(target))}`
      );
    }
    if (source === target) {
      identical += 1;
      identicalKeys.push(key);
    }
  }

  if (identical > 0) {
    const sample = identicalKeys.slice(0, 6).join(', ');
    notes.push(
      `${locale}: ${identical}/${referenceKeys.length} values identical to ${REFERENCE} ` +
        `(${sample}${identicalKeys.length > 6 ? ', …' : ''})`
    );
  }

  const missingCount = missing.length;
  const status = missingCount === 0 ? '✅' : '❌';
  const state = declared[locale]?.reviewed ? 'reviewed' : 'draft';
  console.log(
    `${status} ${locale}: ${referenceKeys.length - missingCount}/${referenceKeys.length} keys` +
      (identical ? `, ${identical} same as ${REFERENCE}` : '') +
      `  [${state}]`
  );
}

// --- the switcher must not offer a language the app cannot actually load ---

if (!supportedLngsIsDerived()) {
  errors.push(
    'src/i18n.ts: supportedLngs is no longer derived from SUPPORTED_LANGUAGE_CODES. ' +
      'A hand-written list can drift from languages.ts, which offers a reader a ' +
      'language i18next then refuses to load.'
  );
}

for (const [code, info] of Object.entries(declared)) {
  const hasFile = fs.existsSync(path.join(LOCALES_DIR, code, NAMESPACE));

  if (info.available && !hasFile) {
    errors.push(
      `${code}: marked available in languages.ts but public/locales/${code}/${NAMESPACE} does not exist`
    );
  }
  if (info.reviewed && !info.available) {
    errors.push(
      `${code}: marked reviewed but not available — a language cannot be checked by a speaker and absent at the same time`
    );
  }
  if (!info.available && hasFile) {
    notes.push(
      `${code}: has a locale file but available: false, so nobody can select it — set available: true to ship it as a draft`
    );
  }
}

for (const locale of localeDirs) {
  if (!(locale in declared)) {
    errors.push(
      `${locale}: locale directory not declared in src/i18n/languages.ts`
    );
  }
}

const drafts = Object.entries(declared)
  .filter(([, info]) => info.available && !info.reviewed)
  .map(([code]) => code);
if (drafts.length) {
  notes.push(
    `shipping as drafts, pending a speaker's review: ${drafts.join(', ')}`
  );
}

// ---------------------------------------------------------------------------

if (notes.length) {
  console.log('\nNotes:');
  for (const note of notes) console.log(`   • ${note}`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} problem(s):`);
  for (const problem of errors) console.error(`   • ${problem}`);
  process.exit(1);
}

console.log('\n✅ All locales consistent with the English reference.');
