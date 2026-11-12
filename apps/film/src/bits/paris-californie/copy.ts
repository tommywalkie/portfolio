// Product strings of the shared whiteboard, all fictional (fr = the film's French, en = English): column and card
// names, sticky notes, zone labels, the cursors' name tags. The bit's own copy (the line and the testimonial) lives
// here too, and timeline.ts reads it from here. Positions and tones are the same in both locales.
import type { Bilingual } from '../../lib/locale';

export type Tone = 'soft' | 'text' | 'mid' | 'accent' | 'accentDeep';
// `title`: one or two lines (a two-line title is set on two lines inside the card so it never overflows it).
type Card = { id: string; title: string[]; col: number; row: number; tone: Tone };
type Sticky = { lines: [string, string]; zone: number; tone: Tone; rot: number };

const fr = {
  LABELS: {
    url: 'tableau.exemple.fr',
    kanbanTitle: 'Cycle 6',
    retroTitle: 'Rétro du cycle',
    columns: ['À façonner', 'En cours', 'Livré'],
    zones: ['Vent', 'Ancre', 'Rochers', 'Île'],
    avatars: ['L', 'J'], // the initials of the two cursor names: index 0 = Paris (Léa), 1 = San Francisco (Jordan)
    // The two collaborators' cursor tags: a fictional first name, then the location and local time as subtext.
    tags: { paris: { name: 'Léa', sub: 'Paris · 18:00' }, sanFrancisco: { name: 'Jordan', sub: 'San Francisco · 9:00' } },
  },

  // Kanban cards: `col` and `row` are the start slot (see index.tsx for the slot grid).
  // One small feature (a shop's login and cart) as tickets.
  CARDS: [
    { id: 'login', title: ['Formulaire', 'de connexion'], col: 0, row: 0, tone: 'soft' },
    { id: 'tests', title: ['Tests e2e', 'du panier'], col: 0, row: 1, tone: 'soft' },
    { id: 'review', title: ['Revue de code'], col: 0, row: 2, tone: 'soft' },
    { id: 'orders', title: ['API des', 'commandes'], col: 1, row: 0, tone: 'mid' },
    { id: 'mockups', title: ['Maquettes'], col: 2, row: 0, tone: 'accentDeep' },
  ] as Card[],

  // Sticky notes on the sailboat retrospective: two lines each, placed in the zone of their meaning.
  STICKIES: [
    { lines: ['Revues de code', 'rapides'], zone: 0, tone: 'soft', rot: -2 },
    { lines: ['CI trop', 'lente'], zone: 1, tone: 'text', rot: 2 },
    // already on the board when the sailboat appears
    { lines: ['Specs', 'floues'], zone: 2, tone: 'accent', rot: -1 },
    { lines: ['Pair', 'programming'], zone: 3, tone: 'mid', rot: 1 },
  ] as Sticky[],

  // The line of copy (display role) and the testimonial (Maxime Gaudin, CTO, MadKudu).
  LINE: 'Productif, à l’international.',
  PERSON: { name: 'Maxime Gaudin', role: 'CTO', photo: 'profiles/maxime-gaudin.jpg' },
  QUOTES: ['Il est dévoué et un véritable joueur d’équipe.', 'Tom a travaillé dur pour contribuer aux produits clés de MadKudu et a toujours cherché à avoir un impact significatif.'] as [string, string],
};

// EN translation.
const en: typeof fr = {
  LABELS: {
    url: 'tableau.exemple.fr',
    kanbanTitle: 'Cycle 6',
    retroTitle: 'Cycle retro',
    columns: ['To shape', 'In progress', 'Shipped'],
    zones: ['Wind', 'Anchor', 'Rocks', 'Island'],
    avatars: ['L', 'J'],
    tags: { paris: { name: 'Léa', sub: 'Paris · 18:00' }, sanFrancisco: { name: 'Jordan', sub: 'San Francisco · 9:00' } },
  },
  CARDS: [
    { id: 'login', title: ['Login form'], col: 0, row: 0, tone: 'soft' },
    { id: 'tests', title: ['Cart e2e tests'], col: 0, row: 1, tone: 'soft' },
    { id: 'review', title: ['Code review'], col: 0, row: 2, tone: 'soft' },
    { id: 'orders', title: ['Orders API'], col: 1, row: 0, tone: 'mid' },
    { id: 'mockups', title: ['Mockups'], col: 2, row: 0, tone: 'accentDeep' },
  ] as Card[],
  STICKIES: [
    { lines: ['Fast code', 'reviews'], zone: 0, tone: 'soft', rot: -2 },
    { lines: ['Slow', 'CI'], zone: 1, tone: 'text', rot: 2 },
    { lines: ['Unclear', 'specs'], zone: 2, tone: 'accent', rot: -1 },
    { lines: ['Pair', 'programming'], zone: 3, tone: 'mid', rot: 1 },
  ] as Sticky[],
  LINE: 'Productive, worldwide.',
  PERSON: { name: 'Maxime Gaudin', role: 'CTO', photo: 'profiles/maxime-gaudin.jpg' },
  QUOTES: ['He is devoted and a true team player.', 'Tom worked hard to contribute to MadKudu’s key products and always sought to make a meaningful impact.'] as [string, string],
};

export const STR: Bilingual<typeof fr> = { fr, en };
