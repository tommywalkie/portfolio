import { bitClock, chain, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'polyvalence';

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 2,
  build: (from, locale = DEFAULT_LOCALE) => {
    const { at } = bitClock(from);
    const cue = {
      open: at(1),
      wave: at(1, 1),
      cloud: at(1, 2),
      gather: at(1, 3),
      title: at(1, 3, 2),
      core: at(1, 3, 3),
      settle: at(2),
      calm: at(2, 0, 1),
      hold1: at(2, 0, 2),
      hold2: at(2, 0, 3),
      end: at(3),
    };
    const copy = [...chain(`${SLUG}.titre`, 'build', [[STR.fr.TITLE, cue.title, STR[locale].TITLE]], { out: cue.end })];
    return { cue, copy };
  },
};

export default timeline;
