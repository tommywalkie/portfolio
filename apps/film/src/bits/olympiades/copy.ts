// Strings of olympiades (fr = the film's French, en = English). The film copy « De l'électronique… » is the
// line in the left column; the distinction card (detail 3) comes from the portfolio's distinction entry.
// The IDE's code and file name are not copy (data.ts, per locale).
import type { Bilingual } from '../../lib/locale';

const fr = {
  // Film copy: one display line in the left column, held to the end (it continues into arep-checkin's
  // « …aux applications web responsive. »).
  line: "De l'Électronique…", // Capitalised
  // The distinction card: the portfolio's own distinction entry (src/content/distinctions/fr/olympiades-sciences-ingenieur.mdx).
  cardName: "Olympiades des Sciences de l'Ingénieur",
  cardActivity: 'Finale nationale',
  cardPeriod: 'avr. 2014',
};

// EN translation. The line is cut in two across olympiades and arep-checkin, as in French.
const en: typeof fr = {
  line: 'From Electronics…', // Capitalised
  cardName: "Olympiades des Sciences de l'Ingénieur", // the competition's own name: kept as a proper noun
  cardActivity: 'National final',
  cardPeriod: 'Apr 2014',
};

export const STR: Bilingual<typeof fr> = { fr, en };
