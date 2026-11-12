import React from 'react';
import { C } from '../../../brand/tokens';
import { E, prog, rand } from '../../../lib/anim';
import { mixColor } from '../../../lib/color';
import { H, W } from '../../../timeline';

const SLUG = 'olympiades';

type V3 = [number, number, number];
type Face = { pts: V3[]; n: V3; lo: string; hi: string; alpha: number; ring?: boolean; width?: number };
type Part = { from: number; faces: Face[] };

export type DispenserTimes = {
  base: number;
  column: number;
  dome: number;
  pods: number;
  tray: number;
  chute: number;
  turns: number[];
  drops: number[];
};

const DEG = Math.PI / 180;
const COS30 = Math.cos(Math.PI / 6);

const DROP = 240;

const FINS = 8;

const FIN_STEP = 3;

const SEG = 40;

const PILL = 10;
const PILL_L = 22;

const HOLE_R = 72;

const FLOOR_Y = 120;
const REST_Y = FLOOR_Y + PILL + 1;

const SLOT: V3 = [134, 72 + PILL, 0];
const SLOTS: V3[] = [
  [168, 72 + PILL, -26],
  [210, 72 + PILL, -22],
  [172, 72 + PILL, 14],
  [214, 72 + PILL, 18],
];

const TRAY_ANG = [18, -24, 52, -6];
const TURN = 45 * DEG;

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

const rotY = (p: V3, a: number): V3 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

const LIGHT = norm([0.35, 0.9, 0.55]);

const quad = (a: V3, b: V3, c: V3, d: V3, n: V3, lo: string, hi: string, alpha = 1): Face => ({ pts: [a, b, c, d], n, lo, hi, alpha });

const loop = (pts: V3[], colour: string, alpha: number, width: number): Face => ({ pts, n: [0, 1, 0], lo: colour, hi: colour, alpha, ring: true, width });

const circle = (r: number, y: number, colour: string, alpha: number, width: number): Face =>
  loop(
    Array.from({ length: SEG }, (_, k): V3 => [r * Math.cos((k / SEG) * Math.PI * 2), y, r * Math.sin((k / SEG) * Math.PI * 2)]),
    colour,
    alpha,
    width,
  );

const frustum = (r0: number, r1: number, y0: number, y1: number, lo: string, hi: string, alpha = 1, rim?: string, cap = true): Face[] => {
  const faces: Face[] = [];
  const h = y1 - y0;
  const ny = (r0 - r1) / h;
  for (let k = 0; k < SEG; k++) {
    const a0 = (k / SEG) * Math.PI * 2;
    const a1 = ((k + 1) / SEG) * Math.PI * 2;
    const m = (a0 + a1) / 2;
    faces.push(
      quad(
        [r0 * Math.cos(a0), y0, r0 * Math.sin(a0)],
        [r0 * Math.cos(a1), y0, r0 * Math.sin(a1)],
        [r1 * Math.cos(a1), y1, r1 * Math.sin(a1)],
        [r1 * Math.cos(a0), y1, r1 * Math.sin(a0)],
        norm([Math.cos(m), ny, Math.sin(m)]),
        lo,
        hi,
        alpha,
      ),
    );
  }
  if (cap) {
    const top: V3[] = [];
    for (let k = 0; k < SEG; k++) {
      const a = (k / SEG) * Math.PI * 2;
      top.push([r1 * Math.cos(a), y1, r1 * Math.sin(a)]);
    }
    faces.push({ pts: top, n: [0, 1, 0], lo, hi, alpha });
  }
  if (rim) {
    faces.push(circle(r1, y1, rim, 0.9, 3.2));
    faces.push(circle(r0, y0, rim, 0.6, 1.8));
  }
  return faces;
};

const box = (w: number, d: number, h: number, yaw: number, cx: number, y0: number, cz: number, lo: string, hi: string, alpha = 1): Face[] => {
  const hx = w / 2;
  const hz = d / 2;
  const T = (p: V3): V3 => {
    const q = rotY(p, yaw);
    return [q[0] + cx, q[1] + y0, q[2] + cz];
  };
  const N = (n: V3): V3 => rotY(n, yaw);
  return [
    quad(T([-hx, h, -hz]), T([hx, h, -hz]), T([hx, h, hz]), T([-hx, h, hz]), N([0, 1, 0]), lo, hi, alpha),
    quad(T([hx, 0, -hz]), T([hx, 0, hz]), T([hx, h, hz]), T([hx, h, -hz]), N([1, 0, 0]), lo, hi, alpha),
    quad(T([-hx, 0, -hz]), T([-hx, 0, hz]), T([-hx, h, hz]), T([-hx, h, -hz]), N([-1, 0, 0]), lo, hi, alpha),
    quad(T([-hx, 0, hz]), T([hx, 0, hz]), T([hx, h, hz]), T([-hx, h, hz]), N([0, 0, 1]), lo, hi, alpha),
    quad(T([-hx, 0, -hz]), T([hx, 0, -hz]), T([hx, h, -hz]), T([-hx, h, -hz]), N([0, 0, -1]), lo, hi, alpha),
  ];
};

