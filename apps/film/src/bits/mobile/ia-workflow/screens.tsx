import React from 'react';
import { C, FONT } from '../../../brand/tokens';
import { Cursor, cursorArc, pressAt } from '../../../fx/Cursor';
import { E, fd, prog } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import { measureTracked } from '../../../lib/measure';
import { STR } from './copy';
import { STRIDE, streamFrames } from './timeline';

const base: React.CSSProperties = { position: 'absolute', boxSizing: 'border-box', fontFamily: FONT.text };

export const CHAT_W = 760;

const CHAT_FADE = 130;
const ITEM_GAP = 16;

const BUB_SIZE = 28;
const BUB_WEIGHT = 500;
const BUB_LEAD = 36;
const BUB_PAD_X = 24;
const BUB_PAD_Y = 14;
const BUB_TEXT_W = 540;

const SYS_H = 40;
const SYS_SIZE = 24;

const QCARD_W = 520;
const QCARD_PAD = 22;
const QTITLE_LEAD = 36;
const QTITLE_GAP = 16;
const BTN_H = 54;
const BTN_GAP = 10;

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

const SysRow: React.FC<{ F: number; done: number; label: string }> = ({ F, done, label }) => (
  <div style={{ height: SYS_H, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 4, color: C.appInkFaint, fontFamily: FONT.text, fontSize: SYS_SIZE, fontWeight: 500, whiteSpace: 'nowrap' }}>
    {F >= done ? <Check /> : <Spinner F={F} />}
    {label}
  </div>
);

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
      const before = lines.slice(0, i).reduce((n, x) => n + x.length + 1, 0);
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

const QCard: React.FC<{ F: number; at: number; hover: number; pick: number; title: string; options: string[]; picked: number }> = ({ F, at, pick, title, options, picked }) => (
  <div style={{ boxSizing: 'border-box', width: QCARD_W, padding: QCARD_PAD, borderRadius: 20, background: C.appPage, fontFamily: FONT.text }}>
    <div style={{ height: QTITLE_LEAD, lineHeight: `${QTITLE_LEAD}px`, fontSize: 28, fontWeight: 700, color: C.appInkDeep, whiteSpace: 'nowrap' }}>{title}</div>
    <div style={{ marginTop: QTITLE_GAP, display: 'flex', flexDirection: 'column', gap: BTN_GAP }}>
      {options.map((o, i) => {
        const isPick = i === picked;
        const free = i === options.length - 1;
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

export const ChatColumn: React.FC<{ F: number; c: (name: string) => number; x: number; top: number; bottom: number }> = ({ F, c, x, top, bottom }) => {
  const h = bottom - top;
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

  const tops: number[] = [];
  let below = 0;
  for (let i = items.length - 1; i >= 0; i--) {
    tops[i] = h - heights[i] - below;
    below += (heights[i] + ITEM_GAP) * shown[i];
  }

  let cur: { x: number; y: number; op: number; press: number } | null = null;
  items.forEach((it, i) => {
    if (it.kind !== 'card' || F < it.hover || F > it.pick + 30) return;
    const bx = x + QCARD_PAD + 140;
    const by = top + tops[i] + QCARD_PAD + QTITLE_LEAD + QTITLE_GAP + it.picked * (BTN_H + BTN_GAP) + BTN_H / 2;
    const a = cursorArc({ x: x + CHAT_W - 40, y: bottom - 30 }, { x: bx, y: by }, prog(F, it.hover, it.pick - 9, E.glide));
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
        top,
        width: CHAT_W,
        height: h,
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

const IDE_CHROME = 56;
export const IDE_H = IDE_CHROME + 6 + 2 * CODE_PAD + CODE.length * CODE_LEAD;

export const Ide: React.FC<{ F: number; c: (name: string) => number }> = ({ F, c }) => {
  const ideIn = c('ideIn');
  const fix = c('fix');
  const fixed = fd(F) >= fix;
  const tint = prog(F, fix - 1, fix + 9) * (1 - 0.6 * prog(F, c('fixFade'), c('fixFade') + 40, E.smooth));

  const mono = (s: string) => measureTracked(s, CODE_SIZE, CODE_WEIGHT, 0, FONT.mono);
  const lineY = IDE_CHROME + CODE_PAD + BAD * CODE_LEAD + CODE_LEAD / 2;

  const PRE = 'function step(';
  const SEL = 'horse: any, dt: any';
  const x0 = CODE_X + mono(PRE);
  const land = c('cursorIn') + 36;
  const arc = cursorArc({ x: IDE_W - 70, y: IDE_H - 20 }, { x: x0, y: lineY + 8 }, prog(F, c('cursorIn'), land, E.glide));

  const xFull = CODE_X + mono(PRE + SEL);
  const xCur = x0 + (xFull - x0) * prog(F, c('selStart'), c('selEnd'), E.smooth);
  let nSel = 0;
  while (nSel < SEL.length && CODE_X + mono(PRE + SEL.slice(0, nSel + 1)) - mono(SEL[nSel]) / 2 <= xCur) nSel++;
  const cur = F < c('selStart') ? arc : { x: xCur, y: lineY + 8 };
  const selOp = nSel > 0 ? 1 - prog(F, c('fix') - 1, c('fix') + 9) : 0;
  const curOp = prog(F, c('cursorIn'), c('cursorIn') + 12, E.smooth) * (1 - prog(F, c('eslint'), c('eslint') + 18, E.smooth));

  return (
    <div style={{ ...base, left: 0, top: 0, width: IDE_W, height: IDE_H, overflow: 'hidden', borderRadius: 18, border: `3px solid ${C.appEdge}`, background: C.appPage }}>

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

export const HORSE_W = 828;
export const HORSE_H = 500;
const SW = HORSE_W - 6;
const SH = HORSE_H - 6;
const HORIZON = 250;

type P2 = [number, number];
const pts = (p: P2[]) => p.map(([x, y]) => `${x},${y}`).join(' ');

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

const Leg: React.FC<{ hip: P2; p: number; near: boolean; l1: number; l2: number; thick: number }> = ({ hip, p, near, l1, l2, thick }) => {
  const u = 0.3 * Math.sin(p);
  const k = -0.9 * Math.max(0, Math.cos(p));
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
  const phi = (2 * Math.PI * t) / (2 * STRIDE);
  const bob = -2.5 * (1 - Math.cos(2 * phi));
  const headBob = 2 * Math.sin(phi + 0.9);
  const tailSway = 4 * Math.sin(phi + 1.8);

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
