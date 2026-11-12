import React from 'react';
import { C, FONT } from '../../../brand/tokens';
import { clamp, E, prog } from '../../../lib/anim';
import { tilt, TILT_PERSPECTIVE } from '../../../lib/tilt';
import type { Seg } from './data';

const PINNED: Record<string, keyof typeof C> = { deep: 'appInkMute', stage: 'appInkDeep' };
const TONE = (k: Seg[1]) => C[PINNED[k] ?? k];

export type IdeProps = {
  F: number;
  at: number;
  typeAt: number;
  cps: number;
  x: number;
  y: number;
  w: number;
  h: number;
  phase: number;
  lines: Seg[][];
  tab: string;
};

const CHROME = 56;
const FONT_PX = 28;
const LINE_H = 38;
const GUTTER = 64;
const PAD_TOP = 20;

export const IdeWindow: React.FC<IdeProps> = ({ F, at, typeAt, cps, x, y, w, h, phase, lines, tab }) => {
  const a = prog(F, at, at + 24, E.smooth);
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;

  const total = lines.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0), 0) + (lines.length - 1);
  const typed = Math.floor(clamp(((F - typeAt) * cps) / 60, 0, total));

  let caretLine = 0;
  let offset = 0;
  for (let li = 0; li < lines.length; li++) {
    const len = lines[li].reduce((m, [t]) => m + t.length, 0);
    if (typed <= offset + len) {
      caretLine = li;
      break;
    }
    offset += len + 1;
    caretLine = li + 1;
  }
  const caretOn = Math.floor(F / 30) % 2 === 0 || typed < total;

  let budget = typed;

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, perspective: TILT_PERSPECTIVE }}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y + lift,
          width: w,
          height: h,
          boxSizing: 'border-box',
          overflow: 'hidden',
          borderRadius: 18,
          border: `3px solid ${C.appEdge}`,
          background: C.appPage,
          opacity: a,
          ...tilt(F, phase),
        }}
      >

        <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: CHROME, background: C.appPaper }}>
          {[24, 48, 72].map((dx) => (
            <div key={dx} style={{ position: 'absolute', left: 0, top: 0, width: 14, height: 14, borderRadius: 7, background: C.appFill, transform: `translate(${dx - 7}px, ${(CHROME - 14) / 2}px)` }} />
          ))}
          <div
            style={{
              position: 'absolute',
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
              transform: `translate(120px, ${(CHROME - 34) / 2}px)`,
            }}
          >
            {tab}
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: 2, background: C.appFill, transform: `translate(0px, ${CHROME - 2}px)` }} />
        </div>

        {lines.map((segs, li) => {
          const top = CHROME + PAD_TOP + li * LINE_H;
          const drawn: React.ReactNode[] = [];
          for (let si = 0; si < segs.length; si++) {
            const [text, tone] = segs[si];
            const take = Math.max(0, Math.min(text.length, budget));
            budget -= take;
            if (take > 0) {
              drawn.push(
                <span key={si} style={{ color: TONE(tone) }}>
                  {text.slice(0, take)}
                </span>,
              );
            }
          }
          if (li < lines.length - 1) budget -= 1;
          const onThisLine = li === caretLine;
          return (
            <div key={li}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top,
                  width: GUTTER - 16,
                  textAlign: 'right',
                  fontFamily: FONT.mono,
                  fontSize: FONT_PX,
                  lineHeight: `${LINE_H}px`,
                  color: C.appInkFaint,
                  whiteSpace: 'pre',
                }}
              >
                {li + 1}
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: GUTTER + 20,
                  top,
                  height: LINE_H,
                  fontFamily: FONT.mono,
                  fontSize: FONT_PX,
                  lineHeight: `${LINE_H}px`,
                  color: C.appInkDeep,
                  whiteSpace: 'pre',
                }}
              >
                {drawn}
                {onThisLine && caretOn ? (
                  <span style={{ display: 'inline-block', width: 3, height: FONT_PX, verticalAlign: 'middle', background: C.accentDeep }} />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
