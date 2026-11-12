// polyvalence: the tools as a scattered cloud of logo tags, React and Node.js at the heart.
// 2 bars (4.8 s at 100 BPM). Shared by every variant (variant-a..f.tsx): same cue names, same copy,
// each variant choreographs the cloud its own way between them.
//   bar 1  the cloud appears (low-score tools first, scattered), filling by beat 3
//   bar 1 beat 3  the line rises (126 f), read from its resolve (184 f) to the end
//   bar 2  React and Node.js come forward (core), the rest settles (settle), the cloud is calm (calm)
//          and holds (hold1, hold2): nothing new starts while the line is read
//   end    at bar 3 (288 f): the bit's last frame
import { bitClock, chain, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'polyvalence';

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 2,
  build: (from, locale = DEFAULT_LOCALE) => {
    const { at } = bitClock(from);
    const cue = {
      open: at(1), // frame 0 already composed and moving: the first tags are on screen
      wave: at(1, 1), // the cloud fills, wave after wave
      cloud: at(1, 2), // every tag is in
      gather: at(1, 3), // the cloud starts to make room for the core
      title: at(1, 3, 2), // the line rises (before the picture's last cues: its read holds the rest)
      core: at(1, 3, 3), // React and Node.js come forward / to the viewer: the hero move of the bit
      settle: at(2), // everything else settles around and behind them
      calm: at(2, 0, 1), // the cloud is calm: only slow drift from here
      hold1: at(2, 0, 2), // drift keeps the hold alive
      hold2: at(2, 0, 3),
      end: at(3),
    };
    const copy = [...chain(`${SLUG}.titre`, 'build', [[STR.fr.TITLE, cue.title, STR[locale].TITLE]], { out: cue.end })];
    return { cue, copy };
  },
};

export default timeline;
