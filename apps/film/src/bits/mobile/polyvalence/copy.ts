import type { Bilingual } from '../../../lib/locale';

const fr = {

  TITLE: 'Polyvalent par curiosité.',
};

const en: typeof fr = {
  TITLE: 'Versatile by curiosity.',
};

export const STR: Bilingual<typeof fr> = { fr, en };
