// copilot-extension: the simplified cut (timing in ./timeline.ts) with the floating button back.
// Detail 1: one browser window; the page under the extension alternates between a Salesforce-like page and a LinkedIn
// profile skeleton (no words); the cursor clicks the floating button (after a 1.2 s wait), the Sales Copilot sidebar
// slides in on the lead (name and four signals) and the button moves to its left edge. Detail 2: the headline column
// « Des produits SaaS / qui s'intègrent à / <seven names> ». Detail 3: one card (the MadKudu experience, the app
// « HG Insights Sales Copilot » and its availability on the Chrome Web Store), which takes the headline's place.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, HEADLINE_LEAD } from '../../brand/tokens';
import { Chain } from '../../fx/Chain';
import { Cursor, cursorArc } from '../../fx/Cursor';
import { clamp, E, fd, hitPulse, mix, pace, prog, rand } from '../../lib/anim';
import { mixColor } from '../../lib/color';
import { useStrings } from '../../lib/i18n';
import { TILT_PERSPECTIVE, tilt } from '../../lib/tilt';
import { actOf, CUE, f60 } from '../../timeline';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import { BrowserWindow } from '../_shared/ui/BrowserWindow';
import type { BitModule, BitProps } from '../types';
import { STR, type Lead } from './copy';
import { CH, CW, Fab, FAB_H, FAB_HIT, FAB_W, LinkedInPage, SalesforcePage, SB, t } from './screens';

const SLUG = 'copilot-extension';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// What a seed changes: the lead in sight (seed 1 = Claire Vidal). Timing is the same for every seed.
const leadOf = (seed: number) => (seed === 1 ? 0 : Math.floor(rand(`${SLUG}:b:${seed}:lead`) * STR.fr.leads.length));

// Layout (frame px): the window is the illustration (left, x 0-1150), the copy column is on the right.
const WIN = { x: 72, y: 96, w: 1120, h: 888 };
/** The browser window's uniform scale about its centre (the tilt stays inside x 0-1150). */
const WIN_SCALE = 0.88;
const CHROME = 56;
const COL = 1252; // the copy column's left edge
const SIZE = 72; // the headline's size (display role)
const PITCH = SIZE * HEADLINE_LEAD;
const ROWS = { un: 196, integre: 196 + PITCH, tgt: 196 + 2 * PITCH };
const CARD = { y: 430, w: 572 };
/** Frames between two names of the rotating slot (the 16th grid). */
const STEP = 9;
/** Frames the sidebar (and the button with it) takes to slide in. */
const OPEN_F = 36;

// The floating button: a vertical tab stuck to the page's right border, low on the page; once the sidebar is open it
// is stuck to the sidebar's left edge instead (same height).
const FAB_REST = { x: CW - FAB_W, y: CH - FAB_H - 120 };
const FAB_OPEN = { x: CW - SB - FAB_W, y: CH - FAB_H - 120 };

/** The window's 3D tilt (tilt.ts), shrunk about its own centre. */
const winTilt = (F: number): React.CSSProperties => {
  const t3 = tilt(F, 0);
  return { ...t3, transform: `scale(${WIN_SCALE}) ${t3.transform}` };
};

const label = (size: number, weight: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.25,
  fontVariantNumeric: 'tabular-nums',
  ...extra,
});

