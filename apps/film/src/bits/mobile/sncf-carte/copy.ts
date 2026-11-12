import type { Bilingual } from '../../../lib/locale';

const fr = {
  app: {
    name: 'Centre technique',
    panel: 'Outils à trouver',
    add: 'Ajouter un outil',
    route: 'Itinéraire',
    scan: 'Scanner le QR code',
  },
  status: { wait: 'À trouver', good: 'Bon état', broken: 'À réparer' },

  tools: ['Multimètre', 'Boîte de clous', 'Pince ampèremétrique', 'Jeu de tournevis', 'Lampe torche'],

  chip: (t: { tools: number; metres: number }) => `${t.tools} outils · ${t.metres} m`,

  msg: ['Ownership de', 'bout en bout.'],

  experience: {
    company: 'SNCF',
    activity: 'Transport public',
    period: 'sept. 2019 – mars 2021 · 1 an et 7 mois',
  },
};

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
