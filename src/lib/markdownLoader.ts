/**
 * Utility to load markdown content dynamically based on slug
 */

/**
 * Replaces {PLACEHOLDER} tokens using JSON data first, then VITE_ env vars.
 */
function interpolate(
  content: string,
  data: Record<string, unknown> = {}
): string {
  return content.replace(/\{([A-Z0-9_]+)\}/g, (match, key) => {
    if (key in data) return String(data[key]);
    const value = import.meta.env[`VITE_${key}`];
    return value !== undefined ? String(value) : match;
  });
}

export interface MarkdownContent {
  content: string;
  title?: string;
  description?: string;
  data?: Record<string, unknown>;
}

/**
 * True when a dynamic import failed to fetch its chunk file. Every rebuild
 * renames the hashed chunk files and clears the old ones, so a tab that
 * stayed open across a deploy asks for files that no longer exist — on this
 * site that made every document page show "Document not found" until the
 * visitor happened to hard-refresh. Callers use this to distinguish "the
 * document does not exist" from "this session is stale and needs a reload".
 */
export function isChunkLoadError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    /dynamically imported module|module script failed|error loading/i.test(
      error.message
    )
  );
}

/**
 * Loads markdown content from the appropriate content directory.
 * Also attempts to load a companion JSON file (same slug) for template
 * variable substitution and structured data.
 * @param documentSlug - The document slug (filename without .md extension)
 * @param categorySlug - The category slug (parent directory)
 * @param categoryType - Whether this is a 'service' or 'government' document
 */
export async function loadMarkdownContent(
  documentSlug: string,
  categorySlug: string,
  categoryType: 'service' | 'government'
): Promise<MarkdownContent> {
  try {
    const dir = categoryType === 'government' ? 'government' : 'services';

    // Try to load companion JSON for template data
    let data: Record<string, unknown> = {};
    try {
      const jsonModule = await import(
        `../../content/${dir}/${categorySlug}/${documentSlug}.json`
      );
      data = jsonModule.default;
    } catch (jsonError) {
      // A stale-session fetch failure must not be swallowed here: the page
      // would render with raw {TOKEN} placeholders. Absence of a companion
      // JSON, by contrast, is fine.
      if (isChunkLoadError(jsonError)) throw jsonError;
    }

    const module = await import(
      `../../content/${dir}/${categorySlug}/${documentSlug}.md?raw`
    );
    const content = interpolate(module.default, data);

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;

    const descriptionMatch = content.match(/^#\s+.+$\n\n(.+?)(?:\n\n|$)/s);
    const description = descriptionMatch
      ? descriptionMatch[1].replace(/^>\s*/, '').trim()
      : undefined;

    return { content, title, description, data };
  } catch (error) {
    console.error(
      `Failed to load markdown content for document: ${documentSlug}`,
      error
    );
    // Let stale-chunk failures keep their identity so the page can recover
    // with a reload instead of telling the reader the document is gone.
    if (isChunkLoadError(error)) throw error;
    throw new Error(`Document not found: ${documentSlug}`);
  }
}
