import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../../brand/tokens';
import { COL_W, COL_X, HEADLINE_MAX, headlineBox, QUOTE_GAP, QUOTE_SIZE, TEXT_GAP } from '../layout';
import { Chain } from '../../../fx/Chain';
import { E, lmix, prog, rand } from '../../../lib/anim';
import { actOf, CUE, H, W } from '../../../timeline';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';
import { Quote } from '../../_shared/ui/Quote';
import { Scan } from './Gate';
import { Stack } from './Stack';
import { Wireframes } from './Wireframes';
import { useStrings } from '../../../lib/i18n';
import { STR } from './copy';

const SLUG = 'front-au-cloud';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const STACK_X = W / 2;
const STACK_Y = 990;
const STACK_K = 0.6;
const PUSH = 1.05;

// The lowest drawing is the AWS window, about 1195 px down once scaled and rotated.
const ILLU_BOTTOM = 1195;
const TEXT_TOP = ILLU_BOTTOM + TEXT_GAP;
const ROW_SIZE = HEADLINE_MAX;
const ROW_PITCH = headlineBox(ROW_SIZE);
const ROWS = [0, 1, 2].map((i) => TEXT_TOP + i * ROW_PITCH);
const QUOTE = { x: COL_X, y: ILLU_BOTTOM + QUOTE_GAP, w: COL_W };

const Bit: React.FC<BitProps> = ({ seed }) => {
  const { AUTHOR, TEXT } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const c = K;
  const c2 = (name: string) => K(`${name}2`);

  const sx = STACK_X;
  const zoom = lmix(1, PUSH, prog(F, c('push'), c('pushEnd'), E.cam));

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
        y={QUOTE.y}
        w={QUOTE.w}
        size={QUOTE_SIZE}
      />
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;
  const ev: SoundEvent[] = [];

  (['fe', 'be', 'cl'] as const).forEach((n) => ev.push(sfx('object', K(n) + 18, `floor-${n}`, { weight: 0.6 })));
  ev.push(sfx('text', K('fe') + 9, 'headline', { weight: 0.8 }));
  ev.push(sfx('panel', K('ideIn') + 12, 'ide-in', { weight: 0.4, pan: -0.4, apexFrac: 0.5 }));
  ev.push(sfx('panel', K('awsIn') + 6, 'aws-in', { weight: 0.4, pan: 0.2, apexFrac: 0.5 }));

  [0, 1].forEach((j) => ev.push(sfx('type', K('ideType') + j * 6, `ide-key${j}`, { weight: 0.5, pan: -0.4 })));


  ev.push(sfx('text', K('quote1') + 14, 'quote1', { pan: 0.4 }));
  ev.push(sfx('text', K('quote2') + 14, 'quote2', { pan: 0.4 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
