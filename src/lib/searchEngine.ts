/**
 * Scoring and snippets for Better Manila search.
 *
 * Hand rolled rather than a library. The corpus is about twenty pages, so the
 * whole index is a few hundred kilobytes and a linear pass is instant. What a
 * general purpose library would not give for free is the part that matters
 * here: Filipino aliases folded into the same ranking pass, field weights
 * tuned to this content, and snippets that highlight the term that actually
 * matched rather than the term that was typed.
 *
 * Ranking, in short:
 *
 *   score(doc) = sum over query terms of the best field hit for that term,
 *                scaled by how many of the query terms the document matched,
 *                plus a bonus when the whole phrase appears in the title.
 *
 * A hit in the title counts six times a hit in the body, so a page called
 * "Apply for a scholarship" always beats a page that merely mentions
 * scholarships. Coverage is squared, so a document matching every word of a
 * two word query beats a document matching one word twice over.
 */

import { expandPhrases, expandTerm } from './searchAliases';
import {
  FIELD,
  getSearchIndex,
  normalizeText,
  tokenizeQuery,
  type SearchDoc,
  type SearchIndex,
  type Tree,
} from './searchIndex';

const FIELD_WEIGHT: [number, number][] = [
  [FIELD.TITLE, 12],
  [FIELD.ALIAS, 9],
  [FIELD.HEADING, 6],
  [FIELD.DESCRIPTION, 5],
  [FIELD.CATEGORY, 4],
];

/** How much a match is trusted, by how it was found. */
const QUALITY = {
  EXACT: 1,
  PREFIX: 0.8,
  TRUNCATION: 0.7,
  FUZZY: 0.45,
  ALIAS: 0.8,
  PHRASE_ALIAS: 0.7,
};

export interface Highlight {
  text: string;
  hit: boolean;
}

export interface SearchResult {
  id: string;
  kind: SearchDoc['kind'];
  url: string;
  tree: Tree;
  categoryName: string;
  score: number;
  titleParts: Highlight[];
  snippetParts: Highlight[];
  /** plain title, for aria labels and keys */
  title: string;
}

export interface SearchOutcome {
  query: string;
  results: SearchResult[];
  counts: { all: number; services: number; government: number };
  /** a spelling correction that would return results, if the query returned none */
  suggestion: string | null;
}

export interface IndexStats {
  pageCount: number;
  sectionCount: number;
}

export function getIndexStats(): IndexStats {
  const index = getSearchIndex();
  return { pageCount: index.pageCount, sectionCount: index.sectionCount };
}

