import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, HEADLINE_LEAD, TYPE, typeStyle } from '../../brand/tokens';
import { measureTracked } from '../../lib/measure';
import { chainFrames } from '../../fx/Chain';
import { Words } from '../../fx/Words';
import { clamp, E, mix, pace as filmPace, prog, rand, SPR, spr } from '../../lib/anim';
import { mixColor } from '../../lib/color';
import { useLocale, useStrings } from '../../lib/i18n';
import { tilt, TILT_PERSPECTIVE } from '../../lib/tilt';
import { actOf, CUE, chainOf, f60, H, W } from '../../timeline';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';
import { BrowserWindow } from '../_shared/ui/BrowserWindow';
import { DeviceFrame } from '../_shared/ui/DeviceFrame';
import { ExperienceCard } from '../_shared/ui/ExperienceCard';
import { STR } from './copy';
import { EVENT_TONES, PRESENT_BASE } from './data';

const SLUG = 'arep-checkin';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// What a seed changes: which of guests 1 and 3 is tapped in on the desk (the other one on the
// phone; the tablet always taps guest 2), and which event is open. Seed 1 = guest 1 (DUBOIS) on the
// desk and the first event (Conférence Atlas).
const deskGuest = (seed: number) => (seed === 1 ? 1 : rand(`${SLUG}:${seed}:desk`) < 0.5 ? 1 : 3);
const tabletGuest = 2;
const phoneGuest = (seed: number) => (deskGuest(seed) === 1 ? 3 : 1);
const eventOf = (seed: number) => (seed === 1 ? 0 : Math.floor(rand(`${SLUG}:${seed}:event`) * STR.fr.events.length));

// Devices, as screen rects in frame px. The left/right round robin: the headline is on the RIGHT, so
// the illustration's zone is x 96-1150, y 80-1000, centred on x 623, y 540 (the rects moved 674 px left).
// The desktop window is 1000 px wide; the tablet body is 704 x 920 (its 28 px bezel around the 648 x 864
// screen); the phone body is 420 x 860 (its 14 px bezel around 392 x 832).
const DESK = { x: 123, y: 130, w: 1000, h: 820, r: 18, pad: 0 };
const TAB = { x: 299, y: 108, w: 648, h: 864, r: 36, pad: 28 };
const PHN = { x: 427, y: 124, w: 392, h: 832, r: 52, pad: 14 };
const CHROME = 56; // the browser chrome above the desktop app (window coordinates)
const SB_W = 220; // the desktop sidebar's width
const SCROLL = 56; // how far the phone's list scrolls
const MORPH = 54; // frames per morph (0.9 s): desktop -> tablet, then tablet -> phone

// Copy column: the text column on the RIGHT (x 1250-1824). The headline and the experience card are
// one combo, scaled from the card's own width (ExperienceCard default, 700 px) down to the column's 574 px.
const COL_X = 1250;
const COL_W = 574;
const CARD_W = 700;
const COMBO_K = COL_W / CARD_W;
const HEAD_SIZE = 88; // the display role's size before the combo scale
const HEAD_W = CARD_W; // the headline wraps inside the card's width, so the combo stays one column
const HEAD_GAP = 52; // headline to card, before the scale: 52 x 0.82 = 43 px on screen (detail gap rule: >= 40)
const CARD_H = 210; // the experience card's height before the scale (ExperienceCard default)
/** Lines the headline takes in its column: a greedy word wrap measured with the display face (as the browser wraps). */
const headLines = (text: string) => {
  const space = measureTracked(' ', HEAD_SIZE, TYPE.display.weight, TYPE.display.track);
  let lines = 1;
  let w = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const ww = measureTracked(word, HEAD_SIZE, TYPE.display.weight, TYPE.display.track);
    if (w > 0 && w + space + ww > HEAD_W) {
      lines++;
      w = ww;
    } else w += (w > 0 ? space : 0) + ww;
  }
  return lines;
};

const txt = (size: number, weight: number, color: string): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.2,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'pre',
});

