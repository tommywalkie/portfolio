// The pictures of ia-workflow. No app window: the chat column sits on the stage (system rows, the user's bubbles, the
// agent's question cards and reply), then an IDE wireframe (src/horse.ts, light mode) and the horse preview (no UI).
// Every text block sizes to its content (bubbles wrap on a measured width, cards and rows have heights computed from
// their line heights), so nothing clips. `c` reads a cue (absolute frame). Colours from tokens.ts only.
// The AionUI team window (TeamApp, below) is kept but not rendered while SHOW_TEAM is false in index.tsx; its cues are
// not in timeline.ts any more (restoring it needs its own timing, see PLAYBOOK).
import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../brand/tokens';
import { Cursor, cursorArc, pressAt } from '../../fx/Cursor';
import { arrive, arriveK, clamp, E, fd, prog } from '../../lib/anim';
import { useStrings } from '../../lib/i18n';
import { measureTracked } from '../../lib/measure';
import { type Member, STR } from './copy';
import { CPS, STRIDE, streamFrames } from './timeline';
import { TITLE_BAR } from './NativeWindow';

// The team window's box on the frame (kept for TeamLayer in index.tsx, SHOW_TEAM is false).
export const WIN = { x: 128, y: 232, w: 1664, h: 776 };
export const CHROME = TITLE_BAR; // the native title bar above the app
export const APP_W = WIN.w - 6; // the window's inner width (the border is 3 px each side)
export const APP_H = WIN.h - CHROME - 6; // the app area under the title bar

// the team window (detail 2, not rendered: SHOW_TEAM is false)
const SIDE_W = 244;
const MAIN_X = SIDE_W + 20;
const MAIN_W = APP_W - SIDE_W - 40;
const CARD_TOP = 150;
const CARD_H = APP_H - CARD_TOP - 16;
const CARD_GAP = 12;
/** Every column's width: the row's width shared out over the five columns, one whole pixel each (all equal). */
const COL_W = Math.floor((MAIN_W - CARD_GAP * (STR.fr.MEMBERS.length - 1)) / STR.fr.MEMBERS.length);
/** Every message box's height: three lines of typed text at most, the same for all five. */
const INPUT_H = 96;

/** A rise of 16 px on E.out, landed through arrive() so its tail never ticks in whole pixels. */
const riseP = (F: number, at: number, dur = 30) => arrive(prog(F, at, at + dur, E.out), arriveK(16, dur, E.out));

const base: React.CSSProperties = { position: 'absolute', boxSizing: 'border-box', fontFamily: FONT.text };

const Crown: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flex: 'none' }}>
    <path d="M2.5 18 L4 7.5 L9 12.5 L12 5 L15 12.5 L20 7.5 L21.5 18 Z" fill={C.accentDeep} />
  </svg>
);

// Detail 1: the chat column, on the stage. Items stack from the bottom; each new one pushes the others up.

/** The chat column: its width, and its box on the frame (top under the headline, bottom inside the margin). */
export const CHAT_W = 760;
export const CHAT_TOP = 250;
export const CHAT_BOTTOM = 1000;
const CHAT_H = CHAT_BOTTOM - CHAT_TOP;
/** The fade at the column's top: older items leave through it as the stack moves up. */
const CHAT_FADE = 130;
const ITEM_GAP = 16;

// bubbles: 28 px text on 36 px lines, wrapped on a measured width
const BUB_SIZE = 28;
const BUB_WEIGHT = 500;
const BUB_LEAD = 36;
const BUB_PAD_X = 24;
const BUB_PAD_Y = 14;
const BUB_TEXT_W = 540;
// system rows: small and muted
const SYS_H = 40;
const SYS_SIZE = 24;
// question cards: a title, then one button per line
const QCARD_W = 520;
const QCARD_PAD = 22;
const QTITLE_LEAD = 36;
const QTITLE_GAP = 16;
const BTN_H = 54;
const BTN_GAP = 10;

/** Greedy word wrap of `text` in `maxW` px at a size and weight, measured with the loaded font. */
const wrap = (text: string, size: number, weight: number, maxW: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measureTracked(next, size, weight, 0) > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};

/** The spinner of a running system row (a turning arc, one turn per 40 f). */
const Spinner: React.FC<{ F: number }> = ({ F }) => (
  <svg width={22} height={22} viewBox="0 0 18 18" style={{ display: 'block', flex: 'none', transform: `rotate(${(F * 9) % 360}deg)` }}>
    <circle cx={9} cy={9} r={7} fill="none" stroke={C.appEdge} strokeWidth={2.2} strokeDasharray="30 14" />
  </svg>
);

const Check: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 18 18" style={{ display: 'block', flex: 'none' }}>
    <path d="M3.5 9.5 L7.5 13.2 L14.5 5.2" fill="none" stroke={C.accentDeep} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Item =
  | { kind: 'sys'; at: number; done: number; label: string }
  | { kind: 'tom' | 'agent'; at: number; text: string; stream: number }
  | { kind: 'card'; at: number; hover: number; pick: number; title: string; options: string[]; picked: number };

