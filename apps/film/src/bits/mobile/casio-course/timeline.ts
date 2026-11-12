import { BAR, bitClock, chain, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'casio-course';

const OPENING = 225;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: (OPENING + 288) / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const { at } = bitClock(from);

    const R = (n: number) => from + OPENING + n;
    const cue = {
      code: at(1),
      typeA: at(1, 1),
      typeB: at(1, 2),
      save: at(1, 3, 1),
      list: at(1, 3, 3),
      listUp1: at(2, 0, 1),
      listUp2: at(2, 0, 3),
      listUp3: at(2, 1, 1),
      listSel: at(2, 1, 3),
      menu: R(0),
      step1: R(18),
      step2: R(27),
      select: R(36),
      grid: R(45),
      go: R(54),

      race1: R(72),
      race2: R(90),
      race3: R(108),
      finish: R(117),
      result: R(126),
      pull: R(135),
      rest: R(171),
      title: R(144),
      end: R(288),
    };
    const copy = [...chain(`${SLUG}.titre`, 'build', [[STR.fr.TITLE, cue.title, STR[locale].TITLE]], { out: cue.end })];
    return { cue, copy };
  },
};

export default timeline;
