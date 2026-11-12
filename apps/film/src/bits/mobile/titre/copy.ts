import type { Bilingual } from '../../../lib/locale';

const fr = {

  name: 'Tom Bazarnik',
  role: 'Développeur Fullstack',
};

const en: typeof fr = {
  name: 'Tom Bazarnik',
  role: 'Fullstack Developer',
};

export const STR: Bilingual<typeof fr> = { fr, en };
