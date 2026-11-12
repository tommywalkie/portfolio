import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Mark } from './brand/Mark';
import { C, U } from './brand/tokens';
import { ToolChip } from './bits/_shared/ui/ToolChip';
import { TOOLS } from './data/tools';

// Style frames: the site's logo on the dark stage, at full size and at working sizes.

export const MarkStill: React.FC<{ size: number }> = ({ size }) => (
  <AbsoluteFill style={{ background: C.stage, alignItems: 'center', justifyContent: 'center' }}>
    <Mark size={size} />
  </AbsoluteFill>
);

/** Every tool chip from src/data/tools.ts, sorted by score: check that each logo reads. */
export const ToolSheet: React.FC = () => (
  <AbsoluteFill style={{ background: C.stage, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: 18, padding: 40 }}>
    {[...TOOLS].sort((a, b) => b.score - a.score).map((t) => (
      <ToolChip key={t.id} tool={t} size={56} />
    ))}
  </AbsoluteFill>
);

const SIZES = [16, 24, 32, 48, 64, 128, 256];

export const MarkSizes: React.FC = () => (
  <AbsoluteFill style={{ background: C.stage, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 64 * U }}>
    {SIZES.map((s) => (
      <Mark key={s} size={s * U} />
    ))}
  </AbsoluteFill>
);
