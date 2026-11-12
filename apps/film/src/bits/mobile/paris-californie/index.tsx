import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, typeStyle } from '../../../brand/tokens';
import { Words } from '../../../fx/Words';
import { E, mix, prog, SPR, spr } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import { TILT_PERSPECTIVE, tilt } from '../../../lib/tilt';
import { actOf, CUE, W } from '../../../timeline';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';
import { BrowserWindow } from '../../_shared/ui/BrowserWindow';
import { Quote } from '../../_shared/ui/Quote';
import { HEADLINE_MAX, ILLU_TOP, QUOTE_GAP, QUOTE_SIZE, TEXT_GAP } from '../layout';
import { STR, type Tone } from './copy';

const SLUG = 'paris-californie';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const WIN = { x: 72, y: ILLU_TOP, w: 1120, h: 888 };
const CHROME = 56;
const CANVAS = { w: WIN.w - 6, h: WIN.h - 6 - CHROME };

const COL = 72;
const COPY_W = W - 2 * COL;
const FIT = COPY_W / WIN.w;
const ILL_X = COL;
const WIN_BOTTOM = WIN.y + WIN.h * FIT;
const TEXT_TOP = WIN_BOTTOM + TEXT_GAP;

const PINNED: Record<string, keyof typeof C> = { soft: 'appFill', text: 'appBand' };
const appTone = (t: Tone) => C[PINNED[t] ?? t];

const COL_X = [64, 372, 680];
const COL_W = 284;
const COL_TOP = 180;
const COL_H = 540;
const CARD = { w: 236, h: 92 };
const ROW = 112;
const slot = (col: number, row: number): [number, number] => [COL_X[col] + 24, 244 + row * ROW];
const RETRO = { x: 1080, y: 110, w: 1000, h: 610 };
const ZONE_X = [1104, 1346, 1588, 1830];
const ZONE = { w: 226, y: 180, h: 260 };
const WATER_Y = 508;
const PAN = 1023;

const MOVE_A = { from: slot(0, 0), to: slot(1, 1), grab: [112, 36] as [number, number] };
const MOVE_D = { from: slot(1, 0), to: slot(2, 1), grab: [84, 40] as [number, number] };

const REST_Y = 724;
const S_REST: [number, number] = [800, REST_Y];

const STICKY = (i: number) => {
  const s = STR.fr.STICKIES[i];
  return { x: ZONE_X[s.zone] + 18, y: 262 };
};
const centre = (i: number): [number, number] => [STICKY(i).x + 95, STICKY(i).y + 60];

const DOT = [
  { x: 162, y: 22 },
  { x: 132, y: 22 },
];

const dotAt = (i: number, s: number): [number, number] => {
  const { x, y } = STICKY(i);
  const r = (STR.fr.STICKIES[i].rot * Math.PI) / 180;
  const dx = DOT[s].x - 95;
  const dy = DOT[s].y - 60;
  return [x + 95 + dx * Math.cos(r) - dy * Math.sin(r), y + 60 + dx * Math.sin(r) + dy * Math.cos(r)];
};

const VOTES: { sticky: number; slot: number; cue: string }[] = [
  { sticky: 0, slot: 0, cue: 'sVote1' },
  { sticky: 1, slot: 0, cue: 'pVote1' },
  { sticky: 2, slot: 0, cue: 'sVote2' },
];

const STICKY_CUE = ['stA', 'stB', 'pan', 'pan'];

const WAVES = (y: number, amp: number) => {
  let d = `M1080 ${y}`;
  for (let x = 1080; x < 2080; x += 50) d += ` q25 ${-amp} 50 0`;
  return d;
};

const lerp = (a: number, b: number, t: number) => mix(a, b, t);

const keyed = (F: number, keys: [number, number, number][]): [number, number] => {
  if (F <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0] = keys[i];
    const [t1, x1, y1] = keys[i + 1];
    if (F < t1) {
      const t = prog(F, t0, t1, E.glide);
      return [lerp(x0, x1, t), lerp(y0, y1, t)];
    }
  }
  const last = keys[keys.length - 1];
  return [last[1], last[2]];
};

