import React from 'react';
import { C } from '../../../brand/tokens';
import { E, mix, prog } from '../../../lib/anim';
import { T } from './Stack';
import { P3, pts } from './iso';

export type GateProps = {
  F: number;
  c: (name: string) => number;
  seed: number;
};

const SQ = 176;
const CORNER = 54;
const FLOOR_Y = T + 1;

type XZ = [number, number];

const cut = (poly: XZ[], g: (p: XZ) => number): XZ[] => {
  const out: XZ[] = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length];
    const gp = g(p);
    const gq = g(q);
    if (gp >= 0) out.push(p);
    if (gp >= 0 !== gq >= 0) {
      const t = gp / (gp - gq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  });
  return out;
};

const SQUARE: XZ[] = [
  [-SQ, -SQ],
  [SQ, -SQ],
  [SQ, SQ],
  [-SQ, SQ],
];

const sum = (p: XZ) => p[0] + p[1];
const onFloor = (poly: XZ[]): P3[] => poly.map(([x, z]) => [x, FLOOR_Y, z] as P3);

export const Scan: React.FC<GateProps> = ({ F, c }) => {
  const frame = prog(F, c('scanIn'), c('scanIn') + 14, E.out) * (1 - prog(F, c('scanOut'), c('scanOut') + 18, E.smooth));
  const sweep = prog(F, c('scan'), c('scanEnd'), E.inOut);
  const pos = mix(-2 * SQ, 2 * SQ, sweep);
  const lit = prog(F, c('scan'), c('scan') + 6, E.smooth) * (1 - prog(F, c('scanEnd') - 6, c('scanEnd'), E.smooth));
  const corners: [number, number][] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  const band = (w: number) => cut(cut(SQUARE, (p) => sum(p) - (pos - w)), (p) => pos + w - sum(p));
  const trail = cut(SQUARE, (p) => pos - sum(p));
  return (
    <g opacity={frame}>
      <polygon points={pts(onFloor(trail))} fill={C.accent} opacity={0.2 * lit} />
      {corners.map(([sx, sz], i) => {
        const x = sx * SQ;
        const z = sz * SQ;
        const leg: P3[] = [
          [x - sx * CORNER, FLOOR_Y, z],
          [x, FLOOR_Y, z],
          [x, FLOOR_Y, z - sz * CORNER],
        ];
        return <polyline key={i} points={pts(leg)} fill="none" stroke={C.accent} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {band(26).length > 2 && <polygon points={pts(onFloor(band(26)))} fill={C.accent} opacity={0.25 * lit} />}
      {band(9).length > 2 && <polygon points={pts(onFloor(band(9)))} fill={C.accent} opacity={lit} />}
    </g>
  );
};
