/**
 * ReactMarkdown components with configurable typography themes.
 *
 * Every element on a document page renders through this map, so it also
 * carries the document specific behaviors:
 *
 * - Paragraphs beginning with "TODO:" mark unverified facts in the content
 *   and render as a VerifyNotice contribution callout instead of body copy.
 *   Do not remove this detection.
 * - h2 to h4 receive stable ids derived from their text, so in page anchors
 *   written in the markdown, such as (#numbers-we-could-not-confirm) on the
 *   hotlines page, actually scroll to their section.
 * - Tables render through TableWithToggle, which needs the hast node to
 *   rebuild rows for its list view on phones.
 * - Blockquotes, which the content uses as end of page source notes, render
 *   as a framed provenance note rather than an italic pull quote.
 */

import { type TypographyTheme } from './typographyThemes';
import { type ReactNode, type HTMLAttributes } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { TableWithToggle, type HastLike } from './TableWithToggle';
import { VerifyNotice } from '../components/ui/VerifyNotice';
import { linkifyTelChildren } from './telLinks';
import { Figure } from '../components/ui/Figure';

const TODO_PREFIX = /^\s*TODO:\s*/;

/**
 * True when a paragraph's only content is a single image.
 *
 * Markdown wraps a lone image in a paragraph, and a <figure> inside a <p> is
 * invalid HTML that React will complain about at hydration. The paragraph
 * renderer checks this and yields the figure directly instead of nesting it.
 */
function isLoneImage(node?: HastLike): boolean {
  const children = (node?.children ?? []).filter(
    child => !(child.type === 'text' && !String(child.value ?? '').trim())
  );
  return children.length === 1 && children[0]?.tagName === 'img';
}

/**
 * If a markdown paragraph's text begins with "TODO:", return its children
 * with the prefix stripped so the reader never sees the token. Returns null
 * for ordinary paragraphs. Children can be a lone string or a mixed array
 * (for example when the note contains a link), in which case only the
 * leading string carries the prefix.
 */
function extractVerifyNotice(children: ReactNode): ReactNode | null {
  if (typeof children === 'string') {
    return TODO_PREFIX.test(children)
      ? children.replace(TODO_PREFIX, '')
      : null;
  }
  if (Array.isArray(children)) {
    const [first, ...rest] = children;
    if (typeof first === 'string' && TODO_PREFIX.test(first)) {
      return [first.replace(TODO_PREFIX, ''), ...rest];
    }
  }
  return null;
}

/**
 * react-markdown hands every renderer the hast node it rendered from. Only
 * the table renderer uses it, and it must not reach the DOM as an attribute,
 * so it is stripped before the remaining props are spread onto an element.
 */
function domProps<P extends object>(props: P): Omit<P, 'node'> {
  const rest = { ...props } as P & { node?: unknown };
  delete rest.node;
  return rest;
}

/** Plain text of a React subtree, used to derive heading ids. */
function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textContent).join('');
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as { props?: { children?: ReactNode } };
    return textContent(element.props?.children);
  }
  return '';
}

/** GitHub style slug for a heading, so markdown anchor links resolve. */
function headingId(children: ReactNode): string | undefined {
  const slug = textContent(children)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return slug.length > 0 ? slug : undefined;
}

// Extended theme type to include dynamic component keys
type ExtendedTheme = TypographyTheme & {
  components: TypographyTheme['components'] & {
    [key: string]: string | undefined;
  };
};

type MdProps<E> = { children?: ReactNode } & HTMLAttributes<E>;

/**
 * Creates ReactMarkdown components with custom styling based on typography theme
 */
