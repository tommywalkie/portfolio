// Strings of titre: the trailer-style title card between the first two story slides. Every string the picture
// shows lives here (fr = the film's French, en = English). The timing is in timeline.ts and does not depend on the text.
import type { Bilingual } from '../../lib/locale';

const fr = {
  // The name, then the role, one after the other (« Tom Bazarnik » then « Développeur Fullstack »).
  name: 'Tom Bazarnik',
  role: 'Développeur Fullstack',
};

const en: typeof fr = {
  name: 'Tom Bazarnik',
  role: 'Fullstack Developer',
};

export const STR: Bilingual<typeof fr> = { fr, en };
