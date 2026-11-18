#!/usr/bin/env node

/**
 * Refresh the national budget figures on the budget-and-spending page.
 *
 *   node scripts/fetch-national-budget.js
 *
 * Reads the DPWH district engineering offices that serve Manila from the
 * BetterGov.ph Budget API (https://budget.bettergov.ph/docs) and writes them
 * as {TOKEN} values into the page's companion JSON, which markdownLoader
 * interpolates at render time.
 *
 * This is run by hand and the JSON is committed, not fetched at build time:
 * the page then states the exact date its figures were retrieved, the same as
 * every other figure on the site, and a build never depends on a third-party
 * API being up.
 *
 * Figures are per office, never per district. Both Manila offices are
 * "shared" (tier B) in the API: each serves several legislative districts
 * (South Manila also serves Pasay), and the API forbids splitting an office's
 * total between them. The API's own notice is copied into the JSON verbatim
 * so its wording cannot drift from the source.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API = 'https://budget.bettergov.ph/api/v1/hgab/2027';
const DISTRICTS = ['1st', '2nd', '3rd', '4th', '5th', '6th'].map(
  n => `leg:manila:${n}`
);
const OFFICES = {
  NORTH: 'office:north-manila-deo',
  SOUTH: 'office:south-manila-deo',
};

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const OUT = path.join(
  projectRoot,
  'content/government/transparency-documents/budget-and-spending-records.json'
);

async function getDistrict(id) {
  const res = await fetch(`${API}/districts/${encodeURIComponent(id)}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'BetterManila content script (fetch-national-budget.js)',
    },
  });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  return res.json();
}

/** ₱1.43 billion / ₱752.2 million, matching the rest of the page. */
function peso(php) {
  if (php == null) return '—';
  if (php >= 1e9) return `₱${(php / 1e9).toFixed(2)} billion`;
  return `₱${(php / 1e6).toFixed(1)} million`;
}

/** "Manila 1st, 2nd and 6th, and Pasay", from the API's district labels. */
function servedDistricts(office, labels) {
  const manila = [];
  const other = [];
  for (const id of office.district_ids) {
    const m = id.match(/^leg:manila:(\w+)$/);
    if (m) manila.push(m[1]);
    else other.push((labels.get(id) ?? id).replace(/,? Lone District$/, ''));
  }
  const list = xs =>
    xs.length < 2
      ? xs.join('')
      : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`;
  const parts = [];
  if (manila.length) parts.push(`Manila ${list(manila)}`);
  if (other.length) parts.push(list(other));
  return parts.join(', and ');
}

function yearFigure(office, fy, stage) {
  const row = office.years.find(y => y.fy === fy && y.stage === stage);
  return row ? row.php : null;
}

async function main() {
  const responses = await Promise.all(DISTRICTS.map(getDistrict));

  const offices = new Map();
  const labels = new Map();
  for (const { data } of responses) {
    labels.set(data.id, data.label);
    for (const o of data.offices) {
      offices.set(o.id, o);
      for (const c of o.co_served_districts ?? []) labels.set(c.id, c.label);
    }
  }

  const out = {};
  for (const [key, id] of Object.entries(OFFICES)) {
    const office = offices.get(id);
    if (!office) throw new Error(`${id} not returned for any Manila district`);
    if (office.tier !== 'B') {
      // The page's wording assumes a shared office. Stop rather than publish
      // copy that no longer matches the data.
      throw new Error(`${id} is now tier ${office.tier}; revise the page text`);
    }
    out[`${key}_DEO_DISTRICTS`] = servedDistricts(office, labels);
    out[`${key}_DEO_GAA_2026`] = peso(yearFigure(office, 2026, 'gaa'));
    out[`${key}_DEO_NEP_2027`] = peso(yearFigure(office, 2027, 'nep'));
    out[`${key}_DEO_HOUSE_2027`] = peso(yearFigure(office, 2027, 'hgab3'));
    out[`${key}_DEO_PROJECTS_URL`] = office.projects_url;
  }

  const { meta } = responses[0];
  out.BUDGET_API_NOTICE = meta.notice;
  out.BUDGET_API_SNAPSHOT = new Date(meta.built_at).toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Manila' }
  );
  out.BUDGET_RETRIEVED = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  });

  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${path.relative(projectRoot, OUT)}`);
  for (const [k, v] of Object.entries(out)) {
    if (k !== 'BUDGET_API_NOTICE') console.log(`  ${k}: ${v}`);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
