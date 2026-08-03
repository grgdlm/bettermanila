/**
 * Table renderer for markdown content, with a table/list view toggle.
 *
 * Desktop defaults to the table. Phones default to a stacked list of cards,
 * one card per row with the first column promoted to the card title, because
 * fee and hotline tables are unreadable when squeezed into 360px columns.
 *
 * Rows are recovered from the hast node that react-markdown passes to custom
 * components, so empty cells keep their position and every value stays under
 * the header it belongs to. The previous implementation flattened the text
 * nodes it found, which silently shifted values one column left whenever a
 * cell was empty, for example a fire station with no landline.
 */

import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { List, Table } from 'lucide-react';
import { type TypographyTheme } from './typographyThemes';
import { cn } from './utils';

/** Minimal structural view of a hast node, enough to walk a table. */
export interface HastLike {
  type?: string;
  tagName?: string;
  value?: string;
  children?: HastLike[];
}

const textOf = (node: HastLike): string => {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textOf).join('');
};

/** All cells of a row, in order, keeping empty cells as empty strings. */
const cellsOf = (row: HastLike): string[] =>
  (row.children ?? [])
    .filter(cell => cell.tagName === 'td' || cell.tagName === 'th')
    .map(cell => textOf(cell).trim());

interface ParsedTable {
  headers: string[];
  rows: string[][];
}

const parseTable = (table?: HastLike): ParsedTable | null => {
  if (!table) return null;
  const headers: string[] = [];
  const rows: string[][] = [];

  const visit = (node: HastLike, inHead: boolean): void => {
    for (const child of node.children ?? []) {
      if (child.tagName === 'tr') {
        const cells = cellsOf(child);
        if (cells.length === 0) continue;
        if (inHead && headers.length === 0) headers.push(...cells);
        else rows.push(cells);
      } else if (child.tagName === 'thead') {
        visit(child, true);
      } else if (child.tagName === 'tbody' || child.tagName === 'tfoot') {
        visit(child, false);
      }
    }
  };

  visit(table, false);
  return headers.length > 0 || rows.length > 0 ? { headers, rows } : null;
};

const fieldLabelClass =
  'text-xs font-medium tracking-wide text-gray-700 uppercase';
const fieldValueClass = 'mt-0.5 text-sm leading-relaxed text-gray-900';
const rowCardClass = 'rounded-xl border border-gray-200 bg-white p-4 shadow-xs';

const URL_VALUE = /^https?:\/\/\S+$/;

/**
 * List view extraction is text only, which would turn a cell holding a link
 * into dead text. When a value is a single URL, render it as a link again so
 * it stays tappable on a phone.
 */
const renderValue = (value: string, linkClass?: string) =>
  URL_VALUE.test(value) ? (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {value}
    </a>
  ) : (
    value
  );

// Custom Table Component with view toggle
export const TableWithToggle = ({
  children,
  theme,
  node,
  ...props
}: {
  children: ReactNode;
  theme: TypographyTheme;
  node?: HastLike;
} & HTMLAttributes<HTMLTableElement>) => {
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');

  // Default to the view that suits the viewport, and follow it on resize.
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)'); // below sm
    const apply = () => setViewMode(query.matches ? 'list' : 'table');
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const parsed = useMemo(() => parseTable(node), [node]);
  const hasHeaders = parsed?.headers.some(header => header.length > 0) ?? false;

  // A markdown table can have a header row with no text in it, used for
  // key-value blocks such as contact cards. Hide the empty tinted band it
  // would otherwise paint at the top of the table.
  const table = (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
      <table
        className={cn(
          theme.components.table,
          parsed !== null && !hasHeaders && '[&_thead]:hidden'
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );

  const list = () => {
    // If the table could not be parsed into rows, render it as written
    // rather than showing nothing.
    if (!parsed || parsed.rows.length === 0) return table;

    // A table with no header text is a key-value block, such as an office
    // contact card. Render it as a single card of term and detail pairs.
    if (!hasHeaders) {
      return (
        <div className={rowCardClass}>
          <dl className="space-y-3">
            {parsed.rows.map((cells, index) => (
              <div key={index}>
                <dt className={fieldLabelClass}>{cells[0]}</dt>
                <dd className={fieldValueClass}>
                  {renderValue(
                    cells.slice(1).filter(Boolean).join(', '),
                    theme.components.a
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {parsed.rows.map((cells, index) => {
          const fields = parsed.headers
            .map((header, column) => ({ header, value: cells[column] ?? '' }))
            .slice(1)
            .filter(field => field.value.length > 0);
          return (
            <div key={index} className={rowCardClass}>
              <p className="font-display text-sm font-bold tracking-tight text-primary-800">
                {cells[0]}
              </p>
              {fields.length > 0 && (
                <dl className="mt-2.5 space-y-2">
                  {fields.map(field => (
                    <div key={field.header}>
                      <dt className={fieldLabelClass}>{field.header}</dt>
                      <dd className={fieldValueClass}>
                        {renderValue(field.value, theme.components.a)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-end">
        <div
          role="group"
          aria-label="Table display"
          className="inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5"
        >
          {(['table', 'list'] as const).map(mode => {
            const Icon = mode === 'table' ? Table : List;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={viewMode === mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none',
                  viewMode === mode
                    ? 'bg-white text-primary-700 shadow-xs'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                <Icon aria-hidden="true" size={14} />
                {mode === 'table' ? 'Table' : 'List'}
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === 'table' ? table : list()}
    </div>
  );
};
