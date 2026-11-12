import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Chain } from '../../../fx/Chain';
import { useStrings } from '../../../lib/i18n';
import { actOf, CUE, W } from '../../../timeline';
import { headlineSize } from '../layout';
import { STR } from './copy';

export const SLUG = 'polyvalence';

export const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

export const useFrames = () => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  return { f, F: f + act.from, from: act.from };
};

export const Line: React.FC<{ f: number; from: number; top: number }> = ({ f, from, top }) => {
  const S = useStrings(STR);
  const size = headlineSize(S.TITLE);
  return <Chain chain={`${SLUG}.titre`} frame={f} from={from} role="display" size={size} x={W / 2} top={top} align="center" />;
};
