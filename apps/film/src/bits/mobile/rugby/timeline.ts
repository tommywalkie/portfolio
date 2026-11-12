import { BAR, type BitTimeline } from '../../../lib/grid';

const SLUG = 'rugby';

const LEN = 90;

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
