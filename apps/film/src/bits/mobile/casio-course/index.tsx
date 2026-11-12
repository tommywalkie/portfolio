import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../../brand/tokens';
import { Chain } from '../../../fx/Chain';
import { E, fd, lmix, mix, prog, rand } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import { headlineSize, TEXT_GAP } from '../layout';
import { Scrim } from '../../_shared/ui/Scrim';
import { actOf, CUE, H, W } from '../../../timeline';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import { CALC, Calculator, LCD_CENTRE } from '../../_shared/casio/Calculator';
import { cell, hDots, horse, HORSE_W, inverseRow, type Px, vDash } from '../../_shared/casio/lcd';
import type { BitModule, BitProps } from '../../types';
import { STR } from './copy';

type Lcd = (typeof STR)['fr']['lcd'];

const SLUG = 'casio-course';
const CALC_Y = 800;
const CALC_BOTTOM = 1370;
const TITLE_Y = CALC_BOTTOM + TEXT_GAP;
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const pickOf = (seed: number) => 1 + Math.floor(rand(`${SLUG}:${seed}:pick`) * 3);

const START_X = 4;
const FINISH_X = 114;
const LANE_TOP = [10, 28, 46];

const simulate = (seed: number) => {
  const pos = [START_X, START_X, START_X];
  const ticks: number[][] = [pos.slice()];
  for (let t = 1; t < 400; t++) {
    for (let i = 0; i < 3; i++) pos[i] += 1 + Math.floor(rand(`${SLUG}:${seed}:h${i}:${t}`) * 3);
    ticks.push(pos.slice());
    if (pos.some((x) => x + HORSE_W >= FINISH_X)) break;
  }
  const last = ticks[ticks.length - 1];
  const best = Math.max(...last);
  return { ticks, winner: last.indexOf(best) };
};

const CODE = ['DO', 'FOR 1->I TO 3', 'X(I)+RAND(3)->X(I)', 'NEXT', 'LPWHILE MAX(X)<114'];
const CODE_LEN = CODE.reduce((n, line) => n + line.length, 0);

const editorScreen = (L: Lcd, typed: number, caret: boolean, saved: boolean): Px[] => {
  const px: Px[] = [...inverseRow(L.editTitle, 0, 0)];
  let left = typed;
  let caretAt: [col: number, row: number] | null = null;
  for (let i = 0; i < CODE.length; i++) {
    const line = CODE[i];
    const row = i + 1;
    const take = Math.max(0, Math.min(line.length, left));
    if (take > 0) px.push(...cell(line.slice(0, take), 0, row));
    if (caretAt === null && left >= 0 && left <= line.length) caretAt = [take, row];
    left -= line.length;
  }
  if (caret && caretAt !== null) {
    const [col, row] = caretAt;
    for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) px.push([col * 6 + 1 + x, row * 8 + y]);
  }
  if (saved) px.push(...inverseRow('SAVED', 0, 7));
  return px;
};

const programScreen = (L: Lcd, cursor: number, selected: boolean): Px[] => {
  const px: Px[] = [...inverseRow('PRGM', 0, 0)];
  L.programs.forEach((name, i) => {
    const label = `${cursor === i ? '>' : ' '}${name}`;
    px.push(...(selected && cursor === i ? inverseRow(label, 0, 2 + i) : cell(label, 0, 2 + i)));
  });
  return px;
};

const menuScreen = (L: Lcd, cursor: number, selected: number | null): Px[] => {
  const px: Px[] = [...inverseRow(L.menuTitle, 0, 0), ...cell(L.pick, 0, 2)];
  for (let i = 1; i <= 3; i++) {
    const label = `${cursor === i ? '>' : ' '}${L.horse(i)}`;
    px.push(...(selected === i ? inverseRow(label, 0, 3 + i) : cell(label, 0, 3 + i)));
  }
  return px;
};

const raceScreen = (positions: number[], gallop: 0 | 1, status: string): Px[] => {
  const px: Px[] = [...cell(status, 0, 0), ...hDots(9), ...hDots(27), ...hDots(45), ...hDots(63), ...vDash(FINISH_X, 10, 63)];
  positions.forEach((x, i) => px.push(...horse(x, LANE_TOP[i] + 4, ((gallop + i) % 2) as 0 | 1)));
  return px;
};