const parts = (spin: number, T: DispenserTimes): Part[] => {
  const out: Part[] = [

    { from: T.base, faces: frustum(130, 130, 0, 120, C.objDeep, C.objSoft) },
    { from: T.base, faces: frustum(133, 133, 100, 106, C.objMute, C.objBright) },

    {
      from: T.base,
      faces: [
        {
          pts: Array.from({ length: SEG }, (_, k): V3 => [HOLE_R + 15 * Math.cos((k / SEG) * Math.PI * 2), FLOOR_Y + 0.6, 15 * Math.sin((k / SEG) * Math.PI * 2)]),
          n: [0, 1, 0],
          lo: C.objStage,
          hi: C.objStage,
          alpha: 1,
        },
      ],
    },

    { from: T.chute, faces: [quad([130.6, 72, -17], [130.6, 72, 17], [130.6, 96, 17], [130.6, 96, -17], [1, 0, 0], C.objStage, C.objStage)] },

    { from: T.column, faces: [...frustum(22, 22, 120, 236, C.mid, C.objSoft), ...frustum(30, 30, 236, 246, C.accentDeep, C.accent)] },

    { from: T.dome, faces: frustum(115, 115, 122, 228, C.objMute, C.objBright, 0.2, C.objBright, false) },

    {
      from: T.tray,
      faces: [
        ...box(155, 124, 12, 0, 187.5, 60, 0, C.mid, C.objSoft),
        ...box(6, 124, 34, 0, 262, 60, 0, C.mid, C.objSoft),
        ...box(155, 6, 34, 0, 187.5, 60, 59, C.mid, C.objSoft),
        ...box(155, 6, 34, 0, 187.5, 60, -59, C.mid, C.objSoft),
      ],
    },
  ];

  for (let i = 0; i < FINS; i++) {
    const phi = spin + (i * Math.PI * 2) / FINS;
    out.push({ from: T.pods + i * FIN_STEP, faces: box(110, 5, 100, -phi, 55 * Math.cos(phi), 122, 55 * Math.sin(phi), C.objMute, C.objBright, 0.45) });
  }

  for (let i = 0; i < 8; i++) {
    const phi = spin + (i * Math.PI * 2) / 8;
    out.push({ from: T.column, faces: box(9, 8, 10, -phi, 34 * Math.cos(phi), 236, 34 * Math.sin(phi), C.accentDeep, C.accent) });
  }
  return out;
};

const project = (p: V3): [number, number] => [(p[0] - p[2]) * COS30, (p[0] + p[2]) * 0.5 - p[1]];

export type DispenserProps = {
  F: number;
  T: DispenserTimes;
  seed: number;
  cx: number;
  cy: number;
  s: number;
  bob?: number;
};

