import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, HEADLINE_LEAD, U } from '../../../brand/tokens';
import { Mark } from '../../../brand/Mark';
import { Chain } from '../../../fx/Chain';
import { E, fd, prog } from '../../../lib/anim';
import { actOf, CUE, H, W } from '../../../timeline';
import { horse, hDots, type Px, vDash } from '../../_shared/casio/lcd';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';

const SLUG = 'arrivee';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const S = 16;

// The track sits with the same gap above it (from the frame top) as below it (down to the logo).
const TRACK_PX_H = (51 - 9 + 1) * S;
const OX = 84 - 44 * S;
const OY = (1080 - TRACK_PX_H) / 2 - 9 * S;

const ZONE_COL0 = 44;
const ZONE_COL1 = 101;

const LANE_ROWS = [9, 23, 37, 51];
const TRACK_TOP = 9;
const TRACK_BOT = 51;

const HORSE_ROW = 25;

const RUN_FROM = 44;
const CROSS_COL = 70;
const FINISH_COL = 83;

const smoothInt = (u: number) => u * u * u - (u * u * u * u) / 2;

const DECEL_PX = 260;
const decelFrames = (run: number, cross: number) => (2 * DECEL_PX) / ((CROSS_COL * S - RUN_FROM * S) / (cross - run));

const horseX = (F: number, run: number, cross: number) => {
  const x0 = RUN_FROM * S;
  const xc = CROSS_COL * S;
  const v = (xc - x0) / (cross - run);
  if (F < cross) return x0 + v * (F - run);
  const L2 = decelFrames(run, cross);
  const w = Math.min(1, (F - cross) / L2);
  return xc + L2 * v * (w - smoothInt(w));
};

const Bit: React.FC<BitProps> = () => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const Fd = fd(F);

  const run = K('run');
  const cross = K('cross');
  const stop = Math.min(K('stop'), Math.ceil(cross + decelFrames(run, cross)));
  const x = horseX(F, run, cross);

  const moving = Fd >= run && Fd < stop;
  const gallop = moving ? ((Math.floor((Fd - run) / 6) % 2) as 0 | 1) : 0;

  const lanes = LANE_ROWS.flatMap((row) => hDots(row, ZONE_COL0, ZONE_COL1, 2));
  const finish = vDash(FINISH_COL, TRACK_TOP, TRACK_BOT, 1, 3, 2);

  const body = horse(0, HORSE_ROW, gallop);

  const logoIn = prog(F, K('open'), K('open') + 30, E.smooth);
  const logoLift = (1 - prog(F, K('open'), K('open') + 30, E.out)) * 16;

  const block = (px: Px[], colour: string) =>
    px.map(([x, y]) => <rect key={`${x},${y}`} x={x * S} y={y * S} width={S} height={S} fill={colour} />);

  return (
    <AbsoluteFill style={{ background: C.stage }}>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <g shapeRendering="crispEdges" transform={`translate(${OX} ${OY})`}>
          {block(lanes, C.deep)}
          {block(finish, C.mute)}
          <g transform={`translate(${x.toFixed(3)} 0)`}>{block(body, C.accent)}</g>
        </g>
      </svg>

      <div style={{ position: 'absolute', left: COL_X, top: LOGO_Y, opacity: logoIn, transform: `translate(0px, ${logoLift}px)` }}>
        <Mark size={LOGO_W} />
      </div>
      <Chain chain={`${SLUG}.nom`} frame={f} from={act.from} role="display" size={NAME_SIZE} x={COL_X} top={NAME_Y} align="left" accent="none" />
      <Chain chain={`${SLUG}.role`} frame={f} from={act.from} role="line" size={ROLE_SIZE} color={C.soft} x={COL_X} top={ROLE_Y} align="left" accent="none" />

      <Chain chain={`${SLUG}.site`} frame={f} from={act.from} role="secondary" size={SITE_SIZE} color={C.accent} x={COL_X} top={SITE_Y} align="left" accent="none" />
    </AbsoluteFill>
  );
};

const COL_X = 84;
const LOGO_W = 200;
const LOGO_Y = 1080;
const NAME_Y = 1330;
const NAME_SIZE = 88 * U;
const ROLE_SIZE = 56 * U;
const SITE_SIZE = 44 * U;

const ROLE_Y = NAME_Y + HEADLINE_LEAD * NAME_SIZE;
const SITE_Y = ROLE_Y + ROLE_SIZE * 1.15 + 40;

const cues = (): SoundEvent[] => {
  const run = K('run');
  const cross = K('cross');
  const stop = Math.min(K('stop'), Math.ceil(cross + decelFrames(run, cross)));
  const ev: SoundEvent[] = [
    sfx('item', K('open') + 8, 'logo', { weight: 0.7 }),
    sfx('text', K('name') + 4, 'name', { weight: 0.9 }),
    sfx('text', K('role') + 4, 'role', { weight: 0.5 }),
    sfx('text', K('site') + 4, 'site', { weight: 0.6 }),
    sfx('success', cross, 'cross', { weight: 0.9 }),
  ];

  for (let g = run + 12, n = 1; g < stop; g += 12, n++) {
    if (Math.abs(g - cross) < 4) continue;
    ev.push(sfx('step', g, `gallop${n}`, { weight: 0.4 }));
  }
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
