// Non-text data of olympiades: the IDE's code and file name (code, not copy: per locale, identifiers and the file name
// in English for the EN locale) and the card's logo path. The strings are in copy.ts (i18n). No import of
// brand/tokens here: the timeline imports this file and tokens imports the timeline (a cycle).
import type { Locale } from '../../lib/locale';

// The distinction card's logo: the portfolio's own distinction image, copied to public/companies/.
export const CARD = {
  logo: 'companies/olympiades-sciences-ingenieur.jpg',
};

// A typed segment: its text and its colour, a key of the palette in brand/tokens.ts (C[key], resolved in IdeWindow).
type Tone = 'accentDeep' | 'deep' | 'mid' | 'stage';
export type Seg = [text: string, tone: Tone];

// The sketch typed in the IDE window (C for an Arduino board: #include, setup(), loop(), a servo on pin 9).
// Light mode: keywords in the accent-deep green, types in deep green, numbers and strings in mid green.
const K: Tone = 'accentDeep';
const T: Tone = 'deep';
const N: Tone = 'mid';
const D: Tone = 'stage';

// The French sketch: the servo is « tambour ».
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

// The English sketch: « tambour » is « drum » (identifiers and file name), the same valid Arduino C.
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

// The IDE's file tab (a file name, not a URL).
export const TAB: Record<Locale, string> = { fr: 'tambour.ino', en: 'drum.ino' };
