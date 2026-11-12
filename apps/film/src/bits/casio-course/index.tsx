import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../brand/tokens';
import { Chain } from '../../fx/Chain';
import { E, fd, lmix, mix, prog, rand } from '../../lib/anim';
import { useStrings } from '../../lib/i18n';
import { actOf, CUE, H, W } from '../../timeline';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import { CALC, Calculator, LCD_CENTRE } from '../_shared/casio/Calculator';
import { cell, hDots, horse, HORSE_W, inverseRow, type Px, vDash } from '../_shared/casio/lcd';
import type { BitModule, BitProps } from '../types';
import { STR } from './copy';

type Lcd = (typeof STR)['fr']['lcd'];

const SLUG = 'casio-course';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// What a seed changes: which horse the classmate picks, and how the race runs.
const pickOf = (seed: number) => 1 + Math.floor(rand(`${SLUG}:${seed}:pick`) * 3);

// The race, simulated once per seed: every tick each horse advances 1-3 LCD pixels.
const START_X = 4;
const FINISH_X = 114; // the finish line's left edge
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

// The opening: the program editor types the code, saves it, then the program list picks COURSE.
const CODE = ['DO', 'FOR 1->I TO 3', 'X(I)+RAND(3)->X(I)', 'NEXT', 'LPWHILE MAX(X)<114'];
const CODE_LEN = CODE.reduce((n, line) => n + line.length, 0);

/** The editor: the first `typed` characters of the code, the caret after them, SAVED once saved. */
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

/** The program list (PRGM): the cursor on one program; the picked one in inverse video. */
const programScreen = (L: Lcd, cursor: number, selected: boolean): Px[] => {
  const px: Px[] = [...inverseRow('PRGM', 0, 0)];
  L.programs.forEach((name, i) => {
    const label = `${cursor === i ? '>' : ' '}${name}`;
    px.push(...(selected && cursor === i ? inverseRow(label, 0, 2 + i) : cell(label, 0, 2 + i)));
  });
  return px;
};

// Screens
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
  const F = f + act.from; // absolute frame: every cue is absolute
  const Fd = fd(F); // discrete state (LCD) decides on whole frames
  const pick = pickOf(seed);
  const race = useMemo(() => simulate(seed), [seed]);
  const L = useStrings(STR).lcd;

  // LCD content
  let px: Px[];
  if (Fd < K('list')) {
    const typed = Math.floor(prog(Fd, K('code'), K('save'), E.linear) * CODE_LEN);
    px = editorScreen(L, typed, Fd < K('save'), Fd >= K('save'));
  } else if (Fd < K('menu')) {
    const cursor = Fd < K('listUp1') ? 3 : Fd < K('listUp2') ? 2 : Fd < K('listUp3') ? 1 : 0;
    px = programScreen(L, cursor, Fd >= K('listSel'));
  } else if (Fd < K('grid')) {
    // The cursor always hesitates down the list before landing on the pick: 1 -> 2 -> (1 or 3) -> pick.
    const cursor = Fd < K('step1') ? 1 : Fd < K('step2') ? 2 : Fd < K('select') ? (pick === 1 ? 1 : 3) : pick;
    px = menuScreen(L, cursor, Fd >= K('select') ? pick : null);
  } else {
    const T = race.ticks.length - 1;
    const tick = Fd < K('go') ? 0 : Math.min(T, Math.floor(((Fd - K('go')) / (K('finish') - K('go'))) * T));
    const status = Fd >= K('result') ? L.result(pick, race.winner + 1 === pick) : L.horse(pick);
    px = raceScreen(race.ticks[tick], (tick % 2) as 0 | 1, status);
  }

  // Camera: close on the LCD (slow push from the race's start), then a pull-back to the tilted calculator
  // The opening holds the close-up; the push starts with the race, as before, shifted by the opening.
  const kClose = (fr: number) => lmix(3.9, 4.15, prog(fr, K('menu'), K('pull'), E.linear));
  // The program list is read closer: the camera pushes in on the list (list -> listSel), holds, then eases
  // back to the menu's framing over 36 f after the menu cue. Outside that window the framing is unchanged.
  const LIST_K = 4.6;
  const listPush = prog(F, K('list'), K('listSel'), E.cam);
  const listBack = prog(F, K('menu'), K('menu') + 36, E.cam);
  const kList = (LIST_K - 3.9) * (listPush - listBack);
  const t = prog(F, K('pull'), K('rest'), E.cam);
  const k = lmix(kClose(Math.min(F, K('pull'))) + kList, 1.1, t);
  const focus = { x: mix(LCD_CENTRE.x, CALC.w / 2, t), y: mix(LCD_CENTRE.y, CALC.h / 2, t) };
  const screen = { x: mix(W / 2, 560, t), y: H / 2 };
  const rot = mix(0, -7, t);
  // A breath while the line is read, so the rest is alive.
  const breathe = 1 + 0.012 * prog(F, K('rest'), K('end'), E.linear);

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${screen.x} ${screen.y}) scale(${k * breathe}) rotate(${rot}) translate(${-focus.x} ${-focus.y})`}>
          <Calculator px={px} />
        </g>
      </svg>
      <Chain chain={`${SLUG}.titre`} frame={f} from={act.from} role="display" size={88} x={1000} top={H / 2 - 50} align="left" />
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  // typing: one key per character, at the frame it appears (same progress as the picture)
  for (let i = 1; i <= CODE_LEN; i++) {
    ev.push(sfx('calc', K('code') + (i / CODE_LEN) * (K('save') - K('code')), `key${i}`, { weight: 0.8 }));
  }
  ev.push(sfx('calc', K('save'), 'save', { weight: 1.1 }));
  // No sound on the TUI's cursor steps and screen switches (list, menu steps, grid): only the buttons
  ev.push(sfx('calc', K('listSel'), 'listSel'));
  ev.push(sfx('item', K('menu'), 'menu', { weight: 0.9 }));
  ev.push(sfx('calc', K('select'), 'select', { weight: 1.1 }));
  // race: the horses' moves are footsteps (the film's one footstep sound), one every 8th LCD tick
  const T = simulate(seed).ticks.length - 1;
  for (let t = 8; t <= T; t += 8) {
    ev.push(sfx('step', K('go') + (t / T) * (K('finish') - K('go')), `race${t}`, { weight: 0.45 }));
  }
  // (no sound when the winning horse crosses the line either: that click moved to the headlines and quotes)
  // (the result sound, played when GAGNE / PERDU shows, is removed)
  ev.push(sfx('camera', (K('pull') + K('rest')) / 2, 'pull', { apexFrac: 0.5 }));
  ev.push(sfx('card', K('rest'), 'rest', { weight: 0.7 }));
  ev.push(sfx('text', K('title'), 'headline'));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