export const Dispenser: React.FC<DispenserProps> = ({ F, T, seed, cx, cy, s, bob = 0 }) => {

  const yaw = -28 * DEG + (rand(`${SLUG}:${seed}:yaw`) - 0.5) * 6 * DEG + Math.sin((F / 324) * Math.PI * 2) * 3 * DEG;

  const spin0 = -TURN / 2 + Math.floor(rand(`${SLUG}:${seed}:spin`) * FINS) * TURN;
  const spinAt = (f: number) => spin0 + T.turns.reduce((acc, t) => acc + TURN * prog(f, t, t + 24, E.inOut), 0);
  const spin = spinAt(F);

  const overHole = (f: number) => ((Math.round(-spinAt(f) / TURN - 0.5) % FINS) + FINS) % FINS;

  const emptyAt: number[] = Array(FINS).fill(Infinity);
  emptyAt[overHole(0)] = -Infinity;
  T.drops.forEach((d) => {
    emptyAt[overHole(d)] = d;
  });

  type Item = { depth: number; kind: 'poly' | 'ring' | 'pill'; pts?: string; fill: string; op: number; width: number; cx?: number; cy?: number; r?: number; ang?: number };
  const items: Item[] = [];

  for (const part of parts(spin, T)) {
    const dy = (1 - prog(F, part.from, part.from + 36, E.out)) * DROP;
    const a = prog(F, part.from, part.from + 24, E.smooth);
    if (a < 0.01) continue;
    for (const face of part.faces) {
      const n = rotY(face.n, yaw);
      if (!face.ring && n[0] + n[1] + n[2] <= 0) continue;
      const w = face.pts.map((p) => rotY([p[0], p[1] + dy, p[2]], yaw));
      const depth = w.reduce((acc, p) => acc + p[0] + p[1] + p[2], 0) / w.length;
      const nn = norm(n);
      const t = Math.min(1, Math.max(0, 0.4 + 0.6 * (nn[0] * LIGHT[0] + nn[1] * LIGHT[1] + nn[2] * LIGHT[2])));
      const pts = w
        .map(project)
        .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
        .join(' ');
      items.push({ depth, kind: face.ring ? 'ring' : 'poly', pts, fill: mixColor(face.lo, face.hi, t), op: a * face.alpha, width: face.width ?? 2.2 });
    }
  }

  const pushPill = (pos: V3, ang: number, op = 1, onTop = false) => {
    const q = rotY(pos, yaw);
    const [x, y] = project(q);
    items.push({ depth: onTop ? 1e6 + q[0] + q[1] + q[2] : q[0] + q[1] + q[2], kind: 'pill', fill: C.accent, op, width: 0, cx: x, cy: y, r: PILL, ang });
  };
  const drumIn = prog(F, T.pods + FINS * FIN_STEP, T.pods + FINS * FIN_STEP + 18, E.smooth);

  for (let i = 0; i < FINS; i++) {
    if (F >= emptyAt[i]) continue;
    const phi = spin + (i + 0.5) * TURN;
    pushPill([HOLE_R * Math.cos(phi), REST_Y, HOLE_R * Math.sin(phi)], -30 + i * 23, drumIn);
  }

  T.drops.forEach((d, k) => {
    if (F < d) return;
    const fall = prog(F, d, d + 9, E.in);
    if (fall < 1) {
      pushPill([HOLE_R, REST_Y - fall * (PILL * 2 + 6), 0], -30, 1 - fall * 0.6);
      return;
    }
    const out = prog(F, d + 14, d + 32, E.out);
    if (F < d + 14) return;
    const to = SLOTS[k];
    pushPill([SLOT[0] + (to[0] - SLOT[0]) * out, to[1], SLOT[2] + (to[2] - SLOT[2]) * out], TRAY_ANG[k] * out, 1, true);
  });

  items.sort((p, q) => p.depth - q.depth);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <g transform={`translate(${cx.toFixed(2)} ${(cy + bob).toFixed(2)}) scale(${s})`}>
        {items.map((it, i) => {
          if (it.kind === 'pill') {

            const r = PILL;
            const h = PILL_L;
            return (
              <g key={i} opacity={it.op} transform={`translate(${(it.cx ?? 0).toFixed(2)} ${(it.cy ?? 0).toFixed(2)}) rotate(${(it.ang ?? 0).toFixed(2)})`}>
                <path d={`M0 ${-r} H${-h + r} A${r} ${r} 0 0 0 ${-h + r} ${r} H0 Z`} fill={C.accent} />
                <path d={`M0 ${-r} H${h - r} A${r} ${r} 0 0 1 ${h - r} ${r} H0 Z`} fill={C.objWhite} />
                <rect x={-h} y={-r} width={h * 2} height={r * 2} rx={r} fill="none" stroke={C.accentDeep} strokeWidth={1.4} />
                <rect x={-h + 4} y={-r + 2.5} width={h * 2 - 8} height={2.6} rx={1.3} fill={C.objWhite} opacity={0.6} />
              </g>
            );
          }
          if (it.kind === 'ring') {
            return <polygon key={i} points={it.pts} fill="none" stroke={it.fill} strokeWidth={it.width} strokeLinejoin="round" opacity={it.op} />;
          }
          return <polygon key={i} points={it.pts} fill={it.fill} stroke={it.fill} strokeWidth={0.6} strokeLinejoin="round" opacity={it.op} />;
        })}
      </g>
    </svg>
  );
};
