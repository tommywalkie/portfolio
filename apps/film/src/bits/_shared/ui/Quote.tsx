import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { E, prog } from '../../../lib/anim';
import { measureTracked } from '../../../lib/measure';

/**
 * A testimonial in the reference style: a large opening quote mark in the accent, the sentence big
 * and bold (up to 3 lines, wrapping naturally in `w`), then the person's photo, name and title.
 * The sentences are a carousel of WHOLE sentences: one at a time, each fades and rises in from its
 * `times` entry, holds, fades out 12 f before the next one starts; the last one stays.
 * Sizing: the block sizes to its content. Each sentence's line count is measured against the real
 * font (measure.ts, a deterministic greedy wrap in `w`), so the block height is known in every frame.
 * The block's height eases between the measured heights of consecutive sentences (the window runs
 * from 12 f before the next sentence to 24 f after it starts), and the author row moves with it.
 * Placement: `cy` (a centre line) keeps the whole block vertically centred as it grows and shrinks;
 * without `cy` the block's top is `y` and it grows downwards.
 * Entrance: the whole block fades in on E.smooth over 30 f and rises 16 px on E.out from `at`.
 * All positions are frame px, all times absolute frames (`F` = the bit's absolute frame).
 * Every string comes in as a prop. Call it under FontGate (like every measurement).
 */
export type QuoteProps = {
  photo: string; // path inside public/, e.g. 'profiles/maxime-gaudin.jpg' (wrapped in staticFile here)
  name: string;
  title: string;
  sentences: string[]; // one entry per carousel step, each a whole sentence
  times: number[]; // absolute frame each sentence starts (same length as sentences)
  F: number; // the bit's absolute frame
  at: number; // absolute frame the block starts to arrive
  x: number; // left edge, frame px
  y?: number; // resting top, frame px (used when `cy` is not given)
  cy?: number; // centre line, frame px: the block stays vertically centred on it as its height changes
  w: number; // width, frame px (the height follows the content)
  size?: number; // sentence font size, px (default 56)
  weight?: number; // sentence font weight (default 700)
  color?: string; // sentence colour (default C.bright)
};

const PHOTO = 72;
const AUTHOR_H = 74; // the author row: the photo, and the name + title text (73.6 px), so its height is known
const GAP = 28;
const LEAD = 1.15; // sentence line-height
const TRACK = -0.01; // sentence letter-spacing (em)

/** Number of lines a sentence takes in `w`: greedy word wrap, widths from the real font. */
const lineCount = (text: string, w: number, size: number, weight: number) => {
  const words = text.split(' ');
  let lines = 1;
  let line = '';
  for (const word of words) {
    const candidate = line === '' ? word : `${line} ${word}`;
    if (line !== '' && measureTracked(candidate, size, weight, TRACK) > w) {
      lines += 1;
      line = word;
    } else {
      line = candidate;
    }
  }
  return lines;
};

export const Quote: React.FC<QuoteProps> = ({ photo, name, title, sentences, times, F, at, x, y = 0, cy, w, size = 56, weight = 700, color = C.bright }) => {
  const a = prog(F, at, at + 30, E.smooth);
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;

  // Heights: each sentence's measured block, and the eased height the block has in this frame. The
  // height is a telescoping sum, so it is continuous whatever the spacing of the sentences.
  const heights = sentences.map((s) => lineCount(s, w, size, weight) * size * LEAD);
  const markH = size * 0.8; // the mark's ink sits in this box; the glyph's descent stays visible, nothing clips
  let textH = heights[0] ?? 0;
  for (let i = 1; i < sentences.length; i++) {
    const t = times[i];
    textH += (heights[i] - heights[i - 1]) * prog(F, t - 12, t + 24, E.smooth);
  }
  const blockH = markH + GAP + textH + GAP + AUTHOR_H;
  const top = cy === undefined ? y : cy - blockH / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: top + lift,
        width: w,
        boxSizing: 'border-box',
        opacity: a,
        display: 'flex',
        flexDirection: 'column',
        gap: GAP,
      }}
    >
      <div
        aria-hidden
        style={{
          fontFamily: FONT.text,
          fontSize: size * 2.2,
          fontWeight: 700,
          color: C.accent,
          lineHeight: 1,
          height: markH,
        }}
      >
        “
      </div>
      <div style={{ position: 'relative', height: textH }}>
        {sentences.map((text, i) => {
          const start = times[i];
          const next = times[i + 1];
          const on = prog(F, start, start + 24, E.smooth);
          const rise = (1 - prog(F, start, start + 30, E.out)) * 16;
          const off = next === undefined ? 0 : prog(F, next - 12, next, E.smooth);
          const op = on * (1 - off);
          return (
            <div
              key={i}
              data-text={`quote.${i + 1}`}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                fontFamily: FONT.text,
                fontSize: size,
                fontWeight: weight,
                letterSpacing: '-0.01em',
                lineHeight: LEAD,
                color,
                whiteSpace: 'normal',
                overflowWrap: 'normal',
                wordBreak: 'normal',
                opacity: op,
                transform: `translateY(${rise}px)`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: AUTHOR_H }}>
        <div style={{ width: PHOTO, height: PHOTO, borderRadius: 14, overflow: 'hidden', flex: 'none', background: C.ink3 }}>
          <Img src={staticFile(photo)} style={{ width: PHOTO, height: PHOTO, objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: FONT.text, fontSize: 32, fontWeight: 700, color: C.bright, lineHeight: 1.2 }}>{name}</div>
          <div style={{ fontFamily: FONT.text, fontSize: 26, fontWeight: 500, color: C.soft, lineHeight: 1.2 }}>{title}</div>
        </div>
      </div>
    </div>
  );
};
