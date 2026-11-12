// olympiades: slide 3 of the story, 2.25 bars = 324 f = 5.4 s at 100 BPM / 60 fps (a whole 9 f multiple).
// The text column sits on the LEFT (x 96 to 670): the shared sentence « De l'électronique… » continues in
// arep-checkin as « …aux applications web responsive. » (PLAYBOOK, round robin). The picture sits in the
// right zone (x 770 to 1824): an IDE window with the sketch typed in it, above the dispenser.
// Local frames (from the act's start), 60 fps; every cue sits on the 16th grid (9 f):
//   0       the IDE window arrives (upper right); the dispenser starts to assemble from above
//   9       « De l'électronique… » rises in the left column (display type, accent on arrival), held to the end
//   9-255   the sketch is typed (30 characters a second)
//   0-90    the dispenser's parts drop in: base 0, column 18, drum cover 36, the 8 compartment walls 45-66
//   27      the side tray (its front lip faces the viewer) slides out of the base
//   90      the first turn of the drum; then every 54 f (0.9 s): turn 144, 198, 252 (24 f each, one step = 45 degrees)
//   126     the first pill drops out of the drum through the chute into the tray; 180, 234, 288 after the next turns
//   153     the distinction card arrives under the line (about 2.9 s before the end)
//   324     end (the line and the card hold to here)
import { BAR, chain, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'olympiades';
/** The length in frames: 2.25 bars (324 f, 5.4 s). */
const LEN = 324;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const at = (n: number) => from + n; // local frames, 60 fps
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
    // one build chain: the line is set at its place from the start and held to the end
    const copy = chain(`${SLUG}.line`, 'build', [[STR.fr.line, at(9), STR[locale].line]], { out: at(LEN) });
    return { cue, copy };
  },
};

export default timeline;