/** The Sales Copilot sidebar on the lead: the name, then the four signals, one after another (sig: their cue frames). */
const SideBar: React.FC<{ lead: Lead; title: string; signals: string[]; sig: number[]; F: number; x: number }> = ({ lead, title, signals, sig, F, x }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: SB, height: CH, background: C.appPaper, borderLeft: `2px solid ${C.appBand}`, boxSizing: 'border-box', boxShadow: '-20px 0 60px rgba(0,0,0,.14)', overflow: 'hidden', transform: `translateX(${x}px)` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: SB, height: 70, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: `2px solid ${C.appBand}` }}>
      <span style={label(26, 700, C.appInk)}>{title}</span>
    </div>
    <div style={{ position: 'absolute', left: 40, top: 110, width: 96, height: 96, borderRadius: 48, background: C.mid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={label(36, 700, C.appHi)}>{lead.initials}</span>
    </div>
    <div style={{ position: 'absolute', left: 40, top: 226, width: SB - 80, boxSizing: 'border-box', ...label(42, 700, C.appInk) }}>{lead.name}</div>
    <div style={{ position: 'absolute', left: 40, top: 300, width: SB - 80, height: 2, background: C.appBand }} />
    <div style={{ position: 'absolute', left: 40, top: 330, width: SB - 80, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 26 }}>
      {signals.map((s, i) => {
        const p = prog(F, sig[i], sig[i] + 18, E.out);
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * 24}px)` }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.accentDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <svg width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={C.appHi} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={label(28, 500, C.appInk)}>{s}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/** The rotating slot: the current name rises in and settles to ink; the previous one leaves upward; the last one leaves with the headline. */
const Slot: React.FC<{ names: string[]; t0: number; F: number; y: number; leave: number }> = ({ names, t0, F, y, leave }) => {
  const times = names.map((_, i) => t0 + i * STEP);
  let i = -1;
  for (let j = 0; j < times.length; j++) if (fd(F) >= times[j]) i = j;
  if (i < 0) return null;
  const since = F - times[i];
  const word = (idx: number, s: number, op: number, dy: number) => {
    const color = mixColor(C.accent, C.ink, prog(s, 6, 22, E.smooth));
    return (
      <div key={idx} style={{ position: 'absolute', left: 0, top: 0, opacity: op, transform: `translate(${COL}px, ${y + dy}px)` }} data-text>
        <span style={t(SIZE, 700, color, { letterSpacing: '-0.03em', lineHeight: HEADLINE_LEAD })}>{names[idx]}</span>
      </div>
    );
  };
  const outP = prog(since, 0, 6, E.smooth);
  const gone = prog(F, leave, leave + f60(pace.exitDur), E.exit); // the headline's exit (the chains use the same cue)
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - gone, transform: `translateY(${-gone * 14}px)` }}>
      {i > 0 && outP < 1 && word(i - 1, since + STEP, 1 - outP, -outP * 14)}
      {word(i, since, prog(since, 0, 10, E.out), (1 - prog(since, 0, 10, E.out)) * 14)}
    </div>
  );
};

const Bit: React.FC<BitProps> = ({ seed }) => {
  const S = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const lead = S.leads[leadOf(seed)];
  const EXP = S.EXPERIENCE;
  const sig = [K('sig1'), K('sig2'), K('sig3'), K('sig4')];

  // Pages: Salesforce-like → LinkedIn → Salesforce-like → LinkedIn, each a quick horizontal slide (E.inOut, 20 f).
  const sw = (name: string) => prog(F, K(name) - 6, K(name) + 14, E.inOut);
  const page = sw('social') + sw('crm') + sw('social2'); // 0, 1, 2, 3 (fractional during a slide)
  const pageX = (i: number) => (i - page) * CW * 0.6;
  const pageOp = (i: number) => clamp(1 - Math.abs(i - page) * 1.4);
  const pages = [0, 1, 2, 3].map((i) => (i % 2 === 0 ? <SalesforcePage key={i} /> : <LinkedInPage key={i} />));
  const url = Math.round(page) % 2 === 0 ? S.CRM.url : `${S.SOCIAL.url}${lead.first.toLowerCase()}`;

  // The click: the cursor reaches the floating button, waits on it, presses it.
  const reach = prog(F, K('reach'), K('arrive'), E.glide);
  const press = hitPulse(F - K('click'), 2, 5);
  const open = prog(F, K('click'), K('click') + OPEN_F, E.inOut);
  const cursorOut = prog(F, K('click') + 10, K('click') + 26, E.smooth);
  const fab = { x: mix(FAB_REST.x, FAB_OPEN.x, open), y: FAB_REST.y };
  const ring = F < K('click') ? ((F - K('open')) % 40) / 40 : 0;
  const cur = cursorArc({ x: CW * 0.5, y: CH * 0.55 }, { x: FAB_REST.x + FAB_HIT.x - 4, y: FAB_REST.y + FAB_HIT.y - 2 }, reach, 0.18);

  // The sidebar slides in from the right with the click.
  const sbX = mix(CW + 20, CW - SB, open);
  // The one card: it arrives after the headline has left.
  const cardIn = prog(F, K('card'), K('card') + 24, E.smooth);
  const cardLift = (1 - prog(F, K('card'), K('card') + 30, E.out)) * 16;

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: TILT_PERSPECTIVE }}>
        {/* detail 1: the window, the standard 3D drift; the pages, sidebar, button and cursor move with it */}
        <div style={{ position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, ...winTilt(F) }}>
          <BrowserWindow x={0} y={0} w={WIN.w} h={WIN.h} url={url}>
            <div style={{ position: 'absolute', left: 0, top: CHROME, width: CW, height: CH, overflow: 'hidden' }}>
              {pages.map((p, i) =>
                pageOp(i) > 0 ? (
                  <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, opacity: pageOp(i), transform: `translateX(${pageX(i)}px)` }}>
                    {p}
                  </div>
                ) : null,
              )}
              {open > 0 && <SideBar lead={lead} title={S.COPILOT.title} signals={S.SIGNALS_B} sig={sig} F={F} x={sbX} />}
              <Fab x={fab.x} y={fab.y} ring={ring} press={press} />
              {cursorOut < 1 && <Cursor x={cur.x} y={cur.y} press={press} scale={1.7} fill={C.appInkDeep} stroke={C.appHi} opacity={(1 - cursorOut) * prog(F, K('open'), K('reach'), E.smooth)} />}
            </div>
          </BrowserWindow>
        </div>
      </div>

      {/* detail 2: the headline column (leaves at headOut) */}
      <Chain chain={`${SLUG}.un`} frame={f} from={act.from} role="display" size={SIZE} x={COL} top={ROWS.un} align="left" />
      <Chain chain={`${SLUG}.integre`} frame={f} from={act.from} role="display" size={SIZE} x={COL} top={ROWS.integre} align="left" />
      <Slot names={S.TARGETS_B} t0={K('tgt')} F={F} y={ROWS.tgt} leave={K('headOut')} />

      {/* detail 3: one card, the experience and the app on the Chrome Web Store, in the headline's place */}
      <div
        style={{
          position: 'absolute',
          left: COL,
          top: CARD.y,
          width: CARD.w,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `1.5px solid ${C.line}`,
          background: C.ink2,
          padding: 26,
          opacity: cardIn,
          transform: `translateY(${cardLift}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <Img src={staticFile(EXP.logo)} style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', flex: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div style={label(36, 700, C.white)}>{EXP.company}</div>
            <div style={label(26, 500, C.text)}>{EXP.activity}</div>
            <div style={label(22, 400, C.soft)}>{EXP.period}</div>
          </div>
        </div>
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1.5px solid ${C.line}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={label(28, 700, C.bright)}>{S.STORE.title}</div>
          <div style={label(24, 500, C.text)}>{S.STORE.available}</div>
          <div style={label(22, 400, C.soft)}>{S.STORE.details[1]}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;
  const ev: SoundEvent[] = [];
  ev.push(sfx('mouse', K('click'), 'fab-click', { weight: 1.2 }));
  ev.push(sfx('panel', K('click') + OPEN_F / 2, 'sidebar', { weight: 0.9, pan: 0.4, apexFrac: 0.5 }));
  ['sig1', 'sig2', 'sig3', 'sig4'].forEach((n, i) => ev.push(sfx('item', K(n) + 4, `signal${i + 1}`, { weight: 0.8 })));
  ev.push(sfx('text', K('un') + 6, 'headline', { weight: 0.8 }));
  STR.fr.TARGETS_B.forEach((_, i) => ev.push(sfx('scan', K('tgt') + i * STEP, `name${i}`, { weight: 0.5 })));
  ['social', 'crm', 'social2'].forEach((n, i) => ev.push(sfx('page', K(n) + 4, `page${i + 1}`, { weight: 0.4, apexFrac: 0.5 })));
  ev.push(sfx('card', K('card') + 12, 'card', { weight: 1 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
