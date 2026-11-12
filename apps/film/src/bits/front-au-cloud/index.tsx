import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, HEADLINE_LEAD } from '../../brand/tokens';
import { Chain } from '../../fx/Chain';
import { E, lmix, mix, prog, rand } from '../../lib/anim';
import { actOf, CUE, H, W } from '../../timeline';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';
import { Quote } from '../_shared/ui/Quote';
import { Scan } from './Gate';
import { Stack } from './Stack';
import { Wireframes } from './Wireframes';
import { useStrings } from '../../lib/i18n';
import { STR } from './copy';

const SLUG = 'front-au-cloud';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// Two zones: the illustration (stack + wireframes) in the left ~60% of the frame, the copy and
// the quote in the right ~35% (x 1250 to 1824), with a clear gap. The stack builds centred in the left zone at
// x 640, then eases to 560 as the wireframes arrive. Its floor centre is at y 790.
const STACK_X0 = 640;
const STACK_X1 = 560;
const STACK_Y = 790;
const STACK_K = 0.62;
const PUSH = 1.05; // the camera's final push on the stack (log-space, E.cam)

// The right zone: one word per row, then the quote takes their place, vertically centred.
const COL_X = 1250;
const COL_W = 574;
const ROW_SIZE = 96;
const ROW_PITCH = ROW_SIZE * HEADLINE_LEAD; // the headline line pitch (tokens.ts), as every other headline
const ROWS = [0, 1, 2].map((i) => 330 + i * ROW_PITCH);
const QUOTE = { x: COL_X, cy: 540, w: COL_W }; // the height follows the sentences (Quote.tsx)

const Bit: React.FC<BitProps> = ({ seed }) => {
  const { AUTHOR, TEXT } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute
  const c = K;
  const c2 = (name: string) => K(`${name}2`); // the second scan's cues (scanIn2, scan2, scanEnd2, scanOut2)

  const aside = prog(F, c('aside'), c('asideEnd'), E.inOut);
  const sx = mix(STACK_X0, STACK_X1, aside);
  const zoom = lmix(1, PUSH, prog(F, c('push'), c('pushEnd'), E.cam));
  // The whole stack breathes a few px all the time, so the picture never holds still.
  const phase = rand(`${SLUG}:${seed}:drift`) * Math.PI * 2;
  const bob = Math.sin((F / 180) * Math.PI + phase) * 6;

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <g transform={`translate(${sx.toFixed(2)} ${(STACK_Y + bob).toFixed(2)}) scale(${(STACK_K * zoom).toFixed(4)})`}>
          <Stack F={F} c={c} seed={seed} between={<><Scan F={F} c={c} seed={seed} /><Scan F={F} c={c2} seed={seed} /></>} />
        </g>
      </svg>
      <Wireframes F={F} c={c} seed={seed} />
      {ROWS.map((top, i) => (
        <Chain key={i} chain={`${SLUG}.stack${i + 1}`} frame={f} from={act.from} role="display" size={ROW_SIZE} align="left" x={COL_X} top={top} accent="recency" />
      ))}
      <Quote
        photo={AUTHOR.photo}
        name={AUTHOR.name}
        title={AUTHOR.role}
        sentences={[TEXT.quote1[0], TEXT.quote2[0]]}
        times={[c('quote1'), c('quote2')]}
        F={F}
        at={c('quoteIn')}
        x={QUOTE.x}
        cy={QUOTE.cy}
        w={QUOTE.w}
      />
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;
  const ev: SoundEvent[] = [];
  // simplified: floors, main windows, a short typing burst, CI checks, one success, the quote
  (['fe', 'be', 'cl'] as const).forEach((n) => ev.push(sfx('object', K(n) + 18, `floor-${n}`, { weight: 0.6 })));
  ev.push(sfx('text', K('fe') + 9, 'headline', { weight: 0.8 }));
  ev.push(sfx('panel', K('ideIn') + 12, 'ide-in', { weight: 0.4, pan: -0.4, apexFrac: 0.5 }));
  ev.push(sfx('panel', K('termIn') + 6, 'term-in', { weight: 0.4, pan: 0.3, apexFrac: 0.5 }));
  ev.push(sfx('card', K('gateIn') + 6, 'gate-in', { weight: 0.6, pan: 0.2 }));
  ev.push(sfx('panel', K('awsIn') + 6, 'aws-in', { weight: 0.4, pan: 0.2, apexFrac: 0.5 }));
  // short typing bursts: a key every 6 f over the first 0.5 s (first 2 keys of each run)
  [0, 1].forEach((j) => ev.push(sfx('type', K('ideType') + j * 6, `ide-key${j}`, { weight: 0.5, pan: -0.4 })));
  [0, 1].forEach((j) => ev.push(sfx('type', K('termType') + j * 6, `term-key${j}`, { weight: 0.5, pan: 0.3 })));
  // CI checks: one scan each
  (['gateB', 'gateBDone', 'gateT', 'gateTDone'] as const).forEach((n) => ev.push(sfx('scan', K(n), n, { weight: 0.6, pan: 0.2 })));
  ev.push(sfx('success', K('gateOk'), 'gateOk', { weight: 0.8, pan: 0.2 }));
  // the quote
  ev.push(sfx('text', K('quote1') + 14, 'quote1', { pan: 0.4 }));
  ev.push(sfx('text', K('quote2') + 14, 'quote2', { pan: 0.4 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
