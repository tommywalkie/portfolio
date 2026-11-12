// What every polyvalence variant shares: cue access, the tool list, the core tools, the line.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Chain } from '../../fx/Chain';
import { actOf, CUE } from '../../timeline';

export const SLUG = 'polyvalence';

/** A cue of this bit, absolute frame. */
export const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

/** The current frame, local and absolute (cues are absolute). */
export const useFrames = () => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  return { f, F: f + act.from, from: act.from };
};

/** The line, placed the same way in every variant: lower third, centred, display role. */
export const Line: React.FC<{ f: number; from: number; top?: number }> = ({ f, from, top = 820 }) => (
  <Chain chain={`${SLUG}.titre`} frame={f} from={from} role="display" size={88} top={top} />
);
