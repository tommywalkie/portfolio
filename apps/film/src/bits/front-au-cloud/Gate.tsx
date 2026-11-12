import React from 'react';
import { C } from '../../brand/tokens';
import { E, mix, prog } from '../../lib/anim';
import { T } from './Stack';
import { P3, pts } from './iso';

/** Frames: the cue getter and the absolute frame. */
export type GateProps = {
  F: number;
  c: (name: string) => number;
  seed: number;
};

// The scan's viewfinder: a square on the cloud floor (world units, half size) and its corner length.
const SQ = 176;
const CORNER = 54;
const FLOOR_Y = T + 1; // just above the cloud slab's top

type XZ = [number, number];

/** Keeps the part of a convex polygon where g >= 0 (one half-plane, Sutherland-Hodgman). */
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

// The beam's line is x + z = const: on screen that is a horizontal line, which moves from the back edge of
// the floor (top of the screen) to its front edge (bottom). `s` is that sum.
const sum = (p: XZ) => p[0] + p[1];
const onFloor = (poly: XZ[]): P3[] => poly.map(([x, z]) => [x, FLOOR_Y, z] as P3);

/**
 * The security scan, in the stack's own coordinates (over the cloud floor). A viewfinder with four corner
 * brackets frames the floor; an accent beam sweeps across it from the top of the screen to the bottom (eased),
 * and the part it has already read keeps a faint tint. Its result is the terminal window (Wireframes.tsx).
 */
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

