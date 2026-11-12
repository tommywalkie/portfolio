import { useCurrentFrame } from 'remotion';
import { actOf, CUE } from '../../../timeline';

export const SLUG = 'titre';

export const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

export const useFrames = () => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  return { f, F: f + act.from };
};
