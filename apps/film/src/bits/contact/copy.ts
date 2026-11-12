// Strings of contact: the quick call to action right before the arrivee slide. Every string the picture shows lives
// here (fr = the film's French, en = English). The timing is in timeline.ts and does not depend on the text.
import type { Bilingual } from '../../lib/locale';

const fr = {
  // « Contactez-moi ! », one kinetic line.
  msg: 'Contactez-moi !',
};

const en: typeof fr = {
  msg: 'Get in touch!',
};

export const STR: Bilingual<typeof fr> = { fr, en };