/** First position in a sorted array at or after `value`. */
function lowerBound(sorted: string[], value: string): number {
  let low = 0;
  let high = sorted.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (sorted[mid] < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

function prefixMatches(vocab: string[], prefix: string): string[] {
  const out: string[] = [];
  for (let i = lowerBound(vocab, prefix); i < vocab.length; i++) {
    if (!vocab[i].startsWith(prefix)) break;
    out.push(vocab[i]);
  }
  return out;
}

/** Levenshtein distance, abandoned as soon as it is known to exceed `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const previous = new Array<number>(b.length + 1);
  const current = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) previous[j] = j;
  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    let rowBest = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );
      if (current[j] < rowBest) rowBest = current[j];
    }
    if (rowBest > max) return max + 1;
    for (let j = 0; j <= b.length; j++) previous[j] = current[j];
  }
  return previous[b.length];
}

interface Candidate {
  term: string;
  quality: number;
}

/**
 * Candidate singular or base forms of a word. English only, and deliberately
 * shallow: the pages are written in plain English and an aggressive stemmer
 * would conflate more than it recovers.
 */
function inflectionStems(term: string): string[] {
  const out: string[] = [];
  const add = (stem: string) => {
    if (stem.length >= 3 && stem !== term) out.push(stem);
  };
  if (term.endsWith('ies')) add(`${term.slice(0, -3)}y`);
  if (term.endsWith('es')) add(term.slice(0, -2));
  if (term.endsWith('s') && !term.endsWith('ss')) add(term.slice(0, -1));
  if (term.endsWith('ing')) add(term.slice(0, -3));
  if (term.endsWith('ed')) add(term.slice(0, -2));
  return out;
}

/**
 * Every indexed term a query term should be allowed to match, each with a
 * confidence. Exact first, then completions of a partially typed word, then
 * the reverse case where the user typed a longer form than the page uses,
 * then near misses for typos.
 */
function candidatesFor(
  term: string,
  index: SearchIndex,
  allowFuzzy: boolean
): Candidate[] {
  const best = new Map<string, number>();
  const offer = (candidate: string, quality: number) => {
    const existing = best.get(candidate);
    if (existing === undefined || quality > existing) {
      best.set(candidate, quality);
    }
  };

  if (index.postings.has(term)) offer(term, QUALITY.EXACT);

  // "immuni" should reach "immunization", with longer completions trusted
  // slightly less than near exact ones.
  if (term.length >= 3) {
    for (const completion of prefixMatches(index.vocab, term)) {
      if (completion === term) continue;
      const closeness = term.length / completion.length;
      offer(completion, QUALITY.PREFIX * (0.6 + 0.4 * closeness));
    }
  }

  // "vaccines" should reach a page that only says "vaccine", "taxes" a page
  // that says "tax". Only inflectional endings are stripped: a blind
  // truncation would let "property" match "proper".
  for (const stem of inflectionStems(term)) {
    if (index.postings.has(stem)) offer(stem, QUALITY.TRUNCATION);
  }

  if (allowFuzzy && best.size === 0 && term.length >= 5) {
    const max = term.length >= 8 ? 2 : 1;
    let bestDistance = max + 1;
    for (const candidate of index.vocab) {
      if (candidate.length < 4) continue;
      const distance = editDistance(term, candidate, max);
      if (distance <= max && distance <= bestDistance) {
        bestDistance = distance;
        offer(candidate, QUALITY.FUZZY / distance);
      }
    }
  }

  return [...best].map(([candidateTerm, quality]) => ({
    term: candidateTerm,
    quality,
  }));
}

function fieldScore(fields: number, count: number): number {
  let weight = 0;
  for (const [flag, value] of FIELD_WEIGHT) {
    if (fields & flag && value > weight) weight = value;
  }
  if (fields & FIELD.BODY) {
    // Repetition in the body is weak evidence, so it is capped hard.
    const bodyWeight = 2 + Math.min(count - 1, 4) * 0.4;
    if (bodyWeight > weight) weight = bodyWeight;
  }
  return weight;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildHitPattern(terms: string[]): RegExp | null {
  const usable = terms.filter(term => term.length > 1).map(escapeRegExp);
  if (usable.length === 0) return null;
  usable.sort((a, b) => b.length - a.length);
  return new RegExp(`\\b(?:${usable.join('|')})\\b`, 'giu');
}

function splitHighlights(text: string, pattern: RegExp | null): Highlight[] {
  if (!pattern || !text) return text ? [{ text, hit: false }] : [];
  const parts: Highlight[] = [];
  let cursor = 0;
  pattern.lastIndex = 0;
  let match = pattern.exec(text);
  while (match) {
    if (match.index > cursor) {
      parts.push({ text: text.slice(cursor, match.index), hit: false });
    }
    parts.push({ text: match[0], hit: true });
    cursor = match.index + match[0].length;
    if (match[0].length === 0) pattern.lastIndex += 1;
    match = pattern.exec(text);
  }
  if (cursor < text.length)
    parts.push({ text: text.slice(cursor), hit: false });
  return parts;
}

const SNIPPET_LENGTH = 210;

/**
 * Pick the passage that explains the match: the window of body text covering
 * the most distinct query terms. Falls back to the page description when the
 * match was in the title alone.
 */
function buildSnippet(doc: SearchDoc, pattern: RegExp | null): Highlight[] {
  const body = doc.body;
  if (!pattern || !body) {
    return splitHighlights(
      doc.description || body.slice(0, SNIPPET_LENGTH),
      pattern
    );
  }

  const hits: { index: number; text: string }[] = [];
  pattern.lastIndex = 0;
  let match = pattern.exec(body);
  while (match && hits.length < 400) {
    hits.push({ index: match.index, text: match[0].toLowerCase() });
    if (match[0].length === 0) pattern.lastIndex += 1;
    match = pattern.exec(body);
  }

  if (hits.length === 0) {
    const fallback = doc.description || body.slice(0, SNIPPET_LENGTH);
    return splitHighlights(fallback, pattern);
  }

  let bestStart = 0;
  let bestDistinct = -1;
  for (const hit of hits) {
    const start = Math.max(0, hit.index - 70);
    const end = start + SNIPPET_LENGTH;
    const distinct = new Set(
      hits
        .filter(other => other.index >= start && other.index < end)
        .map(other => other.text)
    ).size;
    if (distinct > bestDistinct) {
      bestDistinct = distinct;
      bestStart = start;
    }
  }

  let start = bestStart;
  let end = Math.min(body.length, start + SNIPPET_LENGTH);
  // Do not cut words in half.
  if (start > 0) {
    const space = body.indexOf(' ', start);
    if (space !== -1 && space - start < 25) start = space + 1;
  }
  if (end < body.length) {
    const space = body.lastIndexOf(' ', end);
    if (space > start + 40) end = space;
  }

  const parts = splitHighlights(body.slice(start, end), pattern);
  if (start > 0 && parts.length > 0) {
    parts.unshift({ text: '... ', hit: false });
  }
  if (end < body.length) {
    parts.push({ text: ' ...', hit: false });
  }
  return parts;
}

interface Accumulator {
  score: number;
  matchedTerms: number;
  hitTerms: Set<string>;
}

function scoreDocuments(
  queryTerms: string[],
  index: SearchIndex,
  allowFuzzy: boolean
): Map<number, Accumulator> {
  const perDoc = new Map<number, Accumulator>();
  const phraseAliases = expandPhrases(queryTerms);

  queryTerms.forEach(term => {
    const candidates: { candidate: Candidate; factor: number }[] = [];
    for (const candidate of candidatesFor(term, index, allowFuzzy)) {
      candidates.push({ candidate, factor: 1 });
    }
    for (const alias of expandTerm(term)) {
      for (const candidate of candidatesFor(alias, index, false)) {
        candidates.push({ candidate, factor: QUALITY.ALIAS });
      }
    }
    for (const alias of phraseAliases) {
      for (const candidate of candidatesFor(alias, index, false)) {
        candidates.push({ candidate, factor: QUALITY.PHRASE_ALIAS });
      }
    }

    const bestForTerm = new Map<number, number>();
    for (const { candidate, factor } of candidates) {
      const postings = index.postings.get(candidate.term);
      if (!postings) continue;
      for (const posting of postings) {
        const value =
          fieldScore(posting.fields, posting.count) *
          candidate.quality *
          factor;
        if (value <= 0) continue;
        if (value > (bestForTerm.get(posting.doc) ?? 0)) {
          bestForTerm.set(posting.doc, value);
        }
        let accumulator = perDoc.get(posting.doc);
        if (!accumulator) {
          accumulator = { score: 0, matchedTerms: 0, hitTerms: new Set() };
          perDoc.set(posting.doc, accumulator);
        }
        accumulator.hitTerms.add(candidate.term);
      }
    }

    for (const [docIndex, value] of bestForTerm) {
      const accumulator = perDoc.get(docIndex);
      if (!accumulator) continue;
      accumulator.score += value;
      accumulator.matchedTerms += 1;
    }
  });

  return perDoc;
}

function rank(
  query: string,
  queryTerms: string[],
  index: SearchIndex
): SearchResult[] {
  const perDoc = scoreDocuments(queryTerms, index, true);
  const normalizedQuery = normalizeText(query).trim();
  const isPhrase = queryTerms.length > 1;

  const scored: { doc: SearchDoc; score: number; hitTerms: Set<string> }[] = [];
  for (const [docIndex, accumulator] of perDoc) {
    if (accumulator.matchedTerms === 0) continue;
    const doc = index.docs[docIndex];
    const coverage = accumulator.matchedTerms / queryTerms.length;
    let score = accumulator.score * Math.pow(0.4 + 0.6 * coverage, 2);

    if (isPhrase) {
      // The exact phrase, in order, is the strongest signal there is.
      if (normalizeText(doc.title).includes(normalizedQuery)) score += 22;
      else if (normalizeText(doc.description).includes(normalizedQuery))
        score += 9;
      else if (normalizeText(doc.body).includes(normalizedQuery)) score += 5;
    }
    if (normalizeText(doc.title).startsWith(normalizedQuery)) score += 6;
    // A page beats the listing it sits in when both match equally well.
    if (doc.kind === 'section') score *= 0.8;

    scored.push({ doc, score, hitTerms: accumulator.hitTerms });
  }

  if (scored.length === 0) return [];
  scored.sort(
    (a, b) => b.score - a.score || a.doc.title.length - b.doc.title.length
  );

  // Twenty pages is a small enough corpus that a long tail of "this word also
  // appears here once" is noise rather than recall. When something matched
  // strongly, weak matches are dropped; when nothing did, the floor keeps the
  // best of a thin set visible.
  const cutoff = Math.max(1.2, scored[0].score * 0.09);
  return scored
    .filter(entry => entry.score >= cutoff)
    .slice(0, 25)
    .map(entry => {
      const pattern = buildHitPattern([...entry.hitTerms]);
      return {
        id: entry.doc.id,
        kind: entry.doc.kind,
        url: entry.doc.url,
        tree: entry.doc.tree,
        categoryName: entry.doc.categoryName,
        score: entry.score,
        title: entry.doc.title,
        titleParts: splitHighlights(entry.doc.title, pattern),
        snippetParts: buildSnippet(entry.doc, pattern),
      };
    });
}

/**
 * Closest indexed term to each unmatched query word, used for "did you mean".
 * Only offered when it would actually return something.
 */
function suggestCorrection(
  queryTerms: string[],
  index: SearchIndex
): string | null {
  let changed = false;
  const corrected = queryTerms.map(term => {
    if (index.postings.has(term) || term.length < 4) return term;
    const max = term.length >= 7 ? 2 : 1;
    let bestTerm = term;
    let bestDistance = max + 1;
    let bestFrequency = 0;
    for (const candidate of index.vocab) {
      if (candidate.length < 4) continue;
      const distance = editDistance(term, candidate, max);
      if (distance > max) continue;
      const frequency = index.postings.get(candidate)?.length ?? 0;
      if (
        distance < bestDistance ||
        (distance === bestDistance && frequency > bestFrequency)
      ) {
        bestDistance = distance;
        bestFrequency = frequency;
        bestTerm = candidate;
      }
    }
    if (bestTerm !== term) changed = true;
    return bestTerm;
  });

  if (!changed) return null;
  const suggestion = corrected.join(' ');
  return rank(suggestion, corrected, index).length > 0 ? suggestion : null;
}

export const MIN_QUERY_LENGTH = 2;

export function runSearch(query: string): SearchOutcome {
  const trimmed = query.trim();
  const empty: SearchOutcome = {
    query: trimmed,
    results: [],
    counts: { all: 0, services: 0, government: 0 },
    suggestion: null,
  };
  if (trimmed.length < MIN_QUERY_LENGTH) return empty;

  const index = getSearchIndex();
  const queryTerms = tokenizeQuery(trimmed);
  if (queryTerms.length === 0) return empty;

  const results = rank(trimmed, queryTerms, index);
  return {
    query: trimmed,
    results,
    counts: {
      all: results.length,
      services: results.filter(result => result.tree === 'services').length,
      government: results.filter(result => result.tree === 'government').length,
    },
    suggestion:
      results.length === 0 ? suggestCorrection(queryTerms, index) : null,
  };
}
