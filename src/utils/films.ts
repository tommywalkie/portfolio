export type FilmLang = 'en' | 'fr';
export type FilmTheme = 'light' | 'dark';
export type FilmDevice = 'desktop' | 'mobile';

export interface FilmEntry {
  /** HLS master playlist */
  hls: string;
  /** MP4 fallback, used when HLS playback fails */
  mp4: string;
  /** true when this entry reuses the video of another situation (the dedicated film does not exist yet) */
  fallback: boolean;
}

export type FilmKey = `${FilmLang}-${FilmTheme}-${FilmDevice}`;

const EN_DARK_DESKTOP: FilmEntry = {
  hls: '/videos/film-en-dark-desktop/master.m3u8',
  mp4: '/film__version-v1.1__en.mp4',
  fallback: false,
};

const FR_DARK_DESKTOP: FilmEntry = {
  hls: '/videos/film-fr-dark-desktop/master.m3u8',
  mp4: '/film__version-v1.1.mp4',
  fallback: false,
};

const FR_LIGHT_DESKTOP: FilmEntry = {
  hls: '/videos/film-fr-light-desktop/master.m3u8',
  mp4: '/film__version-v1.1__light.mp4',
  fallback: false,
};

const EN_LIGHT_DESKTOP: FilmEntry = {
  hls: '/videos/film-en-light-desktop/master.m3u8',
  mp4: '/film__version-v1.1__light__en.mp4',
  fallback: false,
};

export const FILMS: Record<FilmKey, FilmEntry> = {
  'en-dark-desktop': EN_DARK_DESKTOP,
  'fr-dark-desktop': FR_DARK_DESKTOP,
  'en-light-desktop': EN_LIGHT_DESKTOP,
  'fr-light-desktop': FR_LIGHT_DESKTOP,

  // Fallbacks: reuse the existing video of the same language and theme until the dedicated films are produced
  'en-dark-mobile': { ...EN_DARK_DESKTOP, fallback: true },
  'en-light-mobile': { ...EN_LIGHT_DESKTOP, fallback: true },
  'fr-dark-mobile': { ...FR_DARK_DESKTOP, fallback: true },
  'fr-light-mobile': { ...FR_LIGHT_DESKTOP, fallback: true },
};

export function getFilm(lang: string, theme: FilmTheme, device: FilmDevice): FilmEntry {
  const safeLang: FilmLang = lang === 'fr' ? 'fr' : 'en';
  return FILMS[`${safeLang}-${theme}-${device}`];
}
