// arep-checkin: the check-in app in light mode, adapting to every screen. 3.25 bars (7.8 s at 100 BPM, 468 f).
//   bar 1     the desktop window (sidebar, dense table, counters); a guest is tapped in and checks in (frame 27)
//   bar 2     the same window morphs into a tablet (72-126: no sidebar, a top bar with a hamburger, medium type);
//             a second guest is tapped in on the tablet (144); the tablet morphs into a smartphone (180-234:
//             large type, 76 px rows); the list scrolls a little (216) and the third guest is tapped in on the phone (270)
//   bar 3     « …aux applications web responsive. » rises in the left column (252), the experience card arrives under
//             it (342), and the end holds 2 s with the line and card readable (468)
import { bitClock, chain, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'arep-checkin';

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 3.25,
  build: (from, locale = DEFAULT_LOCALE) => {
    const { at } = bitClock(from);
    const cue = {
      open: at(1), // frame 0: the desktop window is on screen
      // The first check-in tap comes later (it was 27 f in, right on top of the slide's arrival sounds)
      tapA: at(1, 1, 2), // the first tap: its ripple, the band flips, the count ticks
      settleA: at(1, 2, 0), // the count has settled
      tab: at(1, 2), // the window starts to morph into the tablet
      tab1: at(1, 2, 2), // mid-morph
      tab2: at(1, 3, 2), // the tablet has settled
      tapB: at(2), // the second tap on the tablet
      settleB: at(2, 0, 2),
      ph: at(2, 1), // the tablet starts to morph into the phone
      scroll: at(2, 2), // the list scrolls a little
      ph2: at(2, 2, 2), // the phone has settled; its slight drift starts here
      // The headline shows from the tablet size (the tablet has settled; it never reaches the text column)
      copy: at(1, 3, 2),
      tapC: at(2, 3, 2), // the third tap on the phone
      card: at(3, 0, 3), // (27 f earlier) the experience card arrives under the line (after the line is read)
      end: at(4, 1), // the bit's end: the copy and card hold to here
    };
    const copy = chain(`${SLUG}.responsives`, 'build', [[STR.fr.responsives, cue.copy, STR[locale].responsives]], { out: cue.end });
    return { cue, copy };
  },
};

export default timeline;