// Icons for the round buttons: menu (the hamburger on tablet and phone), settings, filter, sort.
const ICONS: React.ReactNode[] = [
  <path key="menu" d="M4 7h16M4 12h16M4 17h16" />,
  <g key="set">
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
  </g>,
  <path key="flt" d="M4 5h16l-6 8v6l-4 2v-8z" />,
  <path key="srt" d="M8 4v16M4 16l4 4 4-4M16 20V4M12 8l4-4 4 4" />,
];

const AVATAR = { mid: C.mid, deep: C.appInkMute, teal: C.appTeal, neutral: C.appNeutral } as const;

const Bit: React.FC<BitProps> = ({ seed }) => {
  const locale = useLocale();
  const S = useStrings(STR);
  // The bit's strings, under the names the picture uses (guests, events, labels, status, subpages, experience).
  const { guests: GUESTS, events: EVENTS, labels: LABELS, status: STATUS, subpages: SUBPAGES, experience: EXPERIENCE } = S;
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute
  const Fd = Math.round(F);
  const ev = EVENTS[eventOf(seed)];

  // The two morphs: t1 desktop -> tablet, t2 tablet -> phone. Every number goes D -> T -> P.
  const t1 = prog(F, K('tab'), K('tab') + MORPH, E.inOut);
  const t2 = prog(F, K('ph'), K('ph') + MORPH, E.inOut);
  const V = (d: number, t: number, p: number) => mix(mix(d, t, t1), p, t2);

  // Window and device body
  const ww = V(DESK.w, TAB.w, PHN.w);
  const wh = V(DESK.h, TAB.h, PHN.h);
  const wx = V(DESK.x, TAB.x, PHN.x);
  const wy = V(DESK.y, TAB.y, PHN.y);
  const wr = V(DESK.r, TAB.r, PHN.r);
  const pad = V(DESK.pad, TAB.pad, PHN.pad);
  const bezelOp = clamp(t1 * 1.6);
  const chromeOp = 1 - clamp(t1 * 1.5);
  const borderW = V(3, 0, 0);
  const notchOp = clamp((t2 - 0.6) / 0.4);
  const sbW = V(SB_W, 0, 0); // desktop: full sidebar; tablet and phone: none
  const sbTop = V(CHROME, 0, 0);

  // Page grid (window coordinates; the desktop's app starts under the chrome at y 56)
  const cx0 = V(252, 40, 24); // content left
  const cx1 = V(968, 608, 368); // content right
  const LW = cx1 - cx0; // content width: 716 / 568 / 344
  const headY = V(80, 40, 56); // title block top
  const titleX = V(252, 96, 80); // the title sits after the hamburger on tablet and phone
  const iconS = V(36, 44, 44); // round toolbar buttons
  const iconG = V(8, 10, 10);
  const iconY = V(88, 44, 69);
  const hamY = V(88, 50, 73);
  const hamOp = clamp(t1 * 1.6);
  const countY = V(118, 118, 146); // « présents » line: tablet and phone only
  const searchY = V(240, 150, 178);
  const searchH = V(40, 52, 52);
  const searchR = V(10, 26, 26);
  const searchPad = V(14, 20, 20);
  const searchIcon = V(16, 20, 20);
  const listY = V(324, 224, 244);
  const listH = V(476, 616, 572);
  const listR = V(12, 18, 22);

  // Guest rows (inside the list card, which clips them)
  const rowH = V(56, 76, 76);
  const bandW = V(6, 52, 44); // the status band: a slim stripe on the desktop, a check band on the devices
  const chkS = V(22, 28, 30);
  const avS = V(36, 44, 48);
  const avX = V(20, 68, 60);
  const avY = (rowH - avS) / 2;
  const nameX = V(70, 126, 122);
  const nameY = V(10, 18, 16);
  const nameSize = V(15, 17, 19);
  const metaY = V(30, 40, 41);
  const metaSize = V(13, 15, 16);
  const vipX = V(330, 500, 272);
  const vipW = V(44, 52, 56);
  const vipH = V(20, 22, 24);
  const vipY = V(18, 18, 16); // on the name line on the devices, so the long table note never runs under it
  const COMPANY_X = 384; // desktop columns
  const STATUS_X = 572;
  const PILL_W = 124;
  const PILL_H = 26;
  const tapX = V(634, 26, 22); // where a tap lands: the status pill (desktop) or the band (devices)
  const scroll = -SCROLL * prog(F, K('scroll'), K('scroll') + 36, E.inOut) * t2;
  const rowY = (i: number) => i * rowH + scroll;

  // Taps: each check-in is a tap (ripple), then the band flips and the count ticks.
  const taps = [
    { cue: K('tapA'), i: deskGuest(seed) },
    { cue: K('tapB'), i: tabletGuest },
    { cue: K('tapC'), i: phoneGuest(seed) },
  ];
  const tapped = (i: number) => taps.find((t) => t.i === i);
  const done = taps.filter((t) => Fd >= t.cue).length;
  const present = PRESENT_BASE + done;

  const rows = GUESTS.map((g, i) => {
    const t = tapped(i);
    const relax = t ? prog(F, t.cue, t.cue + 18, E.ui) : g.arrived ? 1 : 0;
    const pop = t ? spr(F, t.cue, SPR.firm) : 1;
    const chkOp = relax * clamp(t1 * 1.6); // the check shows on the devices only
    const pillBase: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: PILL_W,
      height: PILL_H,
      borderRadius: PILL_H / 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: FONT.text,
      fontSize: 13,
      fontWeight: 700,
      whiteSpace: 'pre',
      transform: `translate(${STATUS_X}px, ${(rowH - PILL_H) / 2}px)`,
    };
    const dot = (color: string): React.CSSProperties => ({ width: 8, height: 8, borderRadius: 4, background: color, flex: 'none' });
    return (
      <div
        key={g.name}
        style={{ position: 'absolute', left: 0, top: 0, width: LW, height: rowH, transform: `translate(0px, ${rowY(i)}px)` }}
      >
        {/* status band: the pending colour, with the present colour faded over it (no tint through olive) */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: bandW, height: '100%', background: C.pendingRed }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: bandW, height: '100%', background: C.accentDeep, opacity: relax }} />
        <svg
          width={chkS}
          height={chkS}
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: chkOp,
            transform: `translate(${(bandW - chkS) / 2}px, ${(rowH - chkS) / 2}px) scale(${pop})`,
          }}
        >
          <path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke={C.appHi} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* divider under the row */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: LW - bandW, height: 1.5, background: C.appPage, transform: `translate(${bandW}px, ${rowH - 1.5}px)` }} />
        {/* avatar, name, the table and guest note (every screen) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: avS,
            height: avS,
            borderRadius: '50%',
            background: AVATAR[g.avatar],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.appHi,
            fontFamily: FONT.text,
            fontSize: V(13, 15, 17),
            fontWeight: 800,
            transform: `translate(${avX}px, ${avY}px)`,
          }}
        >
          {g.initials}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${nameX}px, ${nameY}px)`, ...txt(nameSize, 700, C.appInk) }}>{g.name}</div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${nameX}px, ${metaY}px)`, ...txt(metaSize, 400, C.mid) }}>{g.note}</div>
        {g.vip && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: vipW,
              height: vipH,
              borderRadius: vipH / 2,
              background: C.appInk,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.text,
              fontSize: V(11, 12, 13),
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: C.accent,
              transform: `translate(${vipX}px, ${vipY}px)`,
            }}
          >
            {LABELS.vip}
          </div>
        )}
        {/* desktop columns: the company and its role, and the status pill (two layers, crossfaded) */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${COMPANY_X}px, ${nameY}px)`, opacity: 1 - t1, ...txt(15, 600, C.appInk) }}>
          {g.company}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${COMPANY_X}px, ${metaY}px)`, opacity: 1 - t1, ...txt(13, 400, C.mid) }}>
          {g.role}
        </div>
        <div style={{ ...pillBase, background: C.appPage, color: C.appInkMute, opacity: (1 - relax) * (1 - t1) }}>
          <span style={dot(C.pendingRed)} />
          {STATUS.pending}
        </div>
        <div style={{ ...pillBase, background: C.appInkMute, color: C.appHi, opacity: relax * (1 - t1) }}>
          <span style={dot(C.accent)} />
          {STATUS.present}
        </div>
      </div>
    );
  });

  // Tap ripples: a soft circle under each tapped row, on its frame (inside the clipped list).
  const ripples = taps.map((t, k) => {
    if (Fd < t.cue) return null;
    const p = prog(F, t.cue, t.cue + 30, E.out);
    const r = mix(12, 40, p);
    const cx = tapX;
    const cy = rowY(t.i) + rowH / 2;
    return (
      <div
        key={k}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 2 * r,
          height: 2 * r,
          borderRadius: '50%',
          background: C.mid,
          opacity: 0.35 * (1 - p),
          transform: `translate(${cx - r}px, ${cy - r}px)`,
        }}
      />
    );
  });

  // Sidebar (desktop): the event list, the open event's sub-pages. It slides away on the tablet.
  const sbRows: React.ReactNode[] = [];
  let y = 64;
  EVENTS.forEach((e, idx) => {
    const on = idx === eventOf(seed);
    sbRows.push(
      <div
        key={`ev${idx}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 200,
          height: 52,
          boxSizing: 'border-box',
          borderRadius: 12,
          background: on ? C.appPaper : undefined,
          transform: `translate(10px, ${y}px)`,
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: 10, height: 10, borderRadius: 5, background: C[EVENT_TONES[idx]], transform: 'translate(14px, 21px)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(34px, 8px)', ...txt(15, on ? 800 : 600, C.appInk) }}>{e.name}</div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(34px, 29px)', ...txt(12, 500, C.mid) }}>{e.kind}</div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 46,
            height: 22,
            borderRadius: 11,
            background: C.appInkMute,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(144px, 15px)',
            ...txt(12, 800, C.appHi),
          }}
        >
          {e.count}
        </div>
      </div>,
    );
    y += 60;
    if (on) {
      SUBPAGES.forEach((p, j) => {
        sbRows.push(
          <div key={`sub${j}`} style={{ position: 'absolute', left: 0, top: 0, transform: `translate(44px, ${y + j * 34 + 8}px)`, ...txt(14, 500, C.appInkMute) }}>
            {p}
          </div>,
        );
      });
      y += SUBPAGES.length * 34 + 8;
    }
  });

  // Phone drift once it has settled: a slight breath, to the end of the bit.
  const drift = prog(F, K('ph2'), K('end'), E.linear);

  // 3D drift of the device (the standard tilt): the desk, the tablet and the phone each have their own
  // phase, so they never move in lockstep; the phase follows the morph with the device.
  const dev = tilt(F, V(0, 140, 280));

  // The headline (the line's own entrance: the same words and pace as a chain, wrapped in its column)
  const headCopy = chainOf(`${SLUG}.responsives`, locale)[0];
  const headSettle = chainFrames(`${SLUG}.responsives`, { size: HEAD_SIZE, locale })[0].settle;
  const headRelax = prog(F, headSettle, headSettle + f60(filmPace.accentDur), E.smooth);
  // The headline's real height, from its measured wrap in this locale (FR « … au Développement Web. »
  // wraps on 3 lines, EN on 2): the card sits under it and the block stays centred, so the card never covers a line
  const HEAD_H = headLines(headCopy.text) * HEAD_SIZE * HEADLINE_LEAD;
  const COL_TOP = H / 2 - ((HEAD_H + HEAD_GAP + CARD_H) * COMBO_K) / 2;

  // Desktop counters (the same numbers as the list's status)
  const stats = [
    { label: LABELS.stats.present, value: present, color: C.appInkMute },
    { label: LABELS.stats.waiting, value: ev.count - present, color: C.appInk },
    { label: LABELS.stats.total, value: ev.count, color: C.appInk },
  ];

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translate(0px, ${-6 * drift}px) scale(${1 + 0.012 * drift})` }}>
        {/* the illustration's zone on the right: the device morph in frame px, with the perspective of the tilt on its parent */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, perspective: TILT_PERSPECTIVE }}>
          {/* the device: its own box tilts; the tablet's bezel (with its camera) and the app window share it */}
          <div
            style={{
              ...dev,
              position: 'absolute',
              left: 0,
              top: 0,
              width: ww + 2 * pad,
              height: wh + 2 * pad,
              transform: `translate(${wx - pad}px, ${wy - pad}px) ${dev.transform}`,
            }}
          >
            <DeviceFrame x={pad} y={pad} w={ww} h={wh} r={wr} pad={pad} opacity={bezelOp} camera={1 - t2} />
            {/* the app: the browser window (desktop), then the tablet and phone screen */}
            <BrowserWindow x={pad} y={pad} w={ww} h={wh} r={wr} border={borderW} chromeH={CHROME} chromeOpacity={chromeOp} url={LABELS.url}>
              {/* sidebar (desktop only) */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: sbW, height: wh - sbTop, background: C.appBand, overflow: 'hidden', transform: `translate(0px, ${sbTop}px)` }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: SB_W, height: '100%' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(16px, 26px)', ...txt(13, 700, C.appInkMute) }}>{LABELS.sidebar}</div>
                  {sbRows}
                </div>
              </div>

              {/* title: the event kind, then its name; a hamburger before it on tablet and phone */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: 44, height: 44, opacity: hamOp, transform: `translate(${cx0}px, ${hamY}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: C.appPaper, boxShadow: `0px 1px 0px ${C.appFill}` }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.appInkMute} strokeWidth={2.2} strokeLinecap="round">
                  {ICONS[0]}
                </svg>
              </div>
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${titleX}px, ${headY}px)` }}>
                <div style={txt(V(14, 17, 19), 600, C.mid)}>{ev.kind}</div>
                <div style={{ ...txt(V(30, 36, 40), 800, C.appInkMute), marginTop: 2 }}>{ev.name}</div>
              </div>

              {/* toolbar: settings, filter, sort, round and white, at the content's right edge */}
              {[1, 2, 3].map((k, i) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: iconS,
                    height: iconS,
                    boxSizing: 'border-box',
                    borderRadius: V(10, 12, 12),
                    background: C.appPaper,
                    boxShadow: `0px 1px 0px ${C.appFill}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `translate(${cx1 - (2 - i) * (iconS + iconG) - iconS}px, ${iconY}px)`,
                  }}
                >
                  <svg width={iconS * 0.5} height={iconS * 0.5} viewBox="0 0 24 24" fill="none" stroke={C.appInkMute} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[k]}
                  </svg>
                </div>
              ))}

              {/* desktop counters: three white tiles (they fade out on the devices) */}
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 226,
                    height: 72,
                    boxSizing: 'border-box',
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: C.appPaper,
                    boxShadow: `0px 1px 0px ${C.appFill}`,
                    opacity: 1 - t1,
                    transform: `translate(${252 + i * 245}px, 150px)`,
                  }}
                >
                  <div style={txt(13, 600, C.mid)}>{s.label}</div>
                  <div style={{ ...txt(28, 800, s.color), marginTop: 6 }}>{s.value}</div>
                </div>
              ))}

              {/* the count line (tablet and phone): it ticks on each check-in */}
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${cx0}px, ${countY}px)`, opacity: t1, ...txt(V(15, 17, 19), 600, C.appInkMute) }}>
                {`${present} ${LABELS.present}${LABELS.sep}${ev.count} ${LABELS.of}`}
              </div>

              {/* search field */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: LW,
                  height: searchH,
                  boxSizing: 'border-box',
                  borderRadius: searchR,
                  background: C.appPaper,
                  boxShadow: `0px 1px 0px ${C.appFill}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingLeft: searchPad,
                  transform: `translate(${cx0}px, ${searchY}px)`,
                }}
              >
                <svg width={searchIcon} height={searchIcon} viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth={2.4} strokeLinecap="round" style={{ flex: 'none' }}>
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="M15.5 15.5L21 21" />
                </svg>
                <div style={txt(V(14, 17, 19), 400, C.mid)}>{LABELS.search}</div>
              </div>

              {/* desktop column headers, above the table */}
              {[
                { x: 70, label: LABELS.cols.guest },
                { x: COMPANY_X, label: LABELS.cols.company },
                { x: STATUS_X, label: LABELS.cols.status },
              ].map((c) => (
                <div
                  key={c.label}
                  style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${252 + c.x}px, 298px)`, opacity: 1 - t1, ...txt(12, 700, C.mid), letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  {c.label}
                </div>
              ))}

              {/* the guest list: one white card, clipped; the rows scroll inside it */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: LW,
                  height: listH,
                  overflow: 'hidden',
                  borderRadius: listR,
                  background: C.appPaper,
                  boxShadow: `0px 1px 0px ${C.appFill}`,
                  transform: `translate(${cx0}px, ${listY}px)`,
                }}
              >
                {rows}
                {ripples}
              </div>

              {/* the phone's speaker slot: last part of the morph */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: 120, height: 30, borderRadius: 15, background: C.appBezel, opacity: notchOp, transform: `translate(${(ww - 120) / 2}px, 12px)` }} />
            </BrowserWindow>
          </div>
        </div>
      </div>

      {/* detail 2 and detail 3: the line, then the experience card under it, in the copy column (x 96-670);
          the two are one combo, scaled as one */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: HEAD_W, transformOrigin: '0 0', transform: `translate(${COL_X}px, ${COL_TOP}px) scale(${COMBO_K})` }}>
        <Words
          text={headCopy.text}
          frame={F}
          start={headCopy.in}
          id={headCopy.id}
          size={HEAD_SIZE}
          out={headCopy.out}
          style={{ ...typeStyle('display', HEAD_SIZE), color: mixColor(C.accent, C.ink, headRelax), display: 'flex', flexWrap: 'wrap', width: HEAD_W }}
        />
        <ExperienceCard
          logo="companies/arep.jpg"
          name={EXPERIENCE.company}
          activity={EXPERIENCE.activity}
          period={EXPERIENCE.period}
          F={F}
          at={K('card')}
          x={0}
          y={HEAD_H + HEAD_GAP}
          w={CARD_W}
          // the combo is scaled by COMBO_K (0.82): scale the card's text back up so its smallest line stays >= 22 px
          textScale={1 / COMBO_K}
        />
      </div>
    </AbsoluteFill>
  );
};

const cues = (_seed: number): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  (['tapA', 'tapB', 'tapC'] as const).forEach((n) => {
    ev.push(sfx('tap', K(n), n, { weight: 1.1 }));
    ev.push(sfx('status', K(n) + 3, `${n}-count`, { weight: 0.7 })); // the band flips, the counter starts
  });
  ev.push(sfx('item', K('open'), 'open', { weight: 0.8 }));
  ev.push(sfx('panel', K('tab') + MORPH / 2, 'morph-tablet', { weight: 0.9, apexFrac: 0.5 }));
  ev.push(sfx('panel', K('ph') + MORPH / 2, 'morph-phone', { weight: 0.9, apexFrac: 0.5 }));
  ev.push(sfx('object', K('tab') + MORPH, 'tablet-settle', { weight: 0.5 }));
  ev.push(sfx('object', K('ph') + MORPH, 'phone-settle', { weight: 0.5 }));
  ev.push(sfx('text', K('copy') + 4, 'headline'));
  ev.push(sfx('card', K('card') + 8, 'card', { weight: 0.8 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
