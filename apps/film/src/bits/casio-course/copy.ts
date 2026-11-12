// Strings of casio-course (fr = the film's French, en = English). The film line is read by timeline.ts into COPY.
// The calculator's LCD text (the program list, the editor title, the menu, the race status) is in `lcd`: the LCD
// shows the locale's text, 21 columns at most, uppercase, no accents (the glyphs of _shared/casio/lcd.ts).
// The Basic code typed in the editor is code, not copy (index.tsx).
import type { Bilingual } from '../../lib/locale';

const fr = {
  // The film line, rising as the camera pulls back from the LCD.
  TITLE: 'Tout a commencé ici.',

  lcd: {
    // The program list, in order: the race first (it is the one picked).
    programs: ['COURSE CHEVAUX', 'DERIVEES', 'INTEGRALES', 'EQUATION 2ND DEG'],
    editTitle: 'EDIT COURSE CHEVAUX',
    menuTitle: 'COURSE HIPPIQUE',
    pick: 'CHOISIS TON CHEVAL',
    horse: (n: number) => `CHEVAL ${n}`,
    result: (n: number, won: boolean) => `CHEVAL ${n} : ${won ? 'GAGNE !' : 'PERDU'}`,
  },
};

// EN translation. The LCD text follows the French one line for line.
const en: typeof fr = {
  TITLE: 'It all started here.',

  lcd: {
    programs: ['HORSE RACE', 'DERIVATIVES', 'INTEGRALS', 'QUADRATIC EQ'],
    editTitle: 'EDIT HORSE RACE',
    menuTitle: 'HORSE RACE',
    pick: 'PICK YOUR HORSE',
    horse: (n: number) => `HORSE ${n}`,
    result: (n: number, won: boolean) => `HORSE ${n} : ${won ? 'WON !' : 'LOST'}`,
  },
};

export const STR: Bilingual<typeof fr> = { fr, en };
