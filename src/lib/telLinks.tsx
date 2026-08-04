/**
 * Turn Philippine phone numbers in plain text into tappable tel: links.
 *
 * Hotline and office numbers in the content are written as text inside
 * markdown tables, lists and paragraphs. On a phone — where most residents
 * read this site — a number that cannot be tapped is a transcription exercise
 * in the middle of an emergency. This module linkifies exactly the shapes
 * that appear in the content and nothing else, because a false positive (a
 * year range, a population figure) dialing nonsense is worse than a missed
 * match.
 *
 * Recognized shapes:
 *  - Metro Manila landlines written 8XXX-XXXX → tel:+6328XXXXXXX. Every
 *    Metro Manila landline has started with 8 since the 2019 eight-digit
 *    migration; requiring the leading 8 keeps year ranges like 2025-2028
 *    unlinked.
 *  - Mobiles written 09XX-XXX-XXXX or 09XX-XXXXXXX → tel:+639XXXXXXXXX.
 *  - International-format mobiles +63 9XX XXX XXXX → tel:+639XXXXXXXXX.
 *  - The national emergency number 911 as a standalone word, guarded so a
 *    digit-grouped figure like 1,911,000 never matches.
 */

import { Children, isValidElement, type ReactNode } from 'react';

const TEL_PATTERN =
  /\+63[\s.]?9\d{2}[\s.]?\d{3}[\s.]?\d{4}|\b09\d{2}-(?:\d{3}-\d{4}|\d{7})\b|\b8\d{3}-\d{4}\b|(?<![\d,.])911(?![\d,.])/g;

/** tel: href for a matched number, normalized to E.164 where possible. */
export function telHref(raw: string): string {
  if (raw === '911') return 'tel:911';
  const digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+63')) return `tel:+${digits}`;
  if (digits.startsWith('09')) return `tel:+63${digits.slice(1)}`;
  // Eight-digit Metro Manila landline; the area code is 2.
  return `tel:+632${digits}`;
}

/** Split one string into text fragments and tel: anchors. */
export function linkifyTel(text: string, className?: string): ReactNode {
  TEL_PATTERN.lastIndex = 0;
  if (!TEL_PATTERN.test(text)) return text;

  TEL_PATTERN.lastIndex = 0;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(TEL_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <a key={`tel-${start}`} href={telHref(match[0])} className={className}>
        {match[0]}
      </a>
    );
    cursor = start + match[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

/**
 * Map a renderer's children, linkifying plain string nodes only. Existing
 * elements (links, code, emphasis) pass through untouched, so a number that
 * is already inside an anchor is never double-linked.
 */
export function linkifyTelChildren(
  children: ReactNode,
  className?: string
): ReactNode {
  return Children.map(children, child => {
    if (typeof child === 'string') return linkifyTel(child, className);
    if (isValidElement(child)) return child;
    return child;
  });
}
