// copilot-extension: the simplified cut with the floating button back. Local frames (60 fps);
// every cue sits on the 16th grid (9 f) from the act's start. At most two details on screen at any frame: the window
// (detail 1) with the headline (detail 2), then the window with the one card (detail 3) once the headline has left.
//   0     the window: a Salesforce-like page (app launcher, text skeletons), the floating button on its right border
//   9     the cursor sets off toward the floating button; 36 it is on it and waits 1.2 s (72 f)
//   18    « Des produits SaaS » builds in the headline column
//   108   the click: the sidebar slides in (36 f), the button moves to its left edge
//   144   « qui s'intègrent à » builds under the first line
//   162   the seven names rotate, one every 9 f, to « vos outils. » (216)
//   180 / 216 / 261 / 333  the four signals of the lead tick in, one after another
//   198 / 378 / 513  the page under the extension alternates: LinkedIn profile skeleton, Salesforce-like, LinkedIn
//   414   the headline leaves
//   459   the card (MadKudu, HG Insights Sales Copilot, available on the Chrome Web Store) arrives, fully in at 489
//   585   the end: about 1.6 s of hold after the card is fully in
import { BAR, chain, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'copilot-extension';

/** The cursor waits on the floating button for 1.2 s before it clicks. */
const FAB_WAIT = 72;

/** Local frames of every cue (from the act's start), all multiples of 9. */
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
    const F = STR.fr.intro; // timing text (French)
    const S = STR[locale].intro; // text shown
    // The headline: both chains leave together at headOut (the names leave with them in the bit).
    const copy = [
      ...chain(`${SLUG}.un`, 'build', [[F.un, cue.un, S.un]], { out: cue.headOut }),
      ...chain(`${SLUG}.integre`, 'build', [[F.integre, cue.integre, S.integre]], { out: cue.headOut }),
    ];
    return { cue, copy };
  },
};

export default timeline;
