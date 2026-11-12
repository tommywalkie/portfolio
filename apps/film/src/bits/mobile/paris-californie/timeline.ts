import { b, bitClock, BAR, line, type BitTimeline, type Copy } from '../../../lib/grid';
import { wordCount } from '../../../lib/pace';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const QUOTES = STR.fr.QUOTES;

const SLUG = 'paris-californie';

const RISE = 24;
const FADE = 12;
const readFor = (text: string) => Math.ceil(Math.ceil((wordCount(text) * 60) / 3.5 + 120) / 9) * 9;

const Q1_IN = b(1, 0, 13);
const Q1_OUT = Q1_IN + RISE + readFor(QUOTES[0]);
const Q2_IN = Q1_OUT + FADE;
const END = Q2_IN + RISE + readFor(QUOTES[1]);

const timeline: BitTimeline = {
  slug: SLUG,
  bars: END / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const S = STR[locale];
    const { at } = bitClock(from);
    const n = (k: number) => at(1, 0, k);
    const cue = {
      open: n(0),
      line: n(2),
      pApproach: n(4),
      pGrab: n(7),
      pDrop: n(11),
      box: n(11),
      sApproach: n(9),
      sGrab: n(12),
      sDrag: n(13),
      sDrop: n(17),
      sAway: n(19),
      sAwayEnd: n(22),
      pan: n(30),
      pFly: n(34),
      panEnd: n(36),
      sFly: n(37),
      stA: n(38),
      stB: n(42),

      pDown1: n(12),
      pDownEnd1: n(15),
      pDown2: n(39),
      pDownEnd2: n(41),
      pDown3: n(84),
      pDownEnd3: n(87),
      sDown2: n(43),
      sDownEnd2: n(46),
      sDown3: n(72),
      sDownEnd3: n(75),
      sDown4: n(96),
      sDownEnd4: n(99),
      sGo1: n(66),
      sArr1: n(70),
      sVote1: n(71),
      pGo1: n(78),
      pArr1: n(82),
      pVote1: n(83),
      sGo2: n(90),
      sArr2: n(94),
      sVote2: n(95),
      q1: from + Q1_IN,
      q2: from + Q2_IN,
      end: from + END,
    };
    const copy: Copy[] = [
      line(`${SLUG}.line`, STR.fr.LINE, cue.line, cue.box, S.LINE),
      { id: `${SLUG}.q1`, text: S.QUOTES[0], in: cue.q1, resolved: cue.q1 + RISE, out: cue.q2 - FADE },
      { id: `${SLUG}.q2`, text: S.QUOTES[1], in: cue.q2, resolved: cue.q2 + RISE, out: cue.end },
    ];
    return { cue, copy };
  },
};

export default timeline;
