import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../../../brand/tokens';
import { TOOLS, type Tool } from '../../../data/tools';
import { E, mix, prog, rand } from '../../../lib/anim';
import { H, W } from '../../../lib/grid';
import type { SoundEvent } from '../../../sync';
import type { BitModule } from '../../types';
import { sfx } from '../../_shared/sfx';
import { ToolChip } from '../../_shared/ui/ToolChip';
import { TEXT_GAP } from '../layout';
import { K, Line, SLUG, useFrames } from './common';
import { type Box, chipSize, chipWidth, gapOf } from './ab-helpers';

const CX = W / 2;
const CY = 680;
const GAP = 12;
const SPIRAL_A = 22;
const ASPECT = 0.8;
// Bounds leave room for the 8 % spread at `part`, so the chips stay inside the 72 px side margins.
const BOUNDS = { x: 436, top: -500, bottom: 480 };
const LINE_TOP = CY + BOUNDS.bottom * 1.08 + TEXT_GAP;
const TRAVEL = 60;
const HEAD = 0.4;
type Slot = {
  tool: Tool;
  rel: Box;
  size: number;
  ang: number;
  bulge: number;
};

const exitOf = (ang: number) => {
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const tx = dx > 0 ? (W + 90 - CX) / dx : dx < 0 ? (-90 - CX) / dx : Infinity;
  const ty = dy > 0 ? (H + 90 - CY) / dy : dy < 0 ? (-90 - CY) / dy : Infinity;
  const t = Math.min(tx, ty);
  return { x: CX + dx * t, y: CY + dy * t };
};

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

      ang: (Math.hypot(found.x, found.y) > 60 ? Math.atan2(found.y, found.x) : rand(`polyvalence:${seed}:${t.id}:ang2`) * 2 * Math.PI) + (rand(`polyvalence:${seed}:${t.id}:entry`) - 0.5) * 0.3,
      bulge: (rand(`polyvalence:${seed}:${t.id}:bulge`) - 0.5) * 0.16,
    });
  }
  return slots;
};

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

  const enter = prog(F, K('open'), K('cloud') + TRAVEL, E.glide);

  const part = prog(F, K('core') + 30, K('settle') + 40, E.smooth);

  const ramp = prog(F, K('calm'), K('calm') + 60, E.smooth);
  const t = F - K('calm');
  const breath = 1 + 0.015 * ramp * Math.sin((2 * Math.PI * t) / 300);
  const rot = 0.7 * ramp * Math.sin((2 * Math.PI * t) / 420);

  const drawn: Drawn[] = slots.map((s) => {
    const brk = 1 + 0.08 * part;
    const to = { x: CX + s.rel.x * brk, y: CY + s.rel.y * brk };
    const from0 = exitOf(s.ang);

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

  const ordered = [...drawn].sort((a, b) => a.size - b.size);

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
      <Line f={f} from={from} top={LINE_TOP} />
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