export function createMarkdownComponents(theme: TypographyTheme) {
  const extendedTheme = theme as ExtendedTheme;
  return {
    h1: ({ children, ...props }: MdProps<HTMLHeadingElement>) => (
      <h1 className={theme.components.h1} {...domProps(props)}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: MdProps<HTMLHeadingElement>) => (
      <h2
        id={headingId(children)}
        className={theme.components.h2}
        {...domProps(props)}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: MdProps<HTMLHeadingElement>) => (
      <h3
        id={headingId(children)}
        className={theme.components.h3}
        {...domProps(props)}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: MdProps<HTMLHeadingElement>) => (
      <h4
        id={headingId(children)}
        className={theme.components.h4}
        {...domProps(props)}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: MdProps<HTMLHeadingElement>) => (
      <h5 className={theme.components.h5} {...domProps(props)}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: MdProps<HTMLHeadingElement>) => (
      <h6 className={theme.components.h6} {...domProps(props)}>
        {children}
      </h6>
    ),
    img: ({
      src,
      alt,
      title,
    }: {
      src?: string;
      alt?: string;
      title?: string;
    } & MdProps<HTMLElement>) => (
      <Figure
        src={typeof src === 'string' ? src : ''}
        alt={alt ?? ''}
        caption={title}
        theme={theme}
      />
    ),
    p: ({
      node,
      children,
      ...props
    }: { node?: HastLike } & MdProps<HTMLParagraphElement>) => {
      // A lone image is rendered as a figure, which cannot live inside a <p>.
      // Hand the child straight through rather than wrapping it.
      if (isLoneImage(node)) return <>{children}</>;

      // Paragraphs starting with "TODO:" mark unverified facts in the
      // content. Render them as a contribution callout instead of body copy.
      const notice = extractVerifyNotice(children);
      if (notice !== null) {
        return (
          <VerifyNotice>
            {linkifyTelChildren(notice, theme.components.a)}
          </VerifyNotice>
        );
      }
      return (
        <p className={theme.components.p} {...domProps(props)}>
          {linkifyTelChildren(children, theme.components.a)}
        </p>
      );
    },
    small: ({ children, ...props }: MdProps<HTMLElement>) => (
      <small className={theme.components.small} {...domProps(props)}>
        {children}
      </small>
    ),
    ul: ({ children, ...props }: MdProps<HTMLUListElement>) => {
      // Task lists carry their own item styling, so skip the list wrapper.
      const hasTaskItems =
        Array.isArray(children) &&
        children.some(
          child =>
            typeof child === 'object' &&
            child !== null &&
            'props' in child &&
            (
              child as { props?: { className?: string } }
            ).props?.className?.includes('task-list-item')
        );

      if (hasTaskItems) {
        // Keep the list wrapper: bare <li> elements are invalid HTML and
        // screen readers lose the list semantics. Task items carry their own
        // markers, so suppress the theme's bullets and indent.
        return (
          <ul className="mb-5 max-w-[65ch] list-none space-y-2 pl-0">
            {children}
          </ul>
        );
      }

      return (
        <ul className={theme.components.ul} {...domProps(props)}>
          {children}
        </ul>
      );
    },
    ol: ({ children, ...props }: MdProps<HTMLOListElement>) => (
      <ol className={theme.components.ol} {...domProps(props)}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: MdProps<HTMLLIElement>) => {
      const liClass = theme.components.li || '';
      const taskLiClass =
        extendedTheme.components['li.task-list-item'] || liClass;

      // Task list items swap the disabled checkbox input for a marker that
      // matches its actual state. Unchecked items must not render as done:
      // "- [ ] bring your ID" is a to-do for the reader, not a completed step.
      if (props.className?.includes('task-list-item')) {
        const childArray = Array.isArray(children) ? children : [children];
        const isChecked = childArray.some(
          (child: ReactNode) =>
            typeof child === 'object' &&
            child !== null &&
            'props' in child &&
            (child as { props?: { type?: string; checked?: boolean } }).props
              ?.type === 'checkbox' &&
            (child as { props?: { checked?: boolean } }).props?.checked === true
        );
        const withoutCheckbox = childArray.filter(
          (child: ReactNode) =>
            !(
              typeof child === 'object' &&
              child !== null &&
              'props' in child &&
              (child as { props?: { type?: string } }).props?.type ===
                'checkbox'
            )
        );

        return (
          <li className={taskLiClass} {...domProps(props)}>
            {isChecked ? (
              <span aria-hidden="true" className="pr-0">
                ✅
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="mt-1 mr-0.5 inline-block h-4 w-4 shrink-0 rounded border-2 border-gray-400 bg-white align-text-top"
              />
            )}
            {withoutCheckbox}
          </li>
        );
      }

      return (
        <li className={liClass} {...domProps(props)}>
          {linkifyTelChildren(children, theme.components.a)}
        </li>
      );
    },
    blockquote: ({ children, ...props }: MdProps<HTMLQuoteElement>) => (
      <blockquote className={theme.components.blockquote} {...domProps(props)}>
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-primary-600"
        >
          <BookOpenCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0">{children}</div>
      </blockquote>
    ),
    code: ({
      children,
      className,
      ...props
    }: { className?: string } & MdProps<HTMLElement>) => {
      // Check if it's inline code or code block
      const isInline = !className?.includes('language-');
      return isInline ? (
        <code className={theme.components.code} {...domProps(props)}>
          {children}
        </code>
      ) : (
        <code className={className} {...domProps(props)}>
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }: MdProps<HTMLPreElement>) => (
      <pre className={theme.components.pre} {...domProps(props)}>
        {children}
      </pre>
    ),
    a: ({
      children,
      href,
      ...props
    }: { href?: string } & MdProps<HTMLAnchorElement>) => {
      // Check if it's an external link
      const isExternal =
        href && (href.startsWith('http://') || href.startsWith('https://'));

      return (
        <a
          href={href}
          className={theme.components.a}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...domProps(props)}
        >
          {children}
        </a>
      );
    },
    strong: ({ children, ...props }: MdProps<HTMLElement>) => (
      <strong className={theme.components.strong} {...domProps(props)}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: MdProps<HTMLElement>) => (
      <em className={theme.components.em} {...domProps(props)}>
        {children}
      </em>
    ),
    hr: ({ ...props }: HTMLAttributes<HTMLHRElement>) => (
      <hr className={theme.components.hr} {...domProps(props)} />
    ),
    table: ({
      node,
      children,
      ...props
    }: { node?: HastLike } & MdProps<HTMLTableElement>) => (
      <TableWithToggle theme={theme} node={node} {...props}>
        {children}
      </TableWithToggle>
    ),
    thead: ({ children, ...props }: MdProps<HTMLTableSectionElement>) => (
      <thead className={theme.components.thead} {...domProps(props)}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: MdProps<HTMLTableSectionElement>) => (
      <tbody className={theme.components.tbody} {...domProps(props)}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: MdProps<HTMLTableRowElement>) => (
      <tr className={theme.components.tr} {...domProps(props)}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: MdProps<HTMLTableCellElement>) => (
      <th scope="col" className={theme.components.th} {...domProps(props)}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: MdProps<HTMLTableCellElement>) => (
      <td className={theme.components.td} {...domProps(props)}>
        {linkifyTelChildren(children, theme.components.a)}
      </td>
    ),
  };
}
