// Combining diacritical marks block (U+0300–U+036F), built from char codes
// rather than a literal regex range to avoid embedding raw combining chars.
const COMBINING_MARKS = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  'g'
)

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '') // strip accents, e.g. e-acute -> e
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // spaces, punctuation, symbols -> dash
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
}
