import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, HEADLINE_LEAD, TYPE, U } from '../../brand/tokens';
import { Chain } from '../../fx/Chain';
import { useLocale, useStrings } from '../../lib/i18n';
import { fitSize } from '../../lib/measure';
import { actOf, CUE, H } from '../../timeline';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';
import { STR } from './copy';
import { CARD, CODE, TAB } from './data';
import { DistinctionCard } from './DistinctionCard';
import { Dispenser, type DispenserTimes } from './Dispenser';
import { IdeWindow } from './IdeWindow';

const SLUG = 'olympiades';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// Layout (1920 wide). Text column on the LEFT: x 96 to 670 (574 px). Gap 670 to 770. Picture in the right zone:
// x 770 to 1824. Nothing of the picture enters the gap or the text column.
const COL_X = 96;
const COL_W = 574;
// The display line: one row, sized so « De l'électronique… » fits the column (display role, at most 120 px).
// The line and the distinction card are one block, centred on the frame's height. The card is 159 px tall
// (104 px logo + 26 px padding each side + 1.5 px borders); the line box is the headline pitch (tokens.ts).
const CARD_H = 159;
const CARD_GAP = 40; // the detail gap rule: at least 40 px between the line's box and the card
// The IDE window: upper right of the picture zone.
const IDE = { x: 824, y: 96, w: 1000, h: 508 };
// The dispenser: lower right, under the IDE (its tray faces the viewer). Its floor centre and scale (px per unit).
const DISP = { cx: 1300, cy: 925, s: 0.95 };
// The IDE types about 30 characters a second, from its first character.
const TYPE_CPS = 30;

// The same picture and timing for every seed; the seed only moves the dispenser's start yaw and drum angle.
const Bit: React.FC<BitProps> = ({ seed }) => {
  const S = useStrings(STR);
  const locale = useLocale();
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute
  const bob = Math.sin((F / 324) * Math.PI * 2) * 4;
  const size = fitSize(S.line, COL_W, TYPE.display.size * U, TYPE.display.weight, TYPE.display.track);
  const lineBox = size * HEADLINE_LEAD;
  const blockTop = H / 2 - (lineBox + CARD_GAP + CARD_H) / 2;
  const LINE_TOP = blockTop;
  const CARD_Y = blockTop + lineBox + CARD_GAP;

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
      {/* detail 1: the picture = the IDE window (the sketch typed in it) above the dispenser (the drum steps, pills drop into the front tray) */}
      <IdeWindow F={F} at={K('open')} typeAt={K('type')} cps={TYPE_CPS} x={IDE.x} y={IDE.y} w={IDE.w} h={IDE.h} phase={seed * 37} lines={CODE[locale]} tab={TAB[locale]} />
      <Dispenser F={F} T={T} seed={seed} cx={DISP.cx} cy={DISP.cy} s={DISP.s} bob={bob} />
      {/* detail 2: the message, one display line in the left column, held to the end */}
      <Chain chain={`${SLUG}.line`} frame={f} from={act.from} role="display" size={size} align="left" x={COL_X} top={LINE_TOP} accent="recency" />
      {/* detail 3: the distinction card under the line */}
      <DistinctionCard F={F} at={K('card')} x={COL_X} y={CARD_Y} w={COL_W} logo={CARD.logo} name={S.cardName} activity={S.cardActivity} period={S.cardPeriod} />
    </AbsoluteFill>
  );
};

const cues = (_seed: number): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  ev.push(sfx('item', K('open'), 'ide', { weight: 0.8, pan: 0.3 }));
  // IDE typing: one key per character (newline counts as one), 30 characters a second
  const total = CODE.fr.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0), 0) + (CODE.fr.length - 1);
  for (let i = 1; i <= total; i++) ev.push(sfx('type', K('type') + (i * 60) / TYPE_CPS, `key${i}`, { weight: 0.7, pan: 0.3 }));
  // the dispenser assembles: parts land 36 f after they start
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
