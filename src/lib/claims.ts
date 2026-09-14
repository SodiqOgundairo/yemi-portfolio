/* The About headline asserts two countable facts about the `about` table.
   They live here, once, so the copy on the landing page and the check in the
   admin can never disagree about what is being claimed: the headline renders
   from these numbers and the admin compares live data against the same ones.
   Change a claim here and both surfaces follow. */
/* `trained` is a FLOOR, not a count: the CV and the teaching row both say
   "500+". The headline must read "more than five hundred", never a bare
   "five hundred", which claims an exact figure nobody can stand behind. */
export const HEADLINE_CLAIM = { countries: 4, teams: 7, trained: 500 };

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function words(n: number): string | null {
  if (n < 0 || n > 999 || !Number.isInteger(n)) return null;
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)], o = n % 10;
    return o ? `${t}-${ONES[o]}` : t;
  }
  const h = `${ONES[Math.floor(n / 100)]} hundred`, r = n % 100;
  return r ? `${h} and ${words(r)}` : h;
}

/** Spelled out and sentence-cased, because the headline is prose, not a stat
 *  block. Falls back to digits past twelve, where words stop reading well. */
export function spell(n: number) {
  const w = words(n);
  return w ? w[0].toUpperCase() + w.slice(1) : String(n);
}

/** Countries are counted off the last comma-separated segment of each
 *  experience row's location. "Remote" on its own is not a country, and
 *  counting it made the check cry wolf on correct copy. */
export function countCountries(metas: (string | null)[]) {
  return new Set(
    metas.map((m) => (m ?? "").split(",").pop()?.trim())
         .filter((x): x is string => !!x && x.toLowerCase() !== "remote"),
  ).size;
}
