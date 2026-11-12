// Product strings of the tool-round app (fr = the film's French, en = English): the list, the statuses, the
// route's total and the scan label. The bit's own copy (« Ownership de » / « bout en bout. » ; EN « Ownership, » /
// « End-to-end. ») is read by timeline.ts through this dictionary; the experience card's strings are here too.
import type { Bilingual } from '../../lib/locale';

const fr = {
  app: {
    name: 'Centre technique',
    panel: 'Outils à trouver',
    add: 'Ajouter un outil',
    route: 'Itinéraire',
    scan: 'Scanner le QR code',
  },
  status: { wait: 'À trouver', good: 'Bon état', broken: 'À réparer' },
  // The five tools the list can hold. A seed picks three of them, and their order (seed 1: the first three).
  tools: ['Multimètre', 'Boîte de clous', 'Pince ampèremétrique', 'Jeu de tournevis', 'Lampe torche'],
  // The route's total for the chip: three tools, the metres walked on the plan.
  chip: (t: { tools: number; metres: number }) => `${t.tools} outils · ${t.metres} m`,
  // The message, two lines in the right column (display type).
  msg: ['Ownership de', 'bout en bout.'],
  // Detail 3: the experience card (logo in public/companies/, company name, activity and, smaller,
  // the period and its duration: dates from the portfolio's SNCF entry, src/content/experiences/fr/ineat.mdx,
  // 2019-09 to 2021-03, formatted as the portfolio formats it: 1 an et 7 mois).
  experience: {
    company: 'SNCF',
    activity: 'Transport public',
    period: 'sept. 2019 – mars 2021 · 1 an et 7 mois',
  },
};

// EN translation. The site keeps its anonymised « Technical center » name; the company is a proper noun.
const en: typeof fr = {
  app: {
    name: 'Technical center',
    panel: 'Tools to find',
    add: 'Add a tool',
    route: 'Route',
    scan: 'Scan the QR code',
  },
  status: { wait: 'To find', good: 'Good condition', broken: 'To repair' },
  tools: ['Multimeter', 'Box of nails', 'Clamp meter', 'Screwdriver set', 'Flashlight'],
  chip: (t: { tools: number; metres: number }) => `${t.tools} tools · ${t.metres} m`,
  msg: ['Ownership,', 'End-to-end.'],
  experience: {
    company: 'SNCF',
    activity: 'Public transport',
    period: 'Sep 2019 – Mar 2021 · 1 year 7 months',
  },
};

export const STR: Bilingual<typeof fr> = { fr, en };
