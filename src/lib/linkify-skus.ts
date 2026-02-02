/**
 * Pre-processes markdown content to transform SKU names into clickable links.
 *
 * Sorts SKUs by length (longest first) to avoid partial replacements,
 * then replaces each occurrence (word boundary match) with a markdown link.
 *
 * Existing markdown links are preserved by skipping content inside []() patterns.
 */
export function linkifySKUs(
  markdown: string,
  skus: string[],
  jobId: string
): string {
  if (!skus.length || !markdown) return markdown;

  // Sort by length descending to avoid partial replacements
  // e.g. "SKU_038_DELUXE" should be matched before "SKU_038"
  const sortedSkus = [...skus].sort((a, b) => b.length - a.length);

  let result = markdown;

  for (const sku of sortedSkus) {
    // Escape regex special characters in the SKU name
    const escaped = sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match the SKU as a whole word, but NOT if it's already inside a markdown link:
    // - Not preceded by [ (would be link text start)
    // - Not followed by ]( (would be link text end -> url)
    // - Not inside a URL portion (after ]( and before ))
    //
    // We use a negative lookbehind for [ and negative lookahead for ](
    // and also skip matches that are already inside [...](...) constructs.
    const regex = new RegExp(
      `(?<!\\[)\\b${escaped}\\b(?!\\]\\()`,
      "g"
    );

    const url = `/dashboard/results/series?job=${jobId}&series=${encodeURIComponent(sku)}`;
    result = result.replace(regex, `[${sku}](${url})`);
  }

  return result;
}
