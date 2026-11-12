// Which theme the film is rendered in: 'dark' (tommywalkie.com in dark mode: the hunter-green stage,
// the palette src/brand/tokens.ts calls C) or 'light' (the same site in light mode: a white page,
// hunter-green type and surfaces). Pure TypeScript, no React.
//
// Chosen with the FILM_THEME environment variable (default dark): Node scripts read it directly; the
// Remotion bundle gets it baked in by remotion.config.ts (__FILM_THEME__), since the browser has no
// process.env. Baked rather than a prop for the same reason as FILM_VERSION: tokens.ts is read at
// module scope by many components (const TAG, pillText), so the theme has to be settled before any of
// them is evaluated. One bundle = one theme; scripts/film-v1.1.sh --theme light bundles twice.
declare const __FILM_THEME__: string | undefined;

type Theme = 'dark' | 'light';
const THEMES: Theme[] = ['dark', 'light'];

const raw =
  typeof __FILM_THEME__ !== 'undefined'
    ? __FILM_THEME__
    : (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.FILM_THEME;

if (raw && !THEMES.includes(raw as Theme)) throw new Error(`theme: FILM_THEME must be dark or light, got "${raw}"`);

const THEME: Theme = (raw as Theme) || 'dark';

/** True when the film renders on the site's light page. Tokens.ts picks the palette with it. */
export const LIGHT = THEME === 'light';
