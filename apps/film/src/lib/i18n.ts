// i18n for the components: the locale comes from the composition's `locale` prop through
// LocaleProvider (Film, FilmSub and every Bit-<slug> composition wrap their picture in it).
// Each bit keeps its strings in src/bits/<slug>/copy.ts as { fr: {...}, en: {...} }.
import React, { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, type Bilingual, type Locale } from './locale';

export { type Bilingual, type Locale } from './locale';

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const LocaleProvider: React.FC<{ locale: Locale; children: React.ReactNode }> = ({ locale, children }) =>
  React.createElement(LocaleContext.Provider, { value: locale }, children);

/** The active locale of the composition being rendered. */
export const useLocale = (): Locale => useContext(LocaleContext);

/** A bit's dictionary for the active locale: const S = useStrings(STR). */
export const useStrings = <T,>(dict: Bilingual<T>): T => dict[useLocale()];
