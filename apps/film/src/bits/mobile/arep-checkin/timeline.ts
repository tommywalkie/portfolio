import { bitClock, chain, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'arep-checkin';

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 3.25,
  build: (from, locale = DEFAULT_LOCALE) => {
    const { at } = bitClock(from);
    const cue = {
      open: at(1),

      tapA: at(1, 1, 2),
      settleA: at(1, 2, 0),
      tab: at(1, 2),
      tab1: at(1, 2, 2),
      tab2: at(1, 3, 2),
      tapB: at(2),
      settleB: at(2, 0, 2),
      ph: at(2, 1),
      scroll: at(2, 2),
      ph2: at(2, 2, 2),

      copy: at(1, 3, 2),
      tapC: at(2, 3, 2),
      card: at(3, 0, 3),
      end: at(4, 1),
    };
    const copy = chain(`${SLUG}.responsives`, 'build', [[STR.fr.responsives, cue.copy, STR[locale].responsives]], { out: cue.end });
    return { cue, copy };
  },
};

export default timeline;