const Card: React.FC<{ x: number; y: number; title: string[]; tone: Tone; lift: number }> = ({ x, y, title, tone, lift }) => (
  <g transform={`translate(${x} ${y - 4 * lift})`}>
    <rect x={0} y={6 * lift} width={CARD.w} height={CARD.h} rx={14} fill={C.appInk} opacity={0.18 * lift} />
    <rect x={0} y={0} width={CARD.w} height={CARD.h} rx={14} fill={C.appPage} />
    <rect x={0} y={0} width={8} height={CARD.h} rx={4} fill={appTone(tone)} />
    {title.map((t, i) => (
      <text key={i} x={24} y={56 - 14 * (title.length - 1) + 28 * i} fontFamily={FONT.text} fontSize={24} fontWeight={600} fill={C.appInk}>
        {t}
      </text>
    ))}
  </g>
);

const Sticky: React.FC<{ i: number; F: number; t: number; votes: { slot: number; at: number }[] }> = ({ i, F, t, votes }) => {
  const { STICKIES } = useStrings(STR);
  const s = STICKIES[i];
  const { x, y } = STICKY(i);
  const k = prog(F, t, t + 12, E.out);
  const sc = 0.72 + 0.28 * spr(F, t, SPR.firm);
  return (
    <g opacity={k} transform={`translate(${x + 95} ${y + 60}) rotate(${s.rot}) scale(${sc}) translate(-95 -60)`}>
      <rect x={0} y={6} width={190} height={120} rx={6} fill={C.appInk} opacity={0.18} />
      <rect x={0} y={0} width={190} height={120} rx={6} fill={appTone(s.tone)} />
      <text x={20} y={52} fontFamily={FONT.text} fontSize={20} fontWeight={600} fill={C.appInk}>
        {s.lines[0]}
      </text>
      <text x={20} y={78} fontFamily={FONT.text} fontSize={20} fontWeight={600} fill={C.appInk}>
        {s.lines[1]}
      </text>
      {votes.map((v) => {
        const d = prog(F, v.at, v.at + 12, E.out);
        return <circle key={v.slot} cx={DOT[v.slot].x} cy={DOT[v.slot].y} r={11 * d} fill={C.accentDeep} opacity={d} />;
      })}
    </g>
  );
};

const Cursor: React.FC<{ x: number; y: number; screenX: number; tag: { name: string; sub: string }; fill: string; opacity: number }> = ({ x, y, screenX, tag, fill, opacity }) => {
  const tagW = tagWidth(tag);
  const tagH = 66;
  const left = screenX + 26 + tagW > CANVAS.w - 12;
  const tagX = left ? -6 - tagW : 26;
  const cx = tagX + tagW / 2;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <g transform="scale(1.1)">
        <path d="M3 2 L3 33 L10.2 26.4 L15 38 L20.2 35.8 L15.4 24.4 L25 24.4 Z" fill={C.appInk} stroke={C.appHi} strokeWidth={2.4} strokeLinejoin="round" />
      </g>
      <rect x={tagX} y={30} width={tagW} height={tagH} rx={22} fill={fill} />
      <text x={cx} y={58} textAnchor="middle" fontFamily={FONT.text} fontSize={24} fontWeight={700} fill={C.appHi}>
        {tag.name}
      </text>
      <text x={cx} y={84} textAnchor="middle" fontFamily={FONT.text} fontSize={18} fontWeight={500} fill={C.appHi} opacity={0.85}>
        {tag.sub}
      </text>
    </g>
  );
};

