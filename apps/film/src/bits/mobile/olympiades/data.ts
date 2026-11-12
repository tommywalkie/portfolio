import type { Locale } from '../../../lib/locale';

export const CARD = {
  logo: 'companies/olympiades-sciences-ingenieur.jpg',
};

type Tone = 'accentDeep' | 'deep' | 'mid' | 'stage';
export type Seg = [text: string, tone: Tone];

const K: Tone = 'accentDeep';
const T: Tone = 'deep';
const N: Tone = 'mid';
const D: Tone = 'stage';

const CODE_FR: Seg[][] = [
  [['#include', K], [' ', D], ['<Servo.h>', N]],
  [['Servo', T], [' tambour;', D]],
  [],
  [['void', K], [' setup() {', D]],
  [['  tambour.attach(', D], ['9', N], [');', D]],
  [['}', D]],
  [],
  [['void', K], [' loop() {', D]],
  [['  tambour.write(', D], ['45', N], [');', D]],
  [['  delay(', D], ['1000', N], [');', D]],
  [['}', D]],
];

const CODE_EN: Seg[][] = [
  [['#include', K], [' ', D], ['<Servo.h>', N]],
  [['Servo', T], [' drum;', D]],
  [],
  [['void', K], [' setup() {', D]],
  [['  drum.attach(', D], ['9', N], [');', D]],
  [['}', D]],
  [],
  [['void', K], [' loop() {', D]],
  [['  drum.write(', D], ['45', N], [');', D]],
  [['  delay(', D], ['1000', N], [');', D]],
  [['}', D]],
];

export const CODE: Record<Locale, Seg[][]> = { fr: CODE_FR, en: CODE_EN };

export const TAB: Record<Locale, string> = { fr: 'tambour.ino', en: 'drum.ino' };
