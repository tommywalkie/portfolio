import { BAR, chain, TAIL, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'arrivee';

const LEN = 300;

const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {

    const at = (n: number) => Math.ceil((from + n) / S16) * S16;

    const held = from + LEN + TAIL;

    const F = STR.fr;
    const S = STR[locale];
    const cue: Record<string, number> = {
      open: at(0),
      run: at(0),
      name: at(18),
      role: at(42),
      site: at(66),
      cross: at(27),
      stop: at(117),

      end: at(LEN),
    };
    const copy = [
      ...chain(`${SLUG}.nom`, 'build', [[F.nom, cue.name, S.nom]], { out: held }),
      ...chain(`${SLUG}.role`, 'build', [[F.role, cue.role, S.role]], { out: held }),
      ...chain(`${SLUG}.site`, 'build', [[F.site, cue.site, S.site]], { out: held }),
    ];
    return { cue, copy };
  },
};

export default timeline;
