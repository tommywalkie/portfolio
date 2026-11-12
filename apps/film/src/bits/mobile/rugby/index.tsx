import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../../brand/tokens';
import { E, lmix, prog, rand } from '../../../lib/anim';
import { actOf, CUE, H, W } from '../../../timeline';
import type { SoundEvent } from '../../../sync';
import type { BitModule, BitProps } from '../../types';

const SLUG = 'rugby';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const PITCH_X = 720;
const HZ = 1220;
const BALL = 0.82;
const A = 230;
const B = 144;

const TURNS = 1.15;

const SAMPLES = 48;

const YAW = 24 * (Math.PI / 180);

const POINT = 1.55;

type P3 = { x: number; y: number; z: number };

const rho = (u: number) => B * Math.pow(Math.max(0, Math.sin(u)), POINT);

const yaw = (p: P3): P3 => ({ x: p.x * Math.cos(YAW) + p.z * Math.sin(YAW), y: p.y, z: -p.x * Math.sin(YAW) + p.z * Math.cos(YAW) });

const surf = (u: number, v: number): P3 => yaw({ x: A * Math.cos(u), y: rho(u) * Math.cos(v), z: rho(u) * Math.sin(v) });

const normal = (u: number, v: number): P3 => {
  const du = 1e-3;
  const drdx = (rho(u + du) - rho(u - du)) / (A * (Math.cos(u + du) - Math.cos(u - du)));
  return yaw({ x: -drdx, y: Math.cos(v), z: Math.sin(v) });
};
const visible = (u: number, v: number) => normal(u, v).z > 0;
const U0 = 0.004 * Math.PI;
const U1 = 0.996 * Math.PI;
const uAt = (i: number, n: number) => U0 + (i / n) * (U1 - U0);

const silhouette = (() => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= SAMPLES * 2; i++) {
    const u = uAt(i, SAMPLES * 2);

    const vs: number[] = [];
    let prev = normal(u, -Math.PI).z;
    for (let k = 1; k <= 72; k++) {
      const v = -Math.PI + (k / 72) * 2 * Math.PI;
      const cur = normal(u, v).z;
      if ((prev > 0) !== (cur > 0)) vs.push(v - Math.PI / 72);
      prev = cur;
    }
    if (vs.length < 2) continue;
    const a = surf(u, vs[0]);
    const b = surf(u, vs[1]);
    const [hi, lo] = a.y < b.y ? [a, b] : [b, a];
    top.push(`${hi.x.toFixed(1)},${hi.y.toFixed(1)}`);
    bottom.unshift(`${lo.x.toFixed(1)},${lo.y.toFixed(1)}`);
  }

  const t0 = yaw({ x: A, y: 0, z: 0 });
  const t1 = yaw({ x: -A, y: 0, z: 0 });
  return [`${t0.x.toFixed(1)},${t0.y.toFixed(1)}`, ...top, `${t1.x.toFixed(1)},${t1.y.toFixed(1)}`, ...bottom].join(' ');
})();

const visibleRuns = (pts: { u: number; v: number }[]) => {
  const runs: string[] = [];
  let cur: string[] = [];
  for (const q of pts) {
    if (visible(q.u, q.v)) {
      const p = surf(q.u, q.v);
      cur.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    } else if (cur.length) {
      runs.push(cur.join(' '));
      cur = [];
    }
  }
  if (cur.length) runs.push(cur.join(' '));
  return runs.filter((r) => r.includes(' '));
};

const Ball: React.FC<{ theta: number }> = ({ theta }) => {

  const seams = [0, 1, 2, 3].map((k) => {
    const v = theta + (k * Math.PI) / 2;
    return { k, v, runs: visibleRuns(Array.from({ length: SAMPLES + 1 }, (_, i) => ({ u: uAt(i, SAMPLES), v }))) };
  });

  const markV = theta + Math.PI / 4;
  const mark = visibleRuns(Array.from({ length: 13 }, (_, i) => ({ u: Math.PI * (0.4 + (i / 12) * 0.2), v: markV })));

  const rings = [0.26, 0.74].map((t) =>
    visibleRuns(Array.from({ length: 73 }, (_, k) => ({ u: t * Math.PI, v: (k / 72) * 2 * Math.PI }))),
  );

  return (
    <g>
      <defs>
        <clipPath id="rugby-ball">
          <polygon points={silhouette} />
        </clipPath>
      </defs>

      <polygon points={silhouette} fill={C.objSoft} />
      <g clipPath="url(#rugby-ball)">
        <ellipse cx={-A * 0.08} cy={-B * 0.2} rx={A * 0.98} ry={B * 0.92} fill={C.objText} />
        <ellipse cx={-A * 0.12} cy={-B * 0.34} rx={A * 0.84} ry={B * 0.66} fill={C.objBright} />
        <ellipse cx={-A * 0.2} cy={-B * 0.6} rx={A * 0.42} ry={B * 0.13} fill={C.objWhite} opacity={0.85} />

        {rings.map((runs, i) =>
          runs.map((r, j) => <polyline key={`${i}-${j}`} points={r} fill="none" stroke={C.accentDeep} strokeWidth={26} strokeLinejoin="round" opacity={0} />),
        )}

        {seams.map((s) => s.runs.map((r, j) => <polyline key={`${s.k}-${j}`} points={r} fill="none" stroke={C.objMute} strokeWidth={4} strokeLinecap="round" />))}

        {mark.map((r, j) => (
          <polyline key={j} points={r} fill="none" stroke={C.mid} strokeWidth={30} strokeLinecap="round" opacity={0} />
        ))}
      </g>
    </g>
  );
};

