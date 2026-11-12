import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT, TYPE } from '../../brand/tokens';
import { E, prog } from '../../lib/anim';
import { fitSize, measureTracked } from '../../lib/measure';
import { W } from '../../timeline';

// One spacing system for every portrait bit: illustration, then TEXT_GAP, then the text stack.
export const MARGIN = 72;
export const ILLU_TOP = 180;
export const COL_X = MARGIN;
export const COL_W = W - 2 * MARGIN;
export const TEXT_GAP = 72;
// A quote's mark sits higher in its box than a headline's capitals: this keeps the same visible gap (~107 px).
export const QUOTE_GAP = TEXT_GAP + 18;
export const DETAIL_GAP = 40;
export const HEADLINE_MAX = 104;
export const QUOTE_SIZE = 56;

/** Headline size: HEADLINE_MAX, or smaller when the longest line would not fit the column. */
export const headlineSize = (...lines: string[]) =>
  Math.min(...lines.map((t) => fitSize(t, COL_W, HEADLINE_MAX, TYPE.display.weight, TYPE.display.track)));

/**
 * Lines a wrapping headline takes in the column at `size`. Matches fx/Words: every word but the last is a flex
 * item that carries its trailing space, so a line's last word still counts its space.
 */
export const wrapLines = (text: string, size: number) => {
  const { weight, track } = TYPE.display;
  const words = text.split(' ');
  let lines = 1;
  let w = 0;
  words.forEach((word, i) => {
    const ww = measureTracked(i < words.length - 1 ? `${word} ` : word, size, weight, track);
    if (w > 0 && w + ww > COL_W) {
      lines++;
      w = ww;
    } else w += ww;
  });
  return lines;
};

/** Largest size up to HEADLINE_MAX at which a wrapping headline takes at most `maxLines` lines. */
export const wrapSize = (text: string, maxLines: number) => {
  let size = HEADLINE_MAX;
  while (size > 40 && wrapLines(text, size) > maxLines) size -= 2;
  return size;
};

/** Height of a headline block of `lines` lines at `size`. */
export const headlineBox = (size: number, lines = 1) => size * TYPE.display.lead * lines;

export const CARD_LOGO = 104;
const CARD_PAD = 26;
const NAME_LH = 32 * 1.2;
const ACT_LH = 26 * 1.25;
const PER_LH = 22 * 1.2;
/** The card's height: its text column is taller than the logo. */
export const CARD_H = Math.round(2 * CARD_PAD + Math.max(CARD_LOGO, NAME_LH + ACT_LH + PER_LH + 2 * 8) + 3);

export type MobileCardProps = {
  logo: string;
  name: string;
  activity: string;
  period: string;
  F: number;
  at: number;
  y: number;
  out?: number;
  outDur?: number;
};

/** The experience or distinction card of every portrait bit: full column width, one style. */
export const MobileCard: React.FC<MobileCardProps> = ({ logo, name, activity, period, F, at, y, out, outDur = 24 }) => {
  const a = prog(F, at, at + 24, E.smooth) * (out === undefined ? 1 : 1 - prog(F, out, out + outDur, E.smooth));
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;
  const line = (size: number, weight: number, color: string, lh: number): React.CSSProperties => ({
    fontFamily: FONT.text,
    fontSize: size,
    fontWeight: weight,
    color,
    lineHeight: `${lh}px`,
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  });
  return (
    <div
      data-mover="mobile-card"
      style={{
        position: 'absolute',
        left: COL_X,
        top: y + lift,
        width: COL_W,
        height: CARD_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: CARD_PAD,
        borderRadius: 22,
        border: `1.5px solid ${C.line}`,
        background: C.ink2,
        opacity: a,
      }}
    >
      <div style={{ width: CARD_LOGO, height: CARD_LOGO, borderRadius: 14, background: C.white, flex: 'none', overflow: 'hidden' }}>
        <Img src={staticFile(logo)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <div data-text="card.name" data-ui style={line(32, 700, C.white, NAME_LH)}>{name}</div>
        <div data-text="card.activity" data-ui style={line(26, 500, C.text, ACT_LH)}>{activity}</div>
        <div data-text="card.period" data-ui style={line(22, 400, C.soft, PER_LH)}>{period}</div>
      </div>
    </div>
  );
};
