import { BAR, chain, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'olympiades';

const LEN = 324;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const at = (n: number) => from + n;
    const cue: Record<string, number> = {
      open: at(0),
      type: at(9),
      base: at(0),
      column: at(18),
      tray: at(27),
      dome: at(36),
      pods: at(45),
      chute: at(117),
      turn0: at(90),
      turn1: at(144),
      turn2: at(198),
      turn3: at(252),
      drop0: at(126),
      drop1: at(180),
      drop2: at(234),
      drop3: at(288),
      card: at(153),
    };

    const copy = chain(`${SLUG}.line`, 'build', [[STR.fr.line, at(9), STR[locale].line]], { out: at(LEN) });
    return { cue, copy };
  },
};

export default timeline;
