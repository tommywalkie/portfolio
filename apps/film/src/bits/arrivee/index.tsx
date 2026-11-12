import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, HEADLINE_LEAD, U } from '../../brand/tokens';
import { Mark } from '../../brand/Mark';
import { Chain } from '../../fx/Chain';
import { E, fd, prog } from '../../lib/anim';
import { actOf, CUE, H, W } from '../../timeline';
import { horse, hDots, type Px, vDash } from '../_shared/casio/lcd';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';

const SLUG = 'arrivee';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// The race's pixel grid, on screen: one pixel = S px, so the horse (14 x 10 px) is 224 x 160 px.
// The illustration moves to the left (text on the right, round robin) and gets a bit smaller: S 18 -> 16.
const S = 16;
// The whole track shifts by (OX, OY) so it is centred in the illustration zone x 96 to 1150 and on the frame's
// middle line: columns 44 to 101 span x 704 to 1632 before the shift (centre 1160 -> 623), rows 9 to 51 span
// y 144 to 816 (centre 480 -> 540).
const OX = -537;
const OY = 60;
// Columns (before the shift): 44 = the zone's left, 101 = its right.
const ZONE_COL0 = 44;
const ZONE_COL1 = 101;
// Three lanes between dotted lines (rows 9, 23, 37, 51: y 162 to 918, lanes 14 rows = 252 px tall);
// the horse runs in the middle lane, whose centre is the frame's middle line (y 540).
const LANE_ROWS = [9, 23, 37, 51];
const TRACK_TOP = 9;
const TRACK_BOT = 51;
// The horse's 10 rows sit in the 14-row lane with 2 rows (36 px) clear above and below: y 450 to 630.
const HORSE_ROW = 25;
// The horse's left column: the zone's left edge at the start, the finish line at about 70 % of the zone,
// and at rest the tail (the horse's left edge) at least 40 px past the line, still inside the zone.
const RUN_FROM = 44; // x 792
const CROSS_COL = 70; // the nose (column + 13) is on the line here: x 1260 + 234 = 1494
const FINISH_COL = 83; // the finish line: x 1494 to 1512

/** The smoothstep's integral from 0 to u, i.e. the distance covered (the speed is smoothstep(u) × peak). */
const smoothInt = (u: number) => u * u * u - (u * u * u * u) / 2;

/**
 * The horse's left edge (px) at absolute frame F. From `run` (the act's
 * first frame) it gallops at a constant full speed, set so the nose reaches the line at `cross`; after the line its
 * speed falls with the mirrored smoothstep to rest at `stop` (zero speed and zero slope there).
 */
// The faster run must not carry the horse further: the deceleration covers a fixed distance past the line
// (the stop distance of the previous, slower run: 260 px), so its length in frames follows from the speed.
const DECEL_PX = 260;
const decelFrames = (run: number, cross: number) => (2 * DECEL_PX) / ((CROSS_COL * S - RUN_FROM * S) / (cross - run));

const horseX = (F: number, run: number, cross: number) => {
  const x0 = RUN_FROM * S;
  const xc = CROSS_COL * S;
  const v = (xc - x0) / (cross - run); // px per frame, constant up to the line
  if (F < cross) return x0 + v * (F - run);
  const L2 = decelFrames(run, cross);
  const w = Math.min(1, (F - cross) / L2);
  return xc + L2 * v * (w - smoothInt(w)); // ∫(1 - smoothstep) from 0 to w
};

// No seed-dependent variation: the same race and the same timing for every seed.
const Bit: React.FC<BitProps> = () => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute
  const Fd = fd(F); // discrete state (the gallop frame) decides on whole frames

  // The run: a steady gallop that speeds up to and through the line, then a smooth deceleration to a stop past it.
  const run = K('run');
  const cross = K('cross');
  const stop = Math.min(K('stop'), Math.ceil(cross + decelFrames(run, cross)));
  const x = horseX(F, run, cross);

  // Legs change every 6 f for the whole move (run and deceleration); the rest pose only once stopped.
  const moving = Fd >= run && Fd < stop;
  const gallop = moving ? ((Math.floor((Fd - run) / 6) % 2) as 0 | 1) : 0;

  const lanes = LANE_ROWS.flatMap((row) => hDots(row, ZONE_COL0, ZONE_COL1, 2));
  const finish = vDash(FINISH_COL, TRACK_TOP, TRACK_BOT, 1, 3, 2);
  // The horse is drawn at its exact px position (not snapped to a column): every frame moves by its true speed.
  const body = horse(0, HORSE_ROW, gallop);

  // The logo arrives first, on the same 30 f move as the rest of the bit's entrances.
  const logoIn = prog(F, K('open'), K('open') + 30, E.smooth);
  const logoLift = (1 - prog(F, K('open'), K('open') + 30, E.out)) * 16;

  const block = (px: Px[], colour: string) =>
    px.map(([x, y]) => <rect key={`${x},${y}`} x={x * S} y={y * S} width={S} height={S} fill={colour} />);

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      {/* detail 1: the track's lanes, the dashed finish line and the horse (one full-frame svg; the pixel grid stays crisp) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <g shapeRendering="crispEdges" transform={`translate(${OX} ${OY})`}>
          {block(lanes, C.deep)}
          {block(finish, C.mute)}
          <g transform={`translate(${x.toFixed(3)} 0)`}>{block(body, C.accent)}</g>
        </g>
      </svg>

      {/* detail 2: the logo, then the name and the role */}
      <div style={{ position: 'absolute', left: COL_X, top: LOGO_Y, opacity: logoIn, transform: `translate(0px, ${logoLift}px)` }}>
        <Mark size={LOGO_W} />
      </div>
      <Chain chain={`${SLUG}.nom`} frame={f} from={act.from} role="display" size={72 * U} x={COL_X} top={NAME_Y} align="left" accent="none" />
      <Chain chain={`${SLUG}.role`} frame={f} from={act.from} role="line" size={48 * U} color={C.soft} x={COL_X} top={ROLE_Y} align="left" accent="none" />

      {/* detail 3: the site */}
      <Chain chain={`${SLUG}.site`} frame={f} from={act.from} role="secondary" size={40 * U} color={C.accent} x={COL_X} top={SITE_Y} align="left" accent="none" />
    </AbsoluteFill>
  );
};

// The text column. On the right (round robin), x 1250 to 1824.
const COL_X = 1250;
const LOGO_W = 200;
const LOGO_Y = 320;
const NAME_Y = 550;
// The name and the role are two lines of one headline: the role sits one headline pitch (HEADLINE_LEAD x name size)
// under the name. The site is 40 px under the role's box (48 px role at its lead 1.15).
const ROLE_Y = NAME_Y + HEADLINE_LEAD * 72 * U;
const SITE_Y = ROLE_Y + 48 * U * 1.15 + 40;

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
  // the legs change every 6 f while the horse moves; one footstep per stride (every 12 f), none on the crossing
  // frame itself (the bell). Fewer sounds at once on this slide.
  for (let g = run + 12, n = 1; g < stop; g += 12, n++) {
    if (Math.abs(g - cross) < 4) continue;
    ev.push(sfx('step', g, `gallop${n}`, { weight: 0.4 }));
  }
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
