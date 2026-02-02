/**
 * Parses markdown content into sections split by H2 (##) headers.
 *
 * Returns an optional preamble (content before the first H2)
 * and an array of sections, each with a title and body content.
 */

export interface MarkdownSection {
  /** The H2 heading text (without the ## prefix) */
  title: string;
  /** All markdown content between this H2 and the next (or end of file) */
  content: string;
}

export interface ParsedMarkdown {
  /** Content before the first H2 (if any) */
  preamble: string;
  /** Sections split by H2 headings */
  sections: MarkdownSection[];
}

export function parseMarkdownSections(markdown: string): ParsedMarkdown {
  if (!markdown) return { preamble: "", sections: [] };

  // Match H2 lines: exactly ## at line start, followed by a space and title text
  const h2Regex = /^## (.+)$/gm;

  const matches = [...markdown.matchAll(h2Regex)];

  // No H2 found → everything is preamble, no accordion sections
  if (matches.length === 0) {
    return { preamble: markdown.trim(), sections: [] };
  }

  // Content before the first H2
  const preamble = markdown.slice(0, matches[0].index).trim();

  const sections: MarkdownSection[] = matches.map((match, index) => {
    const title = match[1].trim();
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd =
      index < matches.length - 1 ? matches[index + 1].index : markdown.length;
    const content = markdown.slice(contentStart, contentEnd).trim();

    return { title, content };
  });

  return { preamble, sections };
}
