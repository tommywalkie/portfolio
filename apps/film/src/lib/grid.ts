// The grid every story bit is timed on: frame rate, tempo, bars, and the copy helpers.
// Pure TypeScript (no React, no CSS) so Node scripts and every bit's timeline can import it
// without pulling in the master timeline (which imports the bits: that would be a cycle).
import { holdFor, PACE, revealFor, wordCount, type PaceName } from './pace';
import type { Locale } from './locale';
import { MOBILE } from './device';

export const FPS = 60;
export const BPM = 100;
export const W = MOBILE ? 1080 : 1920;
export const H = MOBILE ? 1920 : 1080;
/** calm: fragments take turns with the picture, held about 1-1.5 s. */
export const PACE_NAME: PaceName = 'calm';

/** Frames per beat (36 at 100 BPM / 60 fps). */
export const BEAT = (60 / BPM) * FPS;
export const BAR = BEAT * 4;
/** Absolute frame of a grid position: bar is 1-based, beat 0-3, sub = 16ths within the beat. */
export const b = (bar: number, beat = 0, sub = 0) => Math.round(((bar - 1) * 4 + beat) * BEAT + sub * (BEAT / 4));
/** A choreography length written in 60 fps frames, converted to this film's fps. */
export const f60 = (frames: number) => Math.round((frames * FPS) / 60);
/** After the last bar the picture holds while the audio decays. */
export const TAIL = FPS;

export type Copy = {
  id: string;
  text: string; // exactly what is on screen (\n separates lines)
  in: number; // first frame any of it is visible
  resolved: number; // first frame it is fully readable
  out: number; // first frame it starts to leave
  kind?: 'copy' | 'ui'; // 'ui': a string the product shows (app labels, names in a UI); not budgeted
  chain?: string;
  mode?: 'build' | 'replace';
};

const pace = PACE[PACE_NAME];

/**
 * The timing of every copy entry is written from the French text (the film's timing, the same for
 * both locales). `display`, when given, is the text the locale shows: same id, same frames.
 */
/** One line of copy revealed word by word at this film's pace. */
export const line = (id: string, text: string, inF: number, out?: number, display?: string): Copy => {
  const n = wordCount(text);
  const resolved = inF + f60(revealFor(n, pace));
  return { id, text: display ?? text, in: inF, resolved, out: out ?? resolved + f60(holdFor(n, pace)) };
};

/** A fragment of a chain: its timing text (French), its in frame, and the text the locale shows. */
export type Fragment = [text: string, inF: number, display?: string];

/** One thought as a chain of fragments (`<id>.1`, `<id>.2`, ...), rendered by fx/Chain. */
export const chain = (id: string, mode: 'build' | 'replace', fragments: Fragment[], o: { out?: number } = {}): Copy[] => {
  const base = fragments.map(([text, inF, display], i) => ({
    timing: wordCount(text),
    c: { id: `${id}.${i + 1}`, text: display ?? text, in: inF, resolved: inF + f60(revealFor(wordCount(text), pace)), chain: id, mode } as Copy,
  }));
  const last = base[base.length - 1];
  if (!last) throw new Error(`grid: chain "${id}" has no fragments`);
  if (mode === 'build') {
    const words = base.reduce((n, x) => n + x.timing, 0);
    const out = o.out ?? last.c.resolved + f60(holdFor(words, pace));
    return base.map((x) => ({ ...x.c, out }));
  }
  const leave = f60(pace.exitDur) + f60(6);
  return base.map((x, i) => ({ ...x.c, out: base[i + 1] ? base[i + 1].c.in - leave : (o.out ?? x.c.resolved + f60(holdFor(x.timing, pace))) }));
};

/**
 * A story bit's clock. Bits are written in their own bars (bar 1 = the bit's first downbeat);
 * `at` turns that into absolute film frames, so the bit can sit anywhere in the film.
 */
export const bitClock = (from: number) => ({
  at: (bar: number, beat = 0, sub = 0) => from + b(bar, beat, sub),
  from,
});

/** What a story bit's timeline returns: its cues and copy in absolute frames. Ids are prefixed by the master. */
type BitTiming = {
  cue: Record<string, number>;
  copy: Copy[];
};

/**
 * A story bit's timeline module: its slug, its length in bars, and its timing for a given start frame.
 * `locale` picks the text the copy shows; the cues and the copy frames are the same for every locale.
 */
export type BitTimeline = {
  slug: string;
  bars: number;
  build: (from: number, locale?: Locale) => BitTiming;
};
