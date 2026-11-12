// rugby: the rapid transition between paris-californie and front-au-cloud. No text, no headline.
// A 3D rugby ball rotating in slow motion, like a pass, in the flat, grainy
// illustration style of the reference (solid colour shapes, paper grain, no outlines).
// 90 f at 60 fps (1.5 s, 0.625 bars at 100 BPM, 1 bar = 144 f). Local frames, snapped up to the absolute 16th grid:
//   0    the ball is already in flight, spinning on its long axis (a spiral pass), in slow motion
//   72   the picture fades to the stage (the next bit starts on the stage)
//   90   end
import { BAR, type BitTimeline } from '../../lib/grid';

const SLUG = 'rugby';
/** The length in frames (1.5 s, the most asked for). */
const LEN = 90;
/** The 16th grid of a 100 BPM / 60 fps bit (9 f). */
const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from) => {
    const at = (n: number) => Math.ceil((from + n) / S16) * S16;
    const cue: Record<string, number> = {
      start: at(0),
      fade: at(72),
      end: at(LEN),
    };
    return { cue, copy: [] };
  },
};

export default timeline;