const cardH = (n: number) => 2 * QCARD_PAD + QTITLE_LEAD + QTITLE_GAP + n * BTN_H + (n - 1) * BTN_GAP;

/** A small muted status row: a spinner, then a check once `done`. */
const SysRow: React.FC<{ F: number; done: number; label: string }> = ({ F, done, label }) => (
  <div style={{ height: SYS_H, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 4, color: C.appInkFaint, fontFamily: FONT.text, fontSize: SYS_SIZE, fontWeight: 500, whiteSpace: 'nowrap' }}>
    {F >= done ? <Check /> : <Spinner F={F} />}
    {label}
  </div>
);

/** A chat bubble: mine in deep green on the right, the agent's light on the left. Lines come from wrap().
 *  `shown` is how many characters have streamed in so far (messages stream); the rest are kept in the
 *  layout, invisible, so the bubble keeps its final size from its first frame. */
const Bubble: React.FC<{ mine: boolean; lines: string[]; shown: number }> = ({ mine, lines, shown }) => (
  <div
    style={{
      boxSizing: 'border-box',
      padding: `${BUB_PAD_Y}px ${BUB_PAD_X}px`,
      borderRadius: 20,
      background: mine ? C.appInkMute : C.appPage,
      color: mine ? C.appHi : C.appInkDeep,
      fontFamily: FONT.text,
      fontSize: BUB_SIZE,
      fontWeight: BUB_WEIGHT,
      lineHeight: `${BUB_LEAD}px`,
      letterSpacing: 0,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'pre',
    }}
  >
    {lines.map((l, i) => {
      const before = lines.slice(0, i).reduce((n, x) => n + x.length + 1, 0); // +1: the space the wrap consumed
      const n = Math.max(0, Math.min(l.length, shown - before));
      return (
        <div key={i}>
          {l.slice(0, n)}
          <span style={{ opacity: 0 }}>{l.slice(n)}</span>
        </div>
      );
    })}
  </div>
);

