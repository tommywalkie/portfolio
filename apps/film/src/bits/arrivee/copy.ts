// Strings of arrivee: the call to action, the last slide of the story. Every string the picture shows lives here
// (fr = the film's French, en = English). The timeline reads the copy from here; the timing does not depend on it.
import type { Bilingual } from '../../lib/locale';

const fr = {
  // Detail 2: the logo's name and role (« Tom Bazarnik, développeur fullstack »), set on two lines.
  nom: 'Tom Bazarnik,',
  role: 'Développeur Fullstack',
  // Detail 3: the site.
  site: 'tommywalkie.com',
};

const en: typeof fr = {
  nom: 'Tom Bazarnik,',
  role: 'Fullstack Developer',
  site: 'tommywalkie.com',
};

export const STR: Bilingual<typeof fr> = { fr, en };
