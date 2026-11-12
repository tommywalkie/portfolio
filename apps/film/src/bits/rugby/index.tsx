import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../brand/tokens';
import { E, lmix, prog, rand } from '../../lib/anim';
import { actOf, CUE, H, W } from '../../timeline';
import type { SoundEvent } from '../../sync';
import type { BitModule, BitProps } from '../types';

const SLUG = 'rugby';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// A spiral pass in slow motion, in a flat illustration style (the reference: solid shapes, paper grain, no
// outlines, shading as flat bands). The ball is a prolate spheroid seen from the side: half-length A, half-width B
// (a real ball is about 1.6 times longer than wide). It spins on its long axis (THETA) while it travels on a gentle
// arc, nose up like a pass. The panel seams and the laces turn with the spin; the printed bands stay put.
/** How far the pitch runs past each side of the frame (for the slide in and out), px. */
const PITCH_X = 720;
const A = 230;
const B = 144;
/** Turns of the spiral over the bit (slow motion: barely more than one). */
const TURNS = 1.15;
/** Seam curves and lace stitches are sampled along the ball's length (u from 0 to pi). */
const SAMPLES = 48;

/** The ball's long axis turns this far into depth (a 3/4 view), so the bands read as rings and the seams curve. */
const YAW = 24 * (Math.PI / 180);
/** Profile exponent: above 1 the tips are pointed like a real ball (1 would be a plain ellipsoid). */
const POINT = 1.55;

type P3 = { x: number; y: number; z: number };
/** Radius of the ball at u (0..pi along the long axis). */
const rho = (u: number) => B * Math.pow(Math.max(0, Math.sin(u)), POINT);
/** Turn into the 3/4 view (about the vertical axis). */
const yaw = (p: P3): P3 => ({ x: p.x * Math.cos(YAW) + p.z * Math.sin(YAW), y: p.y, z: -p.x * Math.sin(YAW) + p.z * Math.cos(YAW) });
/** A surface point at (u along the length, v around the long axis), already in the 3/4 view. */
const surf = (u: number, v: number): P3 => yaw({ x: A * Math.cos(u), y: rho(u) * Math.cos(v), z: rho(u) * Math.sin(v) });
/** The surface normal there (unnormalised), in the 3/4 view: its z > 0 means the point faces the camera. */
const normal = (u: number, v: number): P3 => {
  const du = 1e-3;
  const drdx = (rho(u + du) - rho(u - du)) / (A * (Math.cos(u + du) - Math.cos(u - du)));
  return yaw({ x: -drdx, y: Math.cos(v), z: Math.sin(v) });
};
const visible = (u: number, v: number) => normal(u, v).z > 0;
const U0 = 0.004 * Math.PI;
const U1 = 0.996 * Math.PI;
const uAt = (i: number, n: number) => U0 + (i / n) * (U1 - U0);

/** The silhouette: for each u, the two points where the surface turns away from the camera. */
const silhouette = (() => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= SAMPLES * 2; i++) {
    const u = uAt(i, SAMPLES * 2);
    // the rim: scan v for the sign changes of the normal's z
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
  // close on the two tips
  const t0 = yaw({ x: A, y: 0, z: 0 });
  const t1 = yaw({ x: -A, y: 0, z: 0 });
  return [`${t0.x.toFixed(1)},${t0.y.toFixed(1)}`, ...top, `${t1.x.toFixed(1)},${t1.y.toFixed(1)}`, ...bottom].join(' ');
})();

