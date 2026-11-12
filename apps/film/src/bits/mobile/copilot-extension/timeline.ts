import { BAR, chain, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'copilot-extension';

const FAB_WAIT = 72;

const L = {
  open: 0,
  un: 18,
  reach: 9,
  arrive: 36,
  click: 36 + FAB_WAIT,
  opened: 144,
  integre: 144,
  tgt: 162,
  sig1: 180,
  social: 198,
  sig2: 216,
  sig3: 261,
  sig4: 333,
  crm: 378,
  headOut: 414,
  card: 459,
  social2: 513,
  end: 585,
} as const;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: L.end / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const cue: Record<string, number> = {};
    for (const [k, v] of Object.entries(L)) cue[k] = from + v;
    const F = STR.fr.intro;
    const S = STR[locale].intro;

    const copy = [
      ...chain(`${SLUG}.un`, 'build', [[F.un, cue.un, S.un]], { out: cue.headOut }),
      ...chain(`${SLUG}.integre`, 'build', [[F.integre, cue.integre, S.integre]], { out: cue.headOut }),
    ];
    return { cue, copy };
  },
};

export default timeline;