const motion = (F: number) => {

  const sway = 16 * Math.sin((2 * Math.PI * (F - K('panEnd'))) / 540) * prog(F, K('panEnd'), K('panEnd') + 60, E.smooth);
  const tx = -PAN * prog(F, K('pan'), K('panEnd'), E.cam) + sway;

  const pA = prog(F, K('pGrab'), K('pDrop'), E.inOut);

  const up = (start: number) => -ROW * prog(F, start, start + 24, E.smooth);
  const aX = lerp(MOVE_A.from[0], MOVE_A.to[0], pA);
  const aY = lerp(MOVE_A.from[1], MOVE_A.to[1], pA) - 36 * Math.sin(Math.PI * pA) + up(K('sDrag'));
  const liftA = prog(F, K('pGrab'), K('pGrab') + 8, E.out) - prog(F, K('pDrop'), K('pDrop') + 12, E.out);
  const pD = prog(F, K('sDrag'), K('sDrop'), E.inOut);
  const dX = lerp(MOVE_D.from[0], MOVE_D.to[0], pD);
  const dY = lerp(MOVE_D.from[1], MOVE_D.to[1], pD) - 36 * Math.sin(Math.PI * pD);
  const liftD = prog(F, K('sDrag'), K('sDrag') + 8, E.out) - prog(F, K('sDrop'), K('sDrop') + 12, E.out);
  const colUp = up(K('pGrab'));

  const pStart: [number, number] = [520, REST_Y];
  const pGrab: [number, number] = [MOVE_A.from[0] + MOVE_A.grab[0], MOVE_A.from[1] + MOVE_A.grab[1]];

  const pHold: [number, number] = [MOVE_A.to[0] + MOVE_A.grab[0], MOVE_A.to[1] + MOVE_A.grab[1]];
  const pAt = (): [number, number] => {
    if (F < K('pGrab')) {
      const t = prog(F, K('pApproach'), K('pGrab'), E.glide);
      return [lerp(pStart[0], pGrab[0], t), lerp(pStart[1], pGrab[1], t)];
    }
    if (F < K('pDrop')) return [aX + MOVE_A.grab[0], aY + MOVE_A.grab[1]];

    const [c0x, c0y] = centre(0);
    const [d1x, d1y] = dotAt(1, 0);
    return keyed(F, [
      [K('pDrop'), pHold[0], pHold[1]],
      [K('pDown1'), pHold[0], pHold[1]],
      [K('pDownEnd1'), pHold[0], REST_Y],
      [K('pFly'), pHold[0], REST_Y],
      [K('stA'), c0x, c0y],
      [K('pDown2'), c0x, c0y],
      [K('pDownEnd2'), c0x, REST_Y],
      [K('pGo1'), c0x, REST_Y],
      [K('pArr1'), d1x, d1y],
      [K('pDown3'), d1x, d1y],
      [K('pDownEnd3'), d1x, REST_Y],
    ]);
  };
  const sStart: [number, number] = [1040, REST_Y];
  const sGrab: [number, number] = [MOVE_D.from[0] + MOVE_D.grab[0], MOVE_D.from[1] + MOVE_D.grab[1]];
  const sDrop: [number, number] = [MOVE_D.to[0] + MOVE_D.grab[0], MOVE_D.to[1] + MOVE_D.grab[1]];
  const sAt = (): [number, number] => {
    if (F < K('sGrab')) {
      const t = prog(F, K('sApproach'), K('sGrab'), E.glide);
      return [lerp(sStart[0], sGrab[0], t), lerp(sStart[1], sGrab[1], t)];
    }
    if (F < K('sAway')) return [dX + MOVE_D.grab[0], dY + MOVE_D.grab[1]];
    if (F < K('sFly')) return keyed(F, [[K('sAway'), ...sDrop], [K('sAwayEnd'), ...S_REST]]);
    const [c1x, c1y] = centre(1);
    if (F < K('stB')) {

      const tX = prog(F, K('sFly'), K('stB') - 18, E.glide);
      const tY = prog(F, K('sFly') + 18, K('stB'), E.glide);
      return [lerp(S_REST[0], c1x, tX), lerp(S_REST[1], c1y, tY)];
    }
    const [d0x, d0y] = dotAt(0, 0);
    const [d2x, d2y] = dotAt(2, 0);
    return keyed(F, [
      [K('stB'), c1x, c1y],
      [K('sDown2'), c1x, c1y],
      [K('sDownEnd2'), c1x, REST_Y],
      [K('sGo1'), c1x, REST_Y],
      [K('sArr1'), d0x, d0y],
      [K('sDown3'), d0x, d0y],
      [K('sDownEnd3'), d0x, REST_Y],
      [K('sGo2'), d0x, REST_Y],
      [K('sArr2'), d2x, d2y],
      [K('sDown4'), d2x, d2y],
      [K('sDownEnd4'), d2x, REST_Y],
    ]);
  };

  const inWindow = (wx: number, lo: number) => Math.min(Math.max(wx + tx, lo), CANVAS.w - 40) - tx;
  const [px0, py] = pAt();
  const [sx0, sy] = sAt();
  return { tx, aX, aY, liftA, dX, dY, liftD, colUp, px: inWindow(px0, 40), py, sx: inWindow(sx0, 260), sy };
};

