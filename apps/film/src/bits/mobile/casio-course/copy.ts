import type { Bilingual } from '../../../lib/locale';

const fr = {

  TITLE: 'Tout a commencé ici.',

  lcd: {

    programs: ['COURSE CHEVAUX', 'DERIVEES', 'INTEGRALES', 'EQUATION 2ND DEG'],
    editTitle: 'EDIT COURSE CHEVAUX',
    menuTitle: 'COURSE HIPPIQUE',
    pick: 'CHOISIS TON CHEVAL',
    horse: (n: number) => `CHEVAL ${n}`,
    result: (n: number, won: boolean) => `CHEVAL ${n} : ${won ? 'GAGNE !' : 'PERDU'}`,
  },
};

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
