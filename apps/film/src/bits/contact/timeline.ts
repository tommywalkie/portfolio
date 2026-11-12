// contact: the quick « Contactez-moi ! » just before arrivee. Under 1 s: 54 f at 60 fps (0.9 s,
// 0.375 bars at 100 BPM, 1 bar = 144 f). The act starts on the 16th grid, so every cue is snapped up to it.
// Local frames (from the act's start), 60 fps:
//   0    « Contactez-moi ! » rises out of its mask on E.out (RISE f), its letter-spacing closes from wide to the display track
//   27   the line leaves upward (EXIT f), gone by 45
//   45   the stage is empty for the last 9 f; the arrivee act starts (its logo fades in from its first frame)
import { BAR, type BitTimeline, type Copy } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'contact';
/** The length in frames (0.9 s). */
const LEN = 54;
/** Frames the line takes to rise in. */
export const RISE = 18;
/** Frames the line takes to leave upward. */
export const EXIT = 18;
/** The 16th grid of a 100 BPM / 60 fps bit (9 f). */
const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    // The act starts on the 16th grid (the acts before it pad to it), so each cue snaps up to the absolute grid.
    const at = (n: number) => Math.ceil((from + n) / S16) * S16;
    const cue: Record<string, number> = {
      msg: at(0),
      msgOut: at(27),
    };
    const S = STR[locale];
    const copy: Copy[] = [{ id: `${SLUG}.msg.0`, text: S.msg, in: cue.msg, resolved: cue.msg + RISE, out: cue.msgOut }];
    return { cue, copy };
  },
};

export default timeline;
