// Strings of polyvalence (fr = the film's French, en = English). The only on-screen text is the film's line, read by
// timeline.ts into COPY; the tool chips show the tools' names (src/data/tools.ts: proper names, the same in both locales).
import type { Bilingual } from '../../lib/locale';

const fr = {
  // The title line, risen in the picture (« Polyvalent par curiosité. »).
  TITLE: 'Polyvalent par curiosité.',
};

// EN translation.
const en: typeof fr = {
  TITLE: 'Versatile by curiosity.',
};

export const STR: Bilingual<typeof fr> = { fr, en };
