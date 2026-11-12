import type { Bilingual } from '../../../lib/locale';

const fr = {

  nom: 'Tom Bazarnik,',
  role: 'Développeur Fullstack',

  site: 'tommywalkie.com',
};

const en: typeof fr = {
  nom: 'Tom Bazarnik,',
  role: 'Fullstack Developer',
  site: 'tommywalkie.com',
};

export const STR: Bilingual<typeof fr> = { fr, en };
