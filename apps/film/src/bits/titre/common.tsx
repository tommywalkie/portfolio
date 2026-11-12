// What every titre variant shares: the bit's slug, its cues (absolute frames) and the current frame.
// The copy and the timing of the film are in timeline.ts and copy.ts; each variant draws them its own way.
import { useCurrentFrame } from 'remotion';
import { actOf, CUE } from '../../timeline';

export const SLUG = 'titre';

/** A cue of this bit, absolute frame. */
export const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

/** The current frame as an absolute frame (every cue is absolute). */
export const useFrames = () => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  return { f, F: f + act.from };
};
