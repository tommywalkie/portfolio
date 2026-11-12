// The film's locale: one type, one default, and the environment read for the Node scripts.
// Pure TypeScript (no React): the master timeline and grid-check load this file directly.
// Components read the locale from the input prop through LocaleProvider (src/lib/i18n.ts).

export type Locale = 'fr' | 'en';
export const LOCALES: readonly Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';

/** A value written once per locale. */
export type Bilingual<T> = Record<Locale, T>;

const isLocale = (v: unknown): v is Locale => v === 'fr' || v === 'en';

/**
 * The locale the master timeline (src/timeline.ts) and the Node scripts run with:
 * `FILM_LOCALE=en npx tsx scripts/grid-check.ts src/timeline.ts`. Unset means fr. In the browser
 * bundle there is no process.env, so it is fr there and the composition's `locale` prop decides.
 */
const envLocale = (): Locale => {
  const raw = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.FILM_LOCALE;
  if (raw === undefined || raw === '') return DEFAULT_LOCALE;
  if (!isLocale(raw)) throw new Error(`FILM_LOCALE must be fr or en, got "${raw}"`);
  return raw;
};

export const ACTIVE_LOCALE: Locale = envLocale();