/** A curve on the surface, split into the runs that face the camera. */
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
  // the 4 panel seams, a quarter turn apart, turning with the spin; the first one carries the laces
  const seams = [0, 1, 2, 3].map((k) => {
    const v = theta + (k * Math.PI) / 2;
    return { k, v, runs: visibleRuns(Array.from({ length: SAMPLES + 1 }, (_, i) => ({ u: uAt(i, SAMPLES), v }))) };
  });
  // a printed mark in the middle of one panel (a real rugby ball has no laces): it shows the spin as it rolls round
  const markV = theta + Math.PI / 4;
  const mark = visibleRuns(Array.from({ length: 13 }, (_, i) => ({ u: Math.PI * (0.4 + (i / 12) * 0.2), v: markV })));
  // the printed bands: two rings around the ball, a quarter of the length from each tip (fixed under the spin)
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
      {/* flat shading: the shadow side, the lit body, a highlight band (light from the upper left) */}
      <polygon points={silhouette} fill={C.objSoft} />
      <g clipPath="url(#rugby-ball)">
        <ellipse cx={-A * 0.08} cy={-B * 0.2} rx={A * 0.98} ry={B * 0.92} fill={C.objText} />
        <ellipse cx={-A * 0.12} cy={-B * 0.34} rx={A * 0.84} ry={B * 0.66} fill={C.objBright} />
        <ellipse cx={-A * 0.2} cy={-B * 0.6} rx={A * 0.42} ry={B * 0.13} fill={C.objWhite} opacity={0.85} />
        {/* the printed bands, accent green */}
        {rings.map((runs, i) =>
          runs.map((r, j) => <polyline key={`${i}-${j}`} points={r} fill="none" stroke={C.accentDeep} strokeWidth={26} strokeLinejoin="round" opacity={0} />),
        )}
        {/* the panel seams */}
        {seams.map((s) => s.runs.map((r, j) => <polyline key={`${s.k}-${j}`} points={r} fill="none" stroke={C.objMute} strokeWidth={4} strokeLinecap="round" />))}
        {/* the printed mark on one panel */}
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
  const F = f + act.from; // absolute frame: every cue is absolute
  const t = prog(F, K('start'), K('end'), E.linear);

  // the flight: a slow, gentle arc from the left to the right, nose up (a pass seen in slow motion)
  const bx = lmix(640, 1290, t);
  const by = 560 - 120 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1));
  const tiltDeg = -16 + 6 * t;
  const theta = TURNS * 2 * Math.PI * t;
  // the camera follows the ball a little: the background drifts left, a slow push-in
  const drift = -90 * t;
  const zoom = lmix(1, 1.05, t);

  // the background, after the reference: sky, a stand with a speckled crowd, a striped pitch, posts and a corner flag
  const crowd = Array.from({ length: 220 }, (_, i) => ({
    x: rand(`${SLUG}:${seed}:crowd-x:${i}`) * (W + 200) - 100,
    y: 300 + rand(`${SLUG}:${seed}:crowd-y:${i}`) * 300,
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
          {/* the pitch's slopes: transparent at its far ends, fully opaque over the frame and a bit beyond.
              The mask reads luminance, not colour, so it holds the pinned appHi: the chrome `white` inverts with
              the theme, and on the light stage a dark stop would mask the pitch away. */}
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
            {/* sky and stand: the film's page, so the slide is dark on a dark stage and white on a light one */}
            {/* The same background as every other slide (C.stage), not the lighter ink2 / ink3 */}
            <rect x={-200} y={0} width={W + 400} height={620} fill={C.stage} />
            {crowd.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={C.objSoft} opacity={0} />
            ))}
            {/* the pitch: mowing stripes in two greens */}
            {/* The pitch runs a screen wider on each side (past the frame), so the slide in from the right and
                out to the left keeps the ground under the whole frame */}
            {/* No hard edge at the pitch's ends: it fades out on a long slope on each side */}
            <g mask="url(#rugby-pitch-fade)">
              <rect x={-PITCH_X} y={620} width={W + 2 * PITCH_X} height={H - 620} fill={C.objDeep} />
              {Array.from({ length: Math.ceil((W + 2 * PITCH_X) / 280) }, (_, i) => (
                <rect key={i} x={-PITCH_X + i * 280} y={620} width={140} height={H - 620} fill={C.mid} opacity={0.45} />
              ))}
            </g>
            {/* the posts, far right: the site's brightest type, so they are pale on the dark sky and dark on the
                light one (C.bright inverts with the page; pinned here they would vanish against a white sky) */}
            <rect x={1580} y={330} width={10} height={330} fill={C.bright} />
            <rect x={1760} y={330} width={10} height={330} fill={C.bright} />
            <rect x={1580} y={540} width={190} height={10} fill={C.bright} />
            {/* the corner flag, far left */}
            <rect x={200} y={420} width={8} height={240} fill={C.bright} />
            <path d="M208 420 L310 440 L300 492 L208 478 Z" fill={C.pendingRed} />
          </g>
          {/* the ball's shadow on the pitch, softer as it rises */}
          <ellipse cx={bx + 30} cy={900} rx={A * 0.8} ry={26} fill={C.objStage} opacity={0.35 - 0.12 * Math.sin(Math.PI * t)} />
          {/* the ball */}
          <g transform={`translate(${bx.toFixed(2)} ${by.toFixed(2)}) rotate(${tiltDeg.toFixed(2)})`}>
            <Ball theta={theta} />
          </g>
        </g>
        {/* paper grain on the pitch only (dark grain), so the stage above keeps the film's exact background colour */}
        <rect x={-PITCH_X} y={620} width={W + 2 * PITCH_X} height={H - 620} filter="url(#rugby-grain)" opacity={0.09} mask="url(#rugby-pitch-fade)" />
        {/* No fade at the exit: the bit slides out to the left (src/Film.tsx) */}
        <rect x={0} y={0} width={W} height={H} fill={C.stage} opacity={fade * 0} />
      </svg>
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;
  // no ball whoosh: the whistle is added elsewhere
  return [];
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
