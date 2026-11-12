// polyvalence: the tool cluster.
// Tags enter from the frame edges at scattered start points and travel inward on slightly bent paths.
// The entrance is one continuous move for every tag: all tags share one eased travel from `open` to
// the settle, which starts already moving and only reaches zero speed at the settle (no waves, no
// holds, no stagger pauses). React and Node.js use exactly the same entrance, timing and styling as
// every other tool. The layout is a packed, organic cluster computed
// once per seed: an outward spiral by score (the highest scores closest to the centre, larger chips
// nearer the middle) with rectangle collision avoidance. After `core` the cluster breathes outward
// a little, and after `calm` the whole cluster breathes (1.5 % scale) and rotates very slightly.
import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../../brand/tokens';
import { TOOLS, type Tool } from '../../data/tools';
import { E, mix, prog, rand } from '../../lib/anim';
import { H, W } from '../../lib/grid';
import type { SoundEvent } from '../../sync';
import type { BitModule } from '../types';
import { sfx } from '../_shared/sfx';
import { ToolChip } from '../_shared/ui/ToolChip';
import { K, Line, SLUG, useFrames } from './common';
import { type Box, chipSize, chipWidth, gapOf } from './ab-helpers';

const CX = W / 2;
const CY = 372; // the cluster's centre (screen px); the cluster stays above the line's band
const GAP = 12; // clearance between two chips, px
const SPIRAL_A = 22; // spiral growth: radius = SPIRAL_A * sqrt(step)
const ASPECT = 1.9; // the cluster is wider than it is tall
const BOUNDS = { x: 880, top: -290, bottom: 320 }; // box limits around the centre, px
const TRAVEL = 60; // frames: the last tag's travel, so the settle stays on the same frame
const HEAD = 0.4; // share of the path a tag has already covered when its travel starts (0 = at the frame edge)
type Slot = {
  tool: Tool;
  rel: Box; // position relative to the cluster centre, at rest
  size: number; // chip height (px)
  ang: number; // direction the tag comes in from, radians (from the cluster centre, near the tag's own side)
  bulge: number; // sideways bend of the path, signed (small: the path stays short and calm)
};

/** Where the ray from the cluster centre at angle `ang` leaves the frame (a 90 px margin outside it). */
const exitOf = (ang: number) => {
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const tx = dx > 0 ? (W + 90 - CX) / dx : dx < 0 ? (-90 - CX) / dx : Infinity;
  const ty = dy > 0 ? (H + 90 - CY) / dy : dy < 0 ? (-90 - CY) / dy : Infinity;
  const t = Math.min(tx, ty);
  return { x: CX + dx * t, y: CY + dy * t };
};

/** One packing attempt at chip scale k. Null if the cluster does not fit the bounds at this scale. */
const tryLayout = (seed: number, k: number): Slot[] | null => {
  const placed: Box[] = [];
  const slots: Slot[] = [];
  const others = TOOLS.filter((t) => t.score >= 2).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  for (const t of others) {
    const size = chipSize(t.score) * k;
    const w = chipWidth(t, size);
    const ang = rand(`polyvalence:${seed}:${t.id}:ang`) * 2 * Math.PI;
    let found: Box | null = null;
    for (let m = 0; m < 1600 && !found; m++) {
      const r = SPIRAL_A * Math.sqrt(m);
      const th = ang + m * 2.39996;
      const c: Box = { x: Math.cos(th) * r * ASPECT, y: Math.sin(th) * r, w, h: size };
      if (Math.abs(c.x) + w / 2 > BOUNDS.x || c.y - size / 2 < BOUNDS.top || c.y + size / 2 > BOUNDS.bottom) continue;
      if (placed.every((p) => gapOf(c, p) >= GAP)) found = c;
    }
    if (!found) return null;
    placed.push(found);
    slots.push({
      tool: t,
      rel: found,
      size,
      // the tag enters from its own side of the cluster (a seeded scatter of 0.3 rad around it); the
      // innermost tags have no side, so they get a seeded direction
      ang: (Math.hypot(found.x, found.y) > 60 ? Math.atan2(found.y, found.x) : rand(`polyvalence:${seed}:${t.id}:ang2`) * 2 * Math.PI) + (rand(`polyvalence:${seed}:${t.id}:entry`) - 0.5) * 0.3,
      bulge: (rand(`polyvalence:${seed}:${t.id}:bulge`) - 0.5) * 0.16,
    });
  }
  return slots;
};