/** The agent's question card: the title, then one button per line; the cursor hovers then picks `picked`. */
const QCard: React.FC<{ F: number; at: number; hover: number; pick: number; title: string; options: string[]; picked: number }> = ({ F, at, pick, title, options, picked }) => (
  <div style={{ boxSizing: 'border-box', width: QCARD_W, padding: QCARD_PAD, borderRadius: 20, background: C.appPage, fontFamily: FONT.text }}>
    <div style={{ height: QTITLE_LEAD, lineHeight: `${QTITLE_LEAD}px`, fontSize: 28, fontWeight: 700, color: C.appInkDeep, whiteSpace: 'nowrap' }}>{title}</div>
    <div style={{ marginTop: QTITLE_GAP, display: 'flex', flexDirection: 'column', gap: BTN_GAP }}>
      {options.map((o, i) => {
        const isPick = i === picked;
        const free = i === options.length - 1; // the free-text option: its label reads as a placeholder
        const hov = isPick && F >= pick - 12 && F < pick;
        const on = isPick ? prog(F, pick + 3, pick + 12, E.ui) : 0;
        const appear = prog(F, at + 6 * (i + 1), at + 6 * (i + 1) + 18, E.smooth);
        return (
          <div
            key={o}
            style={{
              position: 'relative',
              boxSizing: 'border-box',
              height: BTN_H,
              borderRadius: 12,
              border: `2px solid ${hov ? C.mid : isPick && fd(F) >= pick + 3 ? C.appInkMute : C.appFill}`,
              background: C.appPaper,
              overflow: 'hidden',
              opacity: appear,
              transform: `scale(${1 - 0.03 * (isPick ? pressAt(F, pick) : 0)})`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: C.appInkMute, opacity: on }} />
            <div
              style={{
                position: 'relative',
                height: BTN_H - 4,
                padding: '0 18px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 24,
                fontWeight: 600,
                color: isPick && F >= pick + 6 ? C.appHi : free ? C.appInkFaint : C.appInkDeep,
                whiteSpace: 'nowrap',
              }}
            >
              {o}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const ChatColumn: React.FC<{ F: number; c: (name: string) => number; x: number }> = ({ F, c, x }) => {
  const { CHAT } = useStrings(STR);
  const items: Item[] = [
    { kind: 'sys', at: c('sys1'), done: c('sys1Done'), label: CHAT.sys.mcp },
    { kind: 'sys', at: c('sys2'), done: c('sys2Done'), label: CHAT.sys.skill },
    { kind: 'tom', at: c('tom1'), text: CHAT.tom.game, stream: streamFrames(STR.fr.CHAT.tom.game) },
    { kind: 'sys', at: c('ask1'), done: c('ask1Done'), label: CHAT.sys.ask },
    { kind: 'card', at: c('card1'), hover: c('hover1'), pick: c('pick1'), title: CHAT.cards[0].title, options: CHAT.cards[0].options, picked: 0 },
    { kind: 'sys', at: c('ask2'), done: c('ask2Done'), label: CHAT.sys.ask },
    { kind: 'card', at: c('card2'), hover: c('hover2'), pick: c('pick2'), title: CHAT.cards[1].title, options: CHAT.cards[1].options, picked: 0 },
    { kind: 'sys', at: c('agentsMd'), done: c('agentsMdDone'), label: CHAT.sys.agentsMd },
    { kind: 'sys', at: c('specMd'), done: c('specMdDone'), label: CHAT.sys.specMd },
    { kind: 'sys', at: c('sub1'), done: c('subDone1'), label: CHAT.sys.subModel },
    { kind: 'sys', at: c('sub2'), done: c('subDone2'), label: CHAT.sys.subScene },
    { kind: 'tom', at: c('tom3'), text: CHAT.tom.eslint, stream: streamFrames(STR.fr.CHAT.tom.eslint) },
    { kind: 'sys', at: c('eslint'), done: c('eslintDone'), label: CHAT.sys.eslint },
    { kind: 'sys', at: c('lint'), done: c('lintDone'), label: CHAT.sys.lint },
    { kind: 'agent', at: c('reply'), text: CHAT.reply, stream: streamFrames(STR.fr.CHAT.reply) },
  ];
  const lines = items.map((it) => (it.kind === 'tom' || it.kind === 'agent' ? wrap(it.text, BUB_SIZE, BUB_WEIGHT, BUB_TEXT_W) : []));
  const heights = items.map((it, i) => (it.kind === 'sys' ? SYS_H : it.kind === 'card' ? cardH(it.options.length) : lines[i].length * BUB_LEAD + 2 * BUB_PAD_Y));
  const shown = items.map((it) => prog(F, it.at, it.at + 24, E.out));
  // bottom-anchored stack: an item's top is the column's bottom minus its height and every newer item's share
  const tops: number[] = [];
  let below = 0;
  for (let i = items.length - 1; i >= 0; i--) {
    tops[i] = CHAT_H - heights[i] - below;
    below += (heights[i] + ITEM_GAP) * shown[i];
  }

  // The cursor: it glides to the picked button of the active card (following the card as the stack moves) and clicks
  let cur: { x: number; y: number; op: number; press: number } | null = null;
  items.forEach((it, i) => {
    if (it.kind !== 'card' || F < it.hover || F > it.pick + 30) return;
    const bx = x + QCARD_PAD + 140;
    const by = CHAT_TOP + tops[i] + QCARD_PAD + QTITLE_LEAD + QTITLE_GAP + it.picked * (BTN_H + BTN_GAP) + BTN_H / 2;
    const a = cursorArc({ x: x + CHAT_W - 40, y: CHAT_BOTTOM - 30 }, { x: bx, y: by }, prog(F, it.hover, it.pick - 9, E.glide));
    const op = prog(F, it.hover, it.hover + 9, E.smooth) * (1 - prog(F, it.pick + 12, it.pick + 30, E.smooth));
    cur = { x: a.x, y: a.y, op, press: pressAt(F, it.pick) };
  });
  const cc = cur as { x: number; y: number; op: number; press: number } | null;

  return (
    <>
    <div
      style={{
        ...base,
        left: x,
        top: CHAT_TOP,
        width: CHAT_W,
        height: CHAT_H,
        overflow: 'hidden',
        maskImage: `linear-gradient(to bottom, transparent 0px, ${C.stage} ${CHAT_FADE}px)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, ${C.stage} ${CHAT_FADE}px)`,
      }}
    >
      {items.map((it, i) =>
        shown[i] <= 0 ? null : (
          <div
            key={i}
            style={{
              ...base,
              left: 0,
              top: tops[i],
              width: CHAT_W,
              height: heights[i],
              display: 'flex',
              justifyContent: it.kind === 'tom' ? 'flex-end' : 'flex-start',
              opacity: shown[i],
              transform: `translate(0px, ${(1 - shown[i]) * 24}px)`,
            }}
          >
            {it.kind === 'sys' && <SysRow F={F} done={it.done} label={it.label} />}
            {(it.kind === 'tom' || it.kind === 'agent') && (
              <Bubble
                mine={it.kind === 'tom'}
                lines={lines[i]}
                // streamed in tokens of 4 characters, over the French-driven frame count (the same in every locale)
                shown={Math.ceil((lines[i].reduce((n, x) => n + x.length + 1, 0) * prog(F, it.at + 6, it.at + it.stream, E.linear)) / 4) * 4}
              />
            )}
            {it.kind === 'card' && <QCard F={F} at={it.at} hover={it.hover} pick={it.pick} title={it.title} options={it.options} picked={it.picked} />}
          </div>
        ),
      )}
    </div>
    {cc && cc.op > 0 && <Cursor x={cc.x} y={cc.y} scale={1.5 * (1 - 0.1 * cc.press)} opacity={cc.op} fill={C.ink2} stroke={C.white} />}
    </>
  );
};

// Detail 2: the IDE wireframe (src/duck.ts), with one bad practice on line 3 and the cursor wiggling around it.

/** The file in the editor: code, not translated. Line BAD is the faulty one; FIXED replaces it once the rule is on. */
const FILE = 'src/horse.ts';
const CODE = [
  "import type { Horse } from './types';",
  'const SPEED = 1.2;',
  'function step(horse: any, dt: any) {',
  '  horse.position.x += SPEED * dt;',
  '  horse.gait = Math.sin(horse.t * 8);',
  '}',
];
const BAD = 2;
const FIXED = 'function step(horse: Horse, dt: number) {';

export const IDE_W = 828;
const CODE_SIZE = 26;
const CODE_WEIGHT = 500;
const CODE_LEAD = 46;
const CODE_PAD = 26;
const GUTTER = 64;
const CODE_X = GUTTER + 20;
/** The window header of olympiades/IdeWindow (three dots and the file tab), same look and height. */
const IDE_CHROME = 56;
export const IDE_H = IDE_CHROME + 6 + 2 * CODE_PAD + CODE.length * CODE_LEAD;

export const Ide: React.FC<{ F: number; c: (name: string) => number }> = ({ F, c }) => {
  const ideIn = c('ideIn');
  const fix = c('fix');
  const fixed = fd(F) >= fix;
  const tint = prog(F, fix - 1, fix + 9) * (1 - 0.6 * prog(F, c('fixFade'), c('fixFade') + 40, E.smooth));

  // The cursor: it arcs in to the faulty line, then wiggles around its two `any` (a sum of sines, its amplitude eased in)
  const mono = (s: string) => measureTracked(s, CODE_SIZE, CODE_WEIGHT, 0, FONT.mono);
  const lineY = IDE_CHROME + CODE_PAD + BAD * CODE_LEAD + CODE_LEAD / 2;
  // A selection drags over `horse: any, dt: any`, character by character; the cursor follows the selection's end
  const PRE = 'function step(';
  const SEL = 'horse: any, dt: any';
  const x0 = CODE_X + mono(PRE);
  const land = c('cursorIn') + 36;
  const arc = cursorArc({ x: IDE_W - 70, y: IDE_H - 20 }, { x: x0, y: lineY + 8 }, prog(F, c('cursorIn'), land, E.glide));
  // The cursor glides continuously (eased); the selection snaps to the characters it has passed
  const xFull = CODE_X + mono(PRE + SEL);
  const xCur = x0 + (xFull - x0) * prog(F, c('selStart'), c('selEnd'), E.smooth);
  let nSel = 0;
  while (nSel < SEL.length && CODE_X + mono(PRE + SEL.slice(0, nSel + 1)) - mono(SEL[nSel]) / 2 <= xCur) nSel++;
  const cur = F < c('selStart') ? arc : { x: xCur, y: lineY + 8 };
  const selOp = nSel > 0 ? 1 - prog(F, c('fix') - 1, c('fix') + 9) : 0;
  const curOp = prog(F, c('cursorIn'), c('cursorIn') + 12, E.smooth) * (1 - prog(F, c('eslint'), c('eslint') + 18, E.smooth));

  return (
    <div style={{ ...base, left: 0, top: 0, width: IDE_W, height: IDE_H, overflow: 'hidden', borderRadius: 18, border: `3px solid ${C.appEdge}`, background: C.appPage }}>
      {/* the window header, as in olympiades/IdeWindow: three dots and the file tab */}
      <div style={{ ...base, left: 0, top: 0, width: IDE_W, height: IDE_CHROME, background: C.appPaper }}>
        {[24, 48, 72].map((dx) => (
          <div key={dx} style={{ ...base, left: 0, top: 0, width: 14, height: 14, borderRadius: 7, background: C.appFill, transform: `translate(${dx - 7}px, ${(IDE_CHROME - 14) / 2}px)` }} />
        ))}
        <div
          style={{
            ...base,
            left: 0,
            top: 0,
            height: 34,
            padding: '0 22px',
            borderRadius: 10,
            background: C.appPage,
            fontFamily: FONT.mono,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: '34px',
            color: C.mid,
            whiteSpace: 'pre',
            transform: `translate(120px, ${(IDE_CHROME - 34) / 2}px)`,
          }}
        >
          {FILE}
        </div>
        <div style={{ ...base, left: 0, top: IDE_CHROME - 2, width: IDE_W, height: 2, background: C.appFill }} />
      </div>
      {/* the gutter (line numbers) and the code */}
      <div style={{ ...base, left: 0, top: IDE_CHROME, width: GUTTER, height: IDE_H - IDE_CHROME, background: C.appPage, borderRight: `2px solid ${C.appFill}` }} />
      <div style={{ ...base, left: GUTTER, top: IDE_CHROME, width: IDE_W - GUTTER, height: IDE_H - IDE_CHROME, background: C.appPaper }} />
      {CODE.map((line, i) => {
        const top = IDE_CHROME + CODE_PAD + i * CODE_LEAD;
        const op = prog(F, ideIn + 12 + 6 * i, ideIn + 24 + 6 * i, E.smooth);
        const isBad = i === BAD;
        return (
          <React.Fragment key={i}>
            {isBad && tint > 0 && (
              <>
                <div style={{ ...base, left: GUTTER, top, width: IDE_W - GUTTER, height: CODE_LEAD, background: C.accentDeep, opacity: tint * 0.14 }} />
                <div style={{ ...base, left: GUTTER, top, width: 4, height: CODE_LEAD, background: C.accentDeep, opacity: tint }} />
              </>
            )}
            {isBad && selOp > 0 && <div style={{ ...base, left: x0, top: top + 5, width: CODE_X + mono(PRE + SEL.slice(0, nSel)) - x0, height: CODE_LEAD - 10, background: C.mid, opacity: 0.3 * selOp }} />}
            <div style={{ ...base, left: 0, top, width: GUTTER - 14, height: CODE_LEAD, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: FONT.mono, fontSize: 20, fontWeight: 500, color: C.appInkFaint, opacity: op }}>
              {i + 1}
            </div>
            <div
              style={{
                ...base,
                left: CODE_X,
                top,
                height: CODE_LEAD,
                display: 'flex',
                alignItems: 'center',
                fontFamily: FONT.mono,
                fontSize: CODE_SIZE,
                fontWeight: CODE_WEIGHT,
                letterSpacing: 0,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'pre',
                color: C.appInkDeep,
                opacity: op,
              }}
            >
              {isBad && fixed ? FIXED : line}
            </div>
          </React.Fragment>
        );
      })}
      {curOp > 0 && <Cursor x={cur.x} y={cur.y} scale={1.5} opacity={curOp} fill={C.appInk} stroke={C.appHi} />}
    </div>
  );
};

// Detail 2, last: the horse preview. Just the scene (no browser chrome, no buttons): a sky, a ground grid in perspective
// that scrolls under the duck, and a low-poly duck (flat facets in the palette's shades) walking in place.

export const HORSE_W = 828;
export const HORSE_H = 500;
const SW = HORSE_W - 6;
const SH = HORSE_H - 6;
const HORIZON = 250;

type P2 = [number, number];
const pts = (p: P2[]) => p.map(([x, y]) => `${x},${y}`).join(' ');

/** A tapered quad along p0 -> p1, w0 wide at p0 and w1 wide at p1 (a limb segment). */
const seg = (p0: P2, p1: P2, w0: number, w1: number) => {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  return pts([
    [p0[0] + (nx * w0) / 2, p0[1] + (ny * w0) / 2],
    [p1[0] + (nx * w1) / 2, p1[1] + (ny * w1) / 2],
    [p1[0] - (nx * w1) / 2, p1[1] - (ny * w1) / 2],
    [p0[0] - (nx * w0) / 2, p0[1] - (ny * w0) / 2],
  ]);
};

// The horse faces right, hooves on y = 0, x = 0 at the middle of the barrel. Flat facets, palette greens only.
const BARREL: P2[] = [[-80, -258], [-10, -246], [72, -262], [112, -192], [82, -118], [-70, -128], [-118, -150], [-132, -190], [-122, -238]];
const BARREL_LIGHT: P2[] = [[-80, -258], [-10, -246], [72, -262], [78, -236], [-8, -222], [-90, -232], [-122, -238]];
const BELLY: P2[] = [[-70, -128], [82, -118], [96, -150], [-4, -158], [-110, -156], [-118, -150]];
const HAUNCH: P2[] = [[-122, -238], [-80, -258], [-60, -200], [-70, -160], [-118, -150], [-132, -190]];
const NECK: P2[] = [[62, -258], [146, -378], [178, -340], [114, -196]];
const NECK_LIGHT: P2[] = [[62, -258], [146, -378], [158, -356], [96, -246]];
const HEAD: P2[] = [[144, -382], [176, -372], [236, -312], [240, -296], [222, -290], [190, -316], [168, -336], [150, -352]];
const MUZZLE: P2[] = [[222, -300], [238, -314], [240, -296], [224, -290]];
const JAW: P2[] = [[168, -336], [190, -316], [222, -290], [196, -300], [172, -318]];
const MANE: P2[] = [[56, -258], [112, -384], [148, -396], [152, -376], [90, -262]];
const MANE2: P2[] = [[44, -246], [100, -330], [96, -270]];
const FORELOCK: P2[] = [[170, -376], [194, -352], [176, -348]];
const TAIL: P2[] = [[-122, -240], [-152, -214], [-166, -130], [-150, -96], [-140, -132], [-128, -206]];
const TAIL_LIGHT: P2[] = [[-122, -240], [-152, -214], [-146, -160], [-130, -208]];

/** One leg: upper and lower segment, a hoof; `p` is the gait phase (radians), `near` the side seen by the camera. */
const Leg: React.FC<{ hip: P2; p: number; near: boolean; l1: number; l2: number; thick: number }> = ({ hip, p, near, l1, l2, thick }) => {
  const u = 0.3 * Math.sin(p); // swing of the upper segment (forward when positive)
  const k = -0.9 * Math.max(0, Math.cos(p)); // the lower segment folds back while the leg swings forward
  const knee: P2 = [hip[0] + Math.sin(u) * l1, hip[1] + Math.cos(u) * l1];
  const foot: P2 = [knee[0] + Math.sin(u + k) * l2, knee[1] + Math.cos(u + k) * l2];
  const dir: P2 = [Math.sin(u + k), Math.cos(u + k)];
  const fill = near ? C.objDeep : C.objInk2;
  return (
    <g>
      <polygon points={seg(hip, knee, thick, thick * 0.6)} fill={fill} />
      <circle cx={knee[0]} cy={knee[1]} r={(thick * 0.6) / 2} fill={fill} />
      <polygon points={seg(knee, foot, thick * 0.6, thick * 0.5)} fill={fill} />
      <polygon points={seg([foot[0] - dir[0] * 14, foot[1] - dir[1] * 14], [foot[0] + dir[0] * 1, foot[1] + dir[1] * 1], thick * 0.5, thick * 0.62)} fill={C.objStage} />
    </g>
  );
};

export const HorseScene: React.FC<{ F: number; c: (name: string) => number }> = ({ F, c }) => {
  const t = Math.max(0, F - c('duckIn'));
  const phi = (2 * Math.PI * t) / (2 * STRIDE); // one full gait cycle: all four legs step once
  const bob = -2.5 * (1 - Math.cos(2 * phi)); // the body rises a little twice per cycle
  const headBob = 2 * Math.sin(phi + 0.9); // the neck nods once per cycle (degrees)
  const tailSway = 4 * Math.sin(phi + 1.8);

  // the ground grid: lines from the vanishing point, scrolling left as the horse walks right
  const vx = SW / 2;
  const SPACING = 90;
  const scroll = (t * 1.1) % SPACING;
  const rays: number[] = [];
  for (let k = -14; k <= 14; k++) rays.push(vx + (k * SPACING - scroll) * 2.6);
  const depth = [0.07, 0.17, 0.33, 0.58].map((k) => HORIZON + (SH - HORIZON) * k);

  const fx = SW / 2 - 40;
  const fy = HORIZON + 172;

  return (
    <div style={{ ...base, left: 0, top: 0, width: HORSE_W, height: HORSE_H, overflow: 'hidden', background: C.objBright }}>
      <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ia-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.objSoft} />
            <stop offset="1" stopColor={C.objBright} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={SW} height={HORIZON} fill="url(#ia-sky)" />
        <rect x={0} y={HORIZON} width={SW} height={SH - HORIZON} fill={C.objText} />
        {rays.map((bx, i) => (
          <line key={`r${i}`} x1={vx + (bx - vx) * 0.08} y1={HORIZON + (SH - HORIZON) * 0.08} x2={bx} y2={SH} stroke={C.objSoft} strokeWidth={2} />
        ))}
        {depth.map((y, i) => (
          <line key={`d${i}`} x1={0} y1={y} x2={SW} y2={y} stroke={C.objSoft} strokeWidth={2} />
        ))}
        {/* the horse: shadow, far legs, the faceted body, near legs; walk = hind, fore, hind, fore (a quarter cycle apart) */}
        <g transform={`translate(${fx} ${fy}) scale(0.9)`}>
          <ellipse cx={0} cy={2} rx={170} ry={14} fill={C.objMute} opacity={0.35} />
          <g transform={`translate(0 ${bob})`}>
            <Leg hip={[-88, -168]} p={phi + Math.PI} near={false} l1={84} l2={90} thick={26} />
            <Leg hip={[64, -160]} p={phi + 1.5 * Math.PI} near={false} l1={80} l2={92} thick={22} />
            <g transform={`rotate(${tailSway} -122 -240)`}>
              <polygon points={pts(TAIL)} fill={C.objStage} />
              <polygon points={pts(TAIL_LIGHT)} fill={C.objInk2} />
            </g>
            <polygon points={pts(BARREL)} fill={C.objDeep} />
            <polygon points={pts(BARREL_LIGHT)} fill={C.mid} />
            <polygon points={pts(HAUNCH)} fill={C.mid} opacity={0.55} />
            <polygon points={pts(BELLY)} fill={C.objInk2} opacity={0.6} />
            <g transform={`rotate(${headBob} 70 -250)`}>
              <polygon points={pts(MANE2)} fill={C.objInk2} />
              <polygon points={pts(NECK)} fill={C.objDeep} />
              <polygon points={pts(NECK_LIGHT)} fill={C.mid} />
              <polygon points={pts(MANE)} fill={C.objStage} />
              <polygon points={pts(HEAD)} fill={C.objDeep} />
              <polygon points={pts(JAW)} fill={C.objInk2} opacity={0.7} />
              <polygon points={pts(MUZZLE)} fill={C.objInk2} />
              <polygon points={pts([[148, -380], [156, -408], [170, -376]])} fill={C.objDeep} />
              <polygon points={pts(FORELOCK)} fill={C.objStage} />
              <circle cx={190} cy={-346} r={5} fill={C.objStage} />
              <circle cx={191.5} cy={-347.5} r={1.6} fill={C.objWhite} />
              <circle cx={232} cy={-304} r={3} fill={C.objStage} />
            </g>
            <Leg hip={[-84, -170]} p={phi} near l1={84} l2={90} thick={28} />
            <Leg hip={[68, -162]} p={phi + 0.5 * Math.PI} near l1={80} l2={92} thick={24} />
          </g>
        </g>
      </svg>
    </div>
  );
};

// Detail 2 (not rendered while SHOW_TEAM is false): the team window (AionUI style, simplified): sidebar, team header,
// member chips, one column per agent. Kept as it was; it reads cues that the current timeline does not define.

const AVATAR: Record<string, { fill: string; ink: string }> = {
  Arsène: { fill: C.appInkMute, ink: C.appHi },
  Riri: { fill: C.mid, ink: C.appHi },
  Fifi: { fill: C.appTeal, ink: C.appHi },
  Loulou: { fill: C.appNeutral, ink: C.appHi },
  'Mamie Baba': { fill: C.appFill, ink: C.appInkDeep },
};

const Avatar: React.FC<{ m: Member; size?: number }> = ({ m, size = 36 }) => {
  const a = AVATAR[m.name];
  return (
    <div
      style={{
        ...base,
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size / 2,
        background: a.fill,
        color: a.ink,
        fontSize: 16,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      {m.initials}
    </div>
  );
};

/** One chat bubble in a column: the sender's side (mine = right, deep green; theirs = left, light). */
const Msg: React.FC<{ F: number; at: number; mine?: boolean; children: React.ReactNode }> = ({ F, at, mine = false, children }) => (
  <div
    style={{
      alignSelf: mine ? 'flex-end' : 'flex-start',
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: '10px 12px',
      borderRadius: 14,
      background: mine ? C.appInkMute : C.appPage,
      color: mine ? C.appHi : C.appInkDeep,
      fontFamily: FONT.text,
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.3,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      opacity: prog(F, at, at + 24, E.smooth),
      transform: `translate(0px, ${(1 - riseP(F, at)) * 16}px)`,
    }}
  >
    {children}
  </div>
);

/** The message box at the bottom of a column. Arsène's column shows the text typed into it. */
const Input: React.FC<{ F: number; name: string; typing?: { text: string; live: boolean } }> = ({ F, name, typing }) => {
  const { placeholder } = useStrings(STR);
  const text = typing?.text ?? '';
  const live = typing?.live ?? false;
  return (
    <div
      style={{
        ...base,
        left: 12,
        bottom: 12,
        width: COL_W - 24,
        height: INPUT_H,
        overflow: 'hidden',
        padding: '10px 12px',
        borderRadius: 14,
        background: C.appPaper,
        border: `2px solid ${C.appFill}`,
        fontSize: 18,
        fontWeight: 500,
        lineHeight: 1.3,
        whiteSpace: 'normal',
        color: text ? C.appInkDeep : C.appInkFaint,
      }}
    >
      {text || <span style={{ whiteSpace: 'nowrap' }}>{placeholder(name)}</span>}
      {live && <span style={{ display: 'inline-block', width: 2, height: 22, background: C.accentDeep, marginLeft: 2, verticalAlign: 'text-bottom', opacity: Math.round(F) % 30 < 15 ? 1 : 0 }} />}
    </div>
  );
};

export const TeamApp: React.FC<{ F: number; c: (name: string) => number }> = ({ F, c }) => {
  const { APP, ARSENE, CRON, MEMBERS, TASKS, TOM } = useStrings(STR);
  // Typing into Arsène's box: the two typed strings, one after another
  const phases: [string, string, string][] = [
    ['typeA', 'sendA', TOM.ask],
    ['typeB', 'sendB', TOM.a1],
  ];
  let typing: { text: string; live: boolean } = { text: '', live: false };
  for (const [t, s, full] of phases) {
    if (F >= c(t) && F < c(s)) {
      const n = clamp(Math.round(((F - c(t)) * CPS) / 60), 0, full.length);
      typing = { text: full.slice(0, n), live: true };
    }
  }

  // the columns: all the same width, the leader first, side by side with the same gap
  const colX = (i: number) => MAIN_X + i * (COL_W + CARD_GAP);

  return (
    <>
      {/* sidebar: teams and conversations, settings at the bottom */}
      <div style={{ ...base, left: 0, top: 0, width: SIDE_W, height: APP_H, background: C.appBand }}>
        <div style={{ ...base, left: 16, top: 24, fontSize: 18, fontWeight: 600, color: C.appInkMute, whiteSpace: 'nowrap' }}>{APP.teamsLabel}</div>
        <div style={{ ...base, left: 12, top: 56, width: SIDE_W - 24, height: 40, borderRadius: 10, background: C.appInkMute, color: C.appHi, fontSize: 20, fontWeight: 600, padding: '0 12px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          {APP.team}
        </div>
        <div style={{ ...base, left: 16, top: 124, fontSize: 18, fontWeight: 600, color: C.appInkMute, whiteSpace: 'nowrap' }}>{APP.convsLabel}</div>
        <div style={{ ...base, left: 12, top: 156, width: SIDE_W - 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {APP.convs.map((name) => (
            <div key={name} style={{ boxSizing: 'border-box', borderRadius: 10, padding: '7px 12px', fontSize: 20, fontWeight: 500, lineHeight: 1.25, color: C.appInkDeep, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
              {name}
            </div>
          ))}
        </div>
        <div style={{ ...base, left: 12, top: APP_H - 60, width: SIDE_W - 24, height: 34, borderRadius: 10, padding: '0 12px', display: 'flex', alignItems: 'center', fontSize: 20, fontWeight: 500, color: C.appInkDeep, whiteSpace: 'nowrap' }}>
          {APP.settings}
        </div>
      </div>

      {/* the team header and the member chips */}
      <div style={{ ...base, left: MAIN_X, top: 22, fontSize: 30, fontWeight: 700, color: C.appInkDeep, whiteSpace: 'nowrap', lineHeight: 1.2 }}>{APP.header}</div>
      <div style={{ ...base, left: MAIN_X, top: 74, height: 46, display: 'flex', gap: 10, alignItems: 'center' }}>
        {MEMBERS.map((m) => (
          <div
            key={m.name}
            style={{
              ...base,
              position: 'relative',
              height: 46,
              boxSizing: 'border-box',
              padding: '4px 14px 4px 4px',
              borderRadius: 999,
              background: C.appPaper,
              border: `1.5px solid ${C.appFill}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
            }}
          >
            <Avatar m={m} />
            <span style={{ ...base, position: 'relative', fontSize: 20, fontWeight: 600, color: C.appInkDeep }}>{m.name}</span>
            {m.leader && <Crown />}
          </div>
        ))}
      </div>

      {/* one column per agent: name, model chip (logo + name), its thread, its own message box */}
      {MEMBERS.map((m, i) => {
        const x = colX(i);
        const w = COL_W;
        const isArsene = i === 0;
        return (
          <div
            key={m.name}
            style={{
              ...base,
              left: x,
              top: CARD_TOP,
              width: w,
              height: CARD_H,
              borderRadius: 16,
              background: C.appPaper,
              border: `2px solid ${C.appFill}`,
              overflow: 'hidden',
            }}
          >
            <div style={{ ...base, left: 12, top: 14, width: w - 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.appInkDeep, lineHeight: 1.2, whiteSpace: 'normal' }}>{m.name}</div>
              <div
                style={{
                  alignSelf: 'flex-start',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '3px 10px 3px 6px',
                  borderRadius: 999,
                  background: C.appPage,
                  border: `1.5px solid ${C.appFill}`,
                  color: C.appInkMute,
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                <Img src={staticFile(`logos/${m.logo}.svg`)} style={{ width: 22, height: 22, objectFit: 'contain', flex: 'none' }} />
                {m.model}
              </div>
            </div>

            <div style={{ ...base, left: 12, top: 118, width: w - 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isArsene && (
                <>
                  <Msg F={F} at={c('sendA')} mine>{TOM.ask}</Msg>
                  <Msg F={F} at={c('q1')}>{ARSENE.q1}</Msg>
                  <Msg F={F} at={c('sendB')} mine>{TOM.a1}</Msg>
                  <Msg F={F} at={c('ack')}>{ARSENE.ack}</Msg>
                </>
              )}
              {m.name === 'Riri' && <Msg F={F} at={c('riri')}>{TASKS.Riri}</Msg>}
              {m.name === 'Fifi' && <Msg F={F} at={c('fifi')}>{TASKS.Fifi}</Msg>}
              {m.name === 'Loulou' && <Msg F={F} at={c('loulou')}>{TASKS.Loulou}</Msg>}
              {m.name === 'Mamie Baba' && (
                <>
                  <Msg F={F} at={c('mamie')}>{TASKS['Mamie Baba']}</Msg>
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      boxSizing: 'border-box',
                      padding: '6px 10px',
                      borderRadius: 12,
                      background: C.appPaper,
                      border: `1.5px solid ${C.accentDeep}`,
                      color: C.appInkMute,
                      fontSize: 18,
                      fontWeight: 600,
                      lineHeight: 1.25,
                      whiteSpace: 'normal',
                      opacity: prog(F, c('cron'), c('cron') + 24, E.smooth),
                      transform: `translate(0px, ${(1 - riseP(F, c('cron'))) * 12}px)`,
                    }}
                  >
                    {CRON}
                  </div>
                </>
              )}
            </div>

            <Input F={F} name={m.name} typing={isArsene ? typing : undefined} />
          </div>
        );
      })}
    </>
  );
};
