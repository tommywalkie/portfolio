import { clamp, E, Ease, pace } from '../lib/anim';
import { f60, FPS } from '../timeline';

export type TypeTiming = {
  start: number; // typing begins; the first character shows on the next whole frame
  dur?: number; // time box in frames (default pace.fx.typeFPerChar per character at 60 fps: calm 3 f = 20 chars/s, crisp 2 f = 30)
  ease?: Ease; // the character count's progress over the box (default E.type: fast start, slow end)
  cps?: number; // linear typing at this many characters per second instead (overrides dur and ease)
};

const boxOf = (len: number, t: TypeTiming) => (t.cps ? (len * FPS) / t.cps : Math.max(1, t.dur ?? f60(pace.fx.typeFPerChar * len)));

/** Characters typed at frame f, continuous (0..len). */
const typedAt = (len: number, f: number, t: TypeTiming) =>
  t.cps ? clamp(((f - t.start) * t.cps) / FPS, 0, len) : len * (t.ease ?? E.type)(clamp((f - t.start) / boxOf(len, t)));

/**
 * Whole frame on which each character of a `len`-character string first shows. The component reads
 * the same schedule, so key sounds put on these frames land on the picture exactly:
 * KEY_FRAMES = typeFrames(PROMPT.length, TYPE_T).map((k) => k + ACT.proof.from).
 */
export const typeFrames = (len: number, t: TypeTiming): number[] => {
  const at: number[] = [];
  const end = Math.ceil(t.start + boxOf(len, t)) + 1;
  for (let F = Math.ceil(t.start); F <= end && at.length < len; F++) {
    const n = Math.min(len, Math.ceil(typedAt(len, F, t) - 1e-6));
    while (at.length < n) at.push(F);
  }
  while (at.length < len) at.push(end);
  return at;
};