/** The largest chip scale (1 down to 0.7, step 0.03) at which the whole cluster fits the bounds. */
const layoutFor = (seed: number): Slot[] => {
  for (let k = 1; k >= 0.7; k -= 0.03) {
    const s = tryLayout(seed, k);
    if (s) return s;
  }
  throw new Error(`polyvalence: no cluster layout fits for seed ${seed}`);
};

type Drawn = { tool: Tool; size: number; x: number; y: number; op: number };

const Bit: React.FC<{ seed: number }> = ({ seed }) => {
  const { f, F, from } = useFrames();
  const slots = useMemo(() => layoutFor(seed), [seed]);

  // The entrance: one move for every tag, from the first frame to the settle (no waves, no holds).
  // E.glide: it starts moving at once (no zero-speed start) and lands softly at the settle.
  const enter = prog(F, K('open'), K('cloud') + TRAVEL, E.glide);

  // The cluster breathes outward after the core cue, to open up its middle.
  const part = prog(F, K('core') + 30, K('settle') + 40, E.smooth);
  // After calm, the whole cluster breathes (1.5 %) and rotates very slightly.
  const ramp = prog(F, K('calm'), K('calm') + 60, E.smooth);
  const t = F - K('calm');
  const breath = 1 + 0.015 * ramp * Math.sin((2 * Math.PI * t) / 300);
  const rot = 0.7 * ramp * Math.sin((2 * Math.PI * t) / 420);

  const drawn: Drawn[] = slots.map((s) => {
    const brk = 1 + 0.08 * part;
    const to = { x: CX + s.rel.x * brk, y: CY + s.rel.y * brk };
    const from0 = exitOf(s.ang);
    // Every tag is already 40 % along its path at frame 0, so the travel from the frame edge stays short.
    const p = mix(HEAD, 1, enter);
    const dx = to.x - from0.x;
    const dy = to.y - from0.y;
    const len = Math.hypot(dx, dy) || 1;
    const bend = s.bulge * len * Math.sin(Math.PI * p);
    const x = mix(from0.x, to.x, p) - (dy / len) * bend;
    const y = mix(from0.y, to.y, p) + (dx / len) * bend;
    const op = prog(F, K('open') - 12, K('open') + 24, E.smooth);
    return { tool: s.tool, size: s.size, x, y, op };
  });

  const ordered = [...drawn].sort((a, b) => a.size - b.size); // small first, the large chips on top

  return (
    <AbsoluteFill style={{ background: C.stage, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${rot}deg) scale(${breath})` }}>
        {ordered
          .filter((d) => d.op > 0.01)
          .map((d) => (
            <div
              key={d.tool.id}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${d.x}px, ${d.y}px) translate(-50%, -50%)`,
                opacity: d.op,
              }}
            >
              <ToolChip tool={d.tool} size={d.size} />
            </div>
          ))}
      </div>
      <Line f={f} from={from} />
    </AbsoluteFill>
  );
};

const cues = (): SoundEvent[] => [
  sfx('panel', K('wave') - 20, 'cloudIn', { weight: 0.35 }),
  sfx('panel', K('gather'), 'gather', { weight: 0.4, apexFrac: 0.5 }),
  sfx('text', K('title') + 4, 'title', { weight: 0.8 }),
  sfx('panel', K('core'), 'core', { weight: 0.6, apexFrac: 0.5 }),
];

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