const Bit: React.FC<BitProps> = ({ seed }) => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const t = prog(F, K('start'), K('end'), E.linear);

  const bx = lmix(360, 700, t);
  const by = lmix(HZ - 400, HZ - 540, t) - 90 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1));
  const tiltDeg = -24 + 6 * t;
  const theta = TURNS * 2 * Math.PI * t;

  const drift = -50 * t;
  const zoom = lmix(1, 1.05, t);

  const crowd = Array.from({ length: 220 }, (_, i) => ({
    x: rand(`${SLUG}:${seed}:crowd-x:${i}`) * (W + 200) - 100,
    y: HZ - 320 + rand(`${SLUG}:${seed}:crowd-y:${i}`) * 300,
    r: 3 + rand(`${SLUG}:${seed}:crowd-r:${i}`) * 4,
  }));
  const fade = prog(F, K('fade'), K('end'), E.smooth);

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <filter id="rugby-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={3} stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
          </filter>

          <linearGradient id="rugby-pitch-grad" gradientUnits="userSpaceOnUse" x1={-PITCH_X} y1={0} x2={W + PITCH_X} y2={0}>
            <stop offset={0} stopColor={C.appHi} stopOpacity={0} />
            <stop offset={(PITCH_X - 80) / (W + 2 * PITCH_X)} stopColor={C.appHi} stopOpacity={1} />
            <stop offset={(PITCH_X + W + 80) / (W + 2 * PITCH_X)} stopColor={C.appHi} stopOpacity={1} />
            <stop offset={1} stopColor={C.appHi} stopOpacity={0} />
          </linearGradient>
          <mask id="rugby-pitch-fade" maskUnits="userSpaceOnUse" x={-PITCH_X} y={0} width={W + 2 * PITCH_X} height={H}>
            <rect x={-PITCH_X} y={0} width={W + 2 * PITCH_X} height={H} fill="url(#rugby-pitch-grad)" />
          </mask>
        </defs>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${zoom.toFixed(4)}) translate(${-W / 2} ${-H / 2})`}>
          <g transform={`translate(${drift.toFixed(2)} 0)`}>

            <rect x={-200} y={0} width={W + 400} height={HZ} fill={C.stage} />
            {crowd.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={C.objSoft} opacity={0} />
            ))}

            <g mask="url(#rugby-pitch-fade)">
              <rect x={-PITCH_X} y={HZ} width={W + 2 * PITCH_X} height={H - HZ} fill={C.objDeep} />
              {Array.from({ length: Math.ceil((W + 2 * PITCH_X) / 200) }, (_, i) => (
                <rect key={i} x={-PITCH_X + i * 200} y={HZ} width={100} height={H - HZ} fill={C.mid} opacity={0.45} />
              ))}
            </g>

            <rect x={820} y={HZ - 300} width={9} height={340} fill={C.bright} />
            <rect x={960} y={HZ - 300} width={9} height={340} fill={C.bright} />
            <rect x={820} y={HZ - 110} width={149} height={9} fill={C.bright} />

            <rect x={150} y={HZ - 200} width={8} height={240} fill={C.bright} />
            <path d={`M158 ${HZ - 200} L260 ${HZ - 180} L250 ${HZ - 128} L158 ${HZ - 142} Z`} fill={C.pendingRed} />
          </g>

          <ellipse cx={bx + 24} cy={HZ + 300} rx={A * BALL * 0.8} ry={22} fill={C.objStage} opacity={0.35 - 0.12 * Math.sin(Math.PI * t)} />

          <g transform={`translate(${bx.toFixed(2)} ${by.toFixed(2)}) rotate(${tiltDeg.toFixed(2)}) scale(${BALL})`}>
            <Ball theta={theta} />
          </g>
        </g>

        <rect x={-PITCH_X} y={HZ} width={W + 2 * PITCH_X} height={H - HZ} filter="url(#rugby-grain)" opacity={0.09} mask="url(#rugby-pitch-fade)" />

        <rect x={0} y={0} width={W} height={H} fill={C.stage} opacity={fade * 0} />
      </svg>
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;

  return [];
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
