export const LOGO = {
  githubActions: 'logos/github-actions.svg',
};

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
