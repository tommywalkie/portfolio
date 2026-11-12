// Non-text data of front-au-cloud: the logo path and the NestJS module the IDE types (code, the same in every
// locale). Every string the picture shows is in copy.ts (i18n).

// Logos in public/logos/ (copied by scripts/copy-logos.ts). Only the CI gate keeps one; the stack shows no logos.
export const LOGO = {
  githubActions: 'logos/github-actions.svg',
};

// The NestJS module the IDE types: [text, token] runs per line. Tokens are colours in Wireframes.tsx.
export type Run = [string, 'deco' | 'key' | 'cls' | 'punct'];
export const IDE_LINES: Run[][] = [
  [['@Module', 'deco'], ['({', 'punct']],
  [['  ', 'punct'], ['controllers', 'key'], [': [', 'punct']],
  [['    ', 'punct'], ['LeadsController', 'cls'], [',', 'punct']],
  [['  ],', 'punct']],
  [['  ', 'punct'], ['providers', 'key'], [': [', 'punct']],
  [['    ', 'punct'], ['LeadsService', 'cls'], [',', 'punct']],
  [['    ', 'punct'], ['LeadsRepository', 'cls'], [',', 'punct']],
  [['  ],', 'punct']],
  [['})', 'punct']],
];
