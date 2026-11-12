// arrivee: slide 14 of the story, the last one: the call to action. 5 s (300 f at 60 fps, 2.0833 bars at 100 BPM).
// It is the last act of the film, so the master adds its 1 s tail on top (the picture holds to the end).
// Local frames (from the act's start), 60 fps; every cue sits on the absolute 16th grid (9 f), snapped up:
//   0        the logo arrives (rises and fades in over 30 f)
//   0        the horse is already galloping at full, constant speed from the zone's left edge (instant start)
//   18       « Tom Bazarnik, » rises in
//   42       « Développeur Fullstack » rises in, 0.4 s after the name (quick succession)
//   66       « tommywalkie.com » rises in, 0.4 s after the role: all three are in by about 1.6 s, then hold
//   72       the horse's nose crosses the finish line at full speed (the line itself does not change)
//   162      the horse has decelerated smoothly to a stop past the line; the final state holds to the end
//   300      end of the 5 s; the act carries the master's tail after it
import { BAR, chain, TAIL, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'arrivee';
/** The length in frames (5 s). */
const LEN = 300;
/** The 16th grid of a 100 BPM / 60 fps bit (9 f). */
const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    // The act can start off the 16th grid (the acts before it end on fractional bars): each cue snaps up to the
    // absolute grid, so the bit's internal spacing is kept.
    const at = (n: number) => Math.ceil((from + n) / S16) * S16;
    // The copy holds to the act's real end (this act is the last one, so it carries the master's tail too).
    const held = from + LEN + TAIL;
    // Timing from the French text (the same frames in every locale); the text shown is the locale's.
    const F = STR.fr;
    const S = STR[locale];
    const cue: Record<string, number> = {
      open: at(0),
      run: at(0), // The horse is already galloping at full speed on the first frame
      name: at(18),
      role: at(42),
      site: at(66),
      cross: at(27), // The horse runs in way faster (was 72)
      stop: at(117), // the smooth end: 90 f of deceleration bring the tail 40 px past the line

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
