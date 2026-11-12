import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../../brand/tokens';
import { Chain } from '../../../fx/Chain';
import { useLocale, useStrings } from '../../../lib/i18n';
import { actOf, CUE, W } from '../../../timeline';
import { COL_W, COL_X, DETAIL_GAP, headlineBox, headlineSize, MobileCard, TEXT_GAP } from '../layout';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';
import { STR } from './copy';
import { CARD, CODE, TAB } from './data';
import { Dispenser, type DispenserTimes } from './Dispenser';
import { IdeWindow } from './IdeWindow';

const SLUG = 'olympiades';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const IDE = { x: COL_X, y: 180, w: COL_W, h: 508 };

const DISP = { cx: W / 2, cy: 1100, s: 1.15 };
const DISP_BOTTOM = 1250;

const LINE_TOP = DISP_BOTTOM + TEXT_GAP;

const TYPE_CPS = 30;

const Bit: React.FC<BitProps> = ({ seed }) => {
  const S = useStrings(STR);
  const locale = useLocale();
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const bob = Math.sin((F / 324) * Math.PI * 2) * 4;
  const size = headlineSize(S.line);
  const CARD_Y = LINE_TOP + headlineBox(size) + DETAIL_GAP;

  const T: DispenserTimes = {
    base: K('base'),
    column: K('column'),
    dome: K('dome'),
    pods: K('pods'),
    tray: K('tray'),
    chute: K('chute'),
    turns: [K('turn0'), K('turn1'), K('turn2'), K('turn3')],
    drops: [K('drop0'), K('drop1'), K('drop2'), K('drop3')],
  };

  return (
    <AbsoluteFill style={{ background: C.stage }}>

      <IdeWindow F={F} at={K('open')} typeAt={K('type')} cps={TYPE_CPS} x={IDE.x} y={IDE.y} w={IDE.w} h={IDE.h} phase={seed * 37} lines={CODE[locale]} tab={TAB[locale]} />
      <Dispenser F={F} T={T} seed={seed} cx={DISP.cx} cy={DISP.cy} s={DISP.s} bob={bob} />

      <Chain chain={`${SLUG}.line`} frame={f} from={act.from} role="display" size={size} align="left" x={COL_X} top={LINE_TOP} accent="recency" />

      <MobileCard F={F} at={K('card')} y={CARD_Y} logo={CARD.logo} name={S.cardName} activity={S.cardActivity} period={S.cardPeriod} />
    </AbsoluteFill>
  );
};

const cues = (_seed: number): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  ev.push(sfx('item', K('open'), 'ide', { weight: 0.8, pan: 0.3 }));

  const total = CODE.fr.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0), 0) + (CODE.fr.length - 1);
  for (let i = 1; i <= total; i++) ev.push(sfx('type', K('type') + (i * 60) / TYPE_CPS, `key${i}`, { weight: 0.7, pan: 0.3 }));

  ev.push(sfx('object', K('base') + 34, 'base', { weight: 1, pan: 0.2 }));
  ev.push(sfx('object', K('column') + 34, 'column', { weight: 0.7, pan: 0.2 }));
  ev.push(sfx('panel', K('tray') + 20, 'tray', { weight: 0.5, pan: 0.2, apexFrac: 0.5 }));
  ev.push(sfx('object', K('dome') + 34, 'dome', { weight: 0.7, pan: 0.2 }));
  ev.push(sfx('item', K('pods') + 8 * 3 + 12, 'pods', { weight: 0.8, pan: 0.2 }));
  ev.push(sfx('detent', K('chute') + 6, 'chute', { weight: 0.7, pan: 0.2 }));
  (['turn0', 'turn1', 'turn2', 'turn3'] as const).forEach((n, i) => ev.push(sfx('detent', K(n) + 10, n, { weight: 0.9 - (i % 2) * 0.15, pan: 0.2 })));
  (['drop0', 'drop1', 'drop2', 'drop3'] as const).forEach((n) => {
    ev.push(sfx('pill', K(n), `${n}-out`, { weight: 0.6, pan: 0.2 }));
    ev.push(sfx('object', K(n) + 32, `${n}-tray`, { weight: 0.7, pan: 0.2 }));
  });
  ev.push(sfx('text', K('type') + 4, 'headline'));
  ev.push(sfx('card', K('card') + 8, 'card', { weight: 0.8, pan: -0.3 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