const Bit: React.FC<BitProps> = ({ seed }) => {
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const Fd = fd(F);
  const pick = pickOf(seed);
  const race = useMemo(() => simulate(seed), [seed]);
  const S = useStrings(STR);
  const L = S.lcd;

  let px: Px[];
  if (Fd < K('list')) {
    const typed = Math.floor(prog(Fd, K('code'), K('save'), E.linear) * CODE_LEN);
    px = editorScreen(L, typed, Fd < K('save'), Fd >= K('save'));
  } else if (Fd < K('menu')) {
    const cursor = Fd < K('listUp1') ? 3 : Fd < K('listUp2') ? 2 : Fd < K('listUp3') ? 1 : 0;
    px = programScreen(L, cursor, Fd >= K('listSel'));
  } else if (Fd < K('grid')) {

    const cursor = Fd < K('step1') ? 1 : Fd < K('step2') ? 2 : Fd < K('select') ? (pick === 1 ? 1 : 3) : pick;
    px = menuScreen(L, cursor, Fd >= K('select') ? pick : null);
  } else {
    const T = race.ticks.length - 1;
    const tick = Fd < K('go') ? 0 : Math.min(T, Math.floor(((Fd - K('go')) / (K('finish') - K('go'))) * T));
    const status = Fd >= K('result') ? L.result(pick, race.winner + 1 === pick) : L.horse(pick);
    px = raceScreen(race.ticks[tick], (tick % 2) as 0 | 1, status);
  }

  // Close-ups keep the LCD at about 870 px wide, so the pixel horses stay legible in the narrow frame.
  const kClose = (fr: number) => lmix(2.55, 2.7, prog(fr, K('menu'), K('pull'), E.linear));

  const LIST_K = 2.9;
  const listPush = prog(F, K('list'), K('listSel'), E.cam);
  const listBack = prog(F, K('menu'), K('menu') + 36, E.cam);
  const kList = (LIST_K - 2.55) * (listPush - listBack);
  const t = prog(F, K('pull'), K('rest'), E.cam);
  const k = lmix(kClose(Math.min(F, K('pull'))) + kList, 1.35, t);
  const focus = { x: mix(LCD_CENTRE.x, CALC.w / 2, t), y: mix(LCD_CENTRE.y, CALC.h / 2, t) };
  const screen = { x: W / 2, y: mix(H / 2, CALC_Y, t) };
  const rot = mix(0, -7, t);

  const breathe = 1 + 0.012 * prog(F, K('rest'), K('end'), E.linear);
  const titleSize = headlineSize(S.TITLE);

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${screen.x} ${screen.y}) scale(${k * breathe}) rotate(${rot}) translate(${-focus.x} ${-focus.y})`}>
          <Calculator px={px} />
        </g>
      </svg>
      <Scrim from={TITLE_Y - 240} to={TITLE_Y - 40} opacity={prog(F, K('title') - 30, K('title'), E.smooth)} />
      <Chain chain={`${SLUG}.titre`} frame={f} from={act.from} role="display" size={titleSize} x={W / 2} top={TITLE_Y} align="center" />
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  const ev: SoundEvent[] = [];

  for (let i = 1; i <= CODE_LEN; i++) {
    ev.push(sfx('calc', K('code') + (i / CODE_LEN) * (K('save') - K('code')), `key${i}`, { weight: 0.8 }));
  }
  ev.push(sfx('calc', K('save'), 'save', { weight: 1.1 }));

  ev.push(sfx('calc', K('listSel'), 'listSel'));
  ev.push(sfx('item', K('menu'), 'menu', { weight: 0.9 }));
  ev.push(sfx('calc', K('select'), 'select', { weight: 1.1 }));

  const T = simulate(seed).ticks.length - 1;
  for (let t = 8; t <= T; t += 8) {
    ev.push(sfx('step', K('go') + (t / T) * (K('finish') - K('go')), `race${t}`, { weight: 0.45 }));
  }

  ev.push(sfx('camera', (K('pull') + K('rest')) / 2, 'pull', { apexFrac: 0.5 }));
  ev.push(sfx('card', K('rest'), 'rest', { weight: 0.7 }));
  ev.push(sfx('text', K('title'), 'headline'));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
