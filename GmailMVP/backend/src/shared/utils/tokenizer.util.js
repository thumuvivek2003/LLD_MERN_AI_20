/**
 * Tokenize free text for the inverted index / search.
 * Lowercases, strips punctuation, splits on whitespace, drops empties.
 *
 * @param {string} text
 * @returns {string[]} list of normalized tokens
 */
export function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    // replace anything that isn't a letter/number with a space
    .replace(/[^a-z0-9]+/gi, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Unique tokens helper.
 * @param {string} text
 * @returns {string[]}
 */
export function uniqueTokens(text) {
  return [...new Set(tokenize(text))];
}
