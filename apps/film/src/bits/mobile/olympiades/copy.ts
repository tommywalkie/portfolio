import type { Bilingual } from '../../../lib/locale';

const fr = {

  line: "De l'Électronique…",

  cardName: "Olympiades des Sciences de l'Ingénieur",
  cardActivity: 'Finale nationale',
  cardPeriod: 'avr. 2014',
};

const en: typeof fr = {
  line: 'From Electronics…',
  cardName: "Olympiades des Sciences de l'Ingénieur",
  cardActivity: 'National final',
  cardPeriod: 'Apr 2014',
};

export const STR: Bilingual<typeof fr> = { fr, en };
