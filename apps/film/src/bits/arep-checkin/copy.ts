// Product strings of the check-in app (fr = the film's French, en = English). All fictional: guests, events, labels.
// The bit's own copy (« …aux applications web responsive. » / EN « …to responsive web applications. ») is in
// timeline.ts through this dictionary; the experience card's strings are here too.
import type { Bilingual } from '../../lib/locale';

type Guest = {
  name: string;
  initials: string;
  note: string; // table and guest status (the line under the name, on every screen)
  company: string; // desktop only: the company column
  role: string; // desktop only: the role under the company
  vip: boolean; // shows the VIP tag
  arrived: boolean; // present (accent band) before any check-in in this film
  avatar: 'mid' | 'deep' | 'teal' | 'neutral';
};

type Event = { kind: string; name: string; count: number };

const fr = {
  // Eight guests: the desktop table fills its card with all eight; the phone scrolls them.
  // Guests 1, 2 and 3 are not yet present: the three check-ins take them in turn (desk, tablet, phone).
  guests: [
    { name: 'MARTIN Claire', initials: 'CM', note: 'Table 4 · Accompagnant 1', company: 'Lumen', role: 'Chargée de projet', vip: false, arrived: true, avatar: 'mid' },
    { name: 'DUBOIS Hugo', initials: 'HD', note: 'Table 2 · Invité par S. Roux', company: 'Orion', role: 'Ingénieur', vip: false, arrived: false, avatar: 'deep' },
    { name: 'LEROY Sami', initials: 'SL', note: 'Table 7 · Sans accompagnant', company: 'Vega', role: 'Directeur', vip: false, arrived: false, avatar: 'teal' },
    { name: 'FAURE Inès', initials: 'IF', note: 'Table 1 · Sans accompagnant', company: 'Nova', role: "Chargée d'études", vip: true, arrived: false, avatar: 'neutral' },
    { name: 'ROUSSEL Léa', initials: 'LR', note: 'Table 5 · Accompagnant 2', company: 'Atlas', role: 'Assistante', vip: false, arrived: true, avatar: 'mid' },
    { name: 'BENARD Yanis', initials: 'YB', note: 'Table 3 · Invité par J. Petit', company: 'Helios', role: 'Consultant', vip: false, arrived: true, avatar: 'deep' },
    { name: 'MOREAU Chloé', initials: 'MC', note: 'Table 6 · Sans accompagnant', company: 'Lumen', role: 'Responsable RH', vip: true, arrived: false, avatar: 'neutral' },
    { name: 'PETIT Noah', initials: 'NP', note: 'Table 8 · Accompagnant 1', company: 'Vega', role: 'Stagiaire', vip: false, arrived: false, avatar: 'mid' },
  ] as Guest[],
  // The sidebar's events. The seed picks which one is open (its kind and name become the title).
  // count = the invitations of the event; the present count starts at PRESENT_BASE (data.ts).
  events: [
    { kind: 'Conférence', name: 'Atlas', count: 214 },
    { kind: 'Séminaire', name: 'Nova', count: 196 },
    { kind: 'Forum', name: 'Helios', count: 348 },
    { kind: 'Dîner', name: 'Orion', count: 207 },
    { kind: 'Salon', name: 'Vega', count: 231 },
  ] as Event[],
  subpages: ['Statistiques', 'Import', 'Export', 'Paramètres'],
  labels: {
    sidebar: 'Mes événements',
    search: 'Rechercher un invité',
    present: 'présents',
    of: 'invités',
    sep: ' · ',
    vip: 'VIP',
    url: 'checkin.exemple.fr',
    cols: { guest: 'Invité', company: 'Société · fonction', status: 'Statut' },
    stats: { present: 'Présents', waiting: 'En attente', total: 'Invités' },
  },
  // The status pills (desktop) and the bands' meaning.
  status: { present: 'Présent', pending: 'En attente' },
  // Detail 3: the experience card (logo in public/companies/, company name, activity and, smaller,
  // the period and its duration: dates from the portfolio's experience entry).
  experience: {
    company: 'AREP-Exigences',
    activity: 'Événementiel',
    period: 'sept. 2017 – sept. 2019 · 2 ans',
  },
  // The headline: the second half of olympiades' sentence (its first half is olympiades' line).
  responsives: '… au Développement Web.', // « Développement Web », capitalised; a space after « … »
};

// EN translation. Proper nouns (guests, companies, the events' names) keep their French form.
const en: typeof fr = {
  guests: [
    { name: 'MARTIN Claire', initials: 'CM', note: 'Table 4 · Companion 1', company: 'Lumen', role: 'Project manager', vip: false, arrived: true, avatar: 'mid' },
    { name: 'DUBOIS Hugo', initials: 'HD', note: 'Table 2 · Invited by S. Roux', company: 'Orion', role: 'Engineer', vip: false, arrived: false, avatar: 'deep' },
    { name: 'LEROY Sami', initials: 'SL', note: 'Table 7 · No companion', company: 'Vega', role: 'Director', vip: false, arrived: false, avatar: 'teal' },
    { name: 'FAURE Inès', initials: 'IF', note: 'Table 1 · No companion', company: 'Nova', role: 'Study officer', vip: true, arrived: false, avatar: 'neutral' },
    { name: 'ROUSSEL Léa', initials: 'LR', note: 'Table 5 · Companion 2', company: 'Atlas', role: 'Assistant', vip: false, arrived: true, avatar: 'mid' },
    { name: 'BENARD Yanis', initials: 'YB', note: 'Table 3 · Invited by J. Petit', company: 'Helios', role: 'Consultant', vip: false, arrived: true, avatar: 'deep' },
    { name: 'MOREAU Chloé', initials: 'MC', note: 'Table 6 · No companion', company: 'Lumen', role: 'HR manager', vip: true, arrived: false, avatar: 'neutral' },
    { name: 'PETIT Noah', initials: 'NP', note: 'Table 8 · Companion 1', company: 'Vega', role: 'Intern', vip: false, arrived: false, avatar: 'mid' },
  ] as Guest[],
  events: [
    { kind: 'Conference', name: 'Atlas', count: 214 },
    { kind: 'Seminar', name: 'Nova', count: 196 },
    { kind: 'Forum', name: 'Helios', count: 348 },
    { kind: 'Dinner', name: 'Orion', count: 207 },
    { kind: 'Trade show', name: 'Vega', count: 231 },
  ] as Event[],
  subpages: ['Statistics', 'Import', 'Export', 'Settings'],
  labels: {
    sidebar: 'My events',
    search: 'Search for a guest',
    present: 'present',
    of: 'guests',
    sep: ' · ',
    vip: 'VIP',
    url: 'checkin.exemple.fr',
    cols: { guest: 'Guest', company: 'Company · role', status: 'Status' },
    stats: { present: 'Present', waiting: 'Waiting', total: 'Guests' },
  },
  status: { present: 'Present', pending: 'Waiting' },
  experience: {
    company: 'AREP-Exigences',
    activity: 'Events',
    period: 'Sep 2017 – Sep 2019 · 2 years',
  },
  responsives: '…to Software Engineering.', // Capitalised
};

export const STR: Bilingual<typeof fr> = { fr, en };