const tagWidth = (tag: { name: string; sub: string }) => Math.max(tag.name.length * 14 + 0, tag.sub.length * 10.4) + 36;

const Bit: React.FC<BitProps> = () => {
  const { LABELS, CARDS, STICKIES, LINE, PERSON, QUOTES } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;

  const { tx, aX, aY, liftA, dX, dY, liftD, colUp, px, py, sx, sy } = motion(F);
  const curOp = 1;

  const bob = Math.sin(F / 16) * 3;

  const cards = CARDS.map((c) => {
    if (c.id === 'login') return <Card key={c.id} x={aX} y={aY} title={c.title} tone={c.tone} lift={liftA} />;
    if (c.id === 'orders') return <Card key={c.id} x={dX} y={dY} title={c.title} tone={c.tone} lift={liftD} />;
    const [x, y] = slot(c.col, c.row);

    const dy = c.col === 0 ? colUp : 0;
    return <Card key={c.id} x={x} y={y + dy} title={c.title} tone={c.tone} lift={0} />;
  });

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: WIN.w, height: WIN.h, transformOrigin: '0 0', transform: `translate(${ILL_X}px, ${WIN.y}px) scale(${FIT})`, perspective: TILT_PERSPECTIVE }}>

      <div style={{ position: 'absolute', left: 0, top: 0, width: WIN.w, height: WIN.h, ...tilt(F) }}>
      <BrowserWindow x={0} y={0} w={WIN.w} h={WIN.h} r={18} chromeH={CHROME} url={LABELS.url}>
        <svg width={CANVAS.w} height={CANVAS.h} viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`} style={{ position: 'absolute', left: 0, top: CHROME }}>
          <defs>
            <pattern id="paris-dots" width={32} height={32} patternUnits="userSpaceOnUse">
              <circle cx={2} cy={2} r={2} fill={C.appBand} />
            </pattern>
          </defs>

          <g transform={`translate(${tx} 0)`}>
            <rect x={-400} y={-200} width={3400} height={1200} fill="url(#paris-dots)" />

            <text x={COL_X[0]} y={150} fontFamily={FONT.text} fontSize={26} fontWeight={700} fill={C.appInk}>
              {LABELS.kanbanTitle}
            </text>
            {LABELS.columns.map((name, i) => (
              <g key={name}>
                <rect x={COL_X[i]} y={COL_TOP} width={COL_W} height={COL_H} rx={18} fill={C.appPaper} />
                <text x={COL_X[i] + 24} y={COL_TOP + 40} fontFamily={FONT.text} fontSize={26} fontWeight={700} fill={C.appInk}>
                  {name}
                </text>
              </g>
            ))}
            {cards}

            <g opacity={prog(F, K('pan'), K('pan') + 12, E.out)}>
            <rect x={RETRO.x} y={RETRO.y} width={RETRO.w} height={RETRO.h} rx={24} fill={C.appPaper} />
            <text x={ZONE_X[0]} y={150} fontFamily={FONT.text} fontSize={26} fontWeight={700} fill={C.appInk}>
              {LABELS.retroTitle}
            </text>
            {LABELS.zones.map((name, i) => (
              <g key={name}>
                <rect x={ZONE_X[i]} y={ZONE.y} width={ZONE.w} height={ZONE.h} rx={18} fill={C.appPage} />
                <text x={ZONE_X[i] + 20} y={ZONE.y + 42} fontFamily={FONT.text} fontSize={26} fontWeight={700} fill={C.appInk}>
                  {name}
                </text>
              </g>
            ))}
            <rect x={RETRO.x} y={WATER_Y} width={RETRO.w} height={RETRO.y + RETRO.h - WATER_Y} rx={24} fill={C.appBand} />
            <path d={WAVES(WATER_Y + 36, 8)} fill="none" stroke={C.mid} strokeWidth={3} opacity={0.6} />
            <path d={WAVES(WATER_Y + 84, 8)} fill="none" stroke={C.mid} strokeWidth={3} opacity={0.6} />

            <path d="M1880 508 Q1950 448 2020 508 Z" fill={C.appInkMute} />
            <g transform={`translate(0 ${bob})`}>
              <rect x={1630} y={336} width={6} height={172} fill={C.appInk} />
              <path d="M1636 344 L1636 504 L1726 504 Z" fill={C.appInkMute} />
              <path d="M1628 356 L1566 504 L1628 504 Z" fill={C.mid} />
              <path d="M1500 508 L1760 508 L1722 552 L1538 552 Z" fill={C.appInk} />
            </g>
            </g>

            {STICKIES.map((_, i) => (
              <Sticky
                key={i}
                i={i}
                F={F}
                t={K(STICKY_CUE[i])}
                votes={VOTES.filter((v) => v.sticky === i).map((v) => ({ slot: v.slot, at: K(v.cue) }))}
              />
            ))}

            <Cursor x={px} y={py} screenX={px + tx} tag={LABELS.tags.paris} fill={C.appInkMute} opacity={curOp} />
            <Cursor x={sx} y={sy} screenX={sx + tx} tag={LABELS.tags.sanFrancisco} fill={C.appInk} opacity={curOp} />
          </g>

          <rect x={24} y={14} width={232} height={48} rx={24} fill={C.appPaper} />
          {[52, 94, 136].map((x) => (
            <rect key={x} x={x} y={27} width={22} height={22} rx={6} fill={C.mid} />
          ))}
          <circle cx={1000} cy={38} r={22} fill={C.appInk} />
          <text x={1000} y={46} textAnchor="middle" fontFamily={FONT.text} fontSize={22} fontWeight={700} fill={C.appHi}>
            {LABELS.avatars[1]}
          </text>
          <circle cx={1056} cy={38} r={22} fill={C.appInkMute} />
          <text x={1056} y={46} textAnchor="middle" fontFamily={FONT.text} fontSize={22} fontWeight={700} fill={C.appHi}>
            {LABELS.avatars[0]}
          </text>
        </svg>
      </BrowserWindow>
      </div>
      </div>

      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${COL}px, ${TEXT_TOP}px)`, width: COPY_W }}>
        <Words
          text={LINE}
          frame={F}
          start={K('line')}
          id={`${SLUG}.line`}
          size={HEADLINE_MAX}
          out={K('box')}
          style={{ ...typeStyle('display', HEADLINE_MAX), color: C.bright, flexWrap: 'wrap', whiteSpace: 'normal', width: COPY_W, columnGap: '0.27em' }}
        />
      </div>

      <Quote
        photo={PERSON.photo}
        name={PERSON.name}
        title={PERSON.role}
        sentences={QUOTES}
        times={[K('q1'), K('q2')]}
        F={F}
        at={K('box')}
        x={COL}
        y={WIN_BOTTOM + QUOTE_GAP}
        w={COPY_W}
        size={QUOTE_SIZE}
      />
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;
  const ev: SoundEvent[] = [];
  ev.push(sfx('text', K('line') + 6, 'line', { weight: 0.8 }));
  ev.push(sfx('mouse', K('pGrab'), 'paris-grab', { pan: 0.2 }));
  ev.push(sfx('latch', K('pDrop'), 'paris-drop', { pan: -0.1 }));
  ev.push(sfx('mouse', K('sGrab'), 'sf-grab', { pan: 0.3 }));
  ev.push(sfx('latch', K('sDrop'), 'sf-drop', { pan: 0.2 }));
  ev.push(sfx('camera', (K('pan') + K('panEnd')) / 2, 'pan', { weight: 1, apexFrac: 0.5 }));
  ev.push(sfx('item', K('pan') + 12, 'retro-notes', { weight: 0.6 }));
  ev.push(sfx('item', K('stA') + 3, 'sticky-a', { weight: 0.8, pan: -0.2 }));
  ev.push(sfx('item', K('stB') + 3, 'sticky-b', { weight: 0.8, pan: 0.2 }));
  ['sVote1', 'pVote1', 'sVote2'].forEach((n) => ev.push(sfx('item', K(n) + 3, n, { weight: 0.7 })));
  ev.push(sfx('text', K('q1') + 8, 'quote1'));
  ev.push(sfx('text', K('q2') + 8, 'quote2'));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
