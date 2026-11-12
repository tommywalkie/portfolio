import type { Bilingual } from '../../../lib/locale';

const fr = {

  msg: 'Contactez-moi !',
};

const en: typeof fr = {
  msg: 'Get in touch!',
};

export const STR: Bilingual<typeof fr> = { fr, en };
