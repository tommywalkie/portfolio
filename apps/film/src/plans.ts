// The film's playing order. Pure data (no React), so the master timeline and the Node scripts can read it. A bit keeps
// its own cues wherever it is placed: moving it only shifts its Sequence, never its internal timing.
export const FILM_ORDER: string[] = [
  'casio-course',
  'titre',
  'olympiades',
  'arep-checkin',
  'sncf-carte',
  'copilot-extension',
  'paris-californie',
  'rugby',
  'front-au-cloud',
  'graphe-relationnel',
  'polyvalence',
  'ia-workflow',
  'contact',
  'arrivee',
];
