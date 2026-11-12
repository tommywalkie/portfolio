import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../brand/tokens';
import { E, prog } from '../../lib/anim';

// The compact experience card: logo, company name, activity and period, nothing
// else. It sizes to its content (shrink-to-fit width, capped at the column; the text lines have fixed px heights, so
// the height is known every frame: `CARD_H`). It enters like the shared ExperienceCard: fade on E.smooth over 24 f,
// rise 16 px on E.out over 30 f, from `at` (absolute frames). Here it also leaves: a fade on E.smooth over `outDur`
// from `out` (the headline's exit, so the two leave together).

const PAD_Y = 18;
const PAD_X = 22;
const LOGO = 72;
const NAME_LH = 38;
const ACT_LH = 30;
const PER_LH = 26;
const GAP_Y = 6;

type Props = {
  logo: string; // path inside public/, e.g. 'companies/la-metis.jpg' (wrapped in staticFile here)
  name: string;
  activity: string;
  period: string;
  maxW: number; // the column's width: the card never grows past it
  F: number; // the bit's absolute frame
  at: number; // absolute frame the card starts to arrive
  out: number; // absolute frame the card starts to leave
  outDur: number; // frames of the fade-out
  x: number; // left edge, frame px
  y: number; // resting top, frame px
};

export const CompactCard: React.FC<Props> = ({ logo, name, activity, period, maxW, F, at, out, outDur, x, y }) => {
  const a = prog(F, at, at + 24, E.smooth) * (1 - prog(F, out, out + outDur, E.smooth));
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;
  return (
    <div
      data-mover="compact-card" // text check: a box that may cover text
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        boxSizing: 'border-box',
        maxWidth: maxW,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: `${PAD_Y}px ${PAD_X}px`,
        borderRadius: 18,
        border: `1.5px solid ${C.line}`,
        background: C.ink2,
        opacity: a,
        transform: `translate(${x}px, ${y + lift}px)`,
        fontFamily: FONT.text,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'pre',
      }}
    >
      <Img src={staticFile(logo)} style={{ width: LOGO, height: LOGO, borderRadius: 12, objectFit: 'cover', flex: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: GAP_Y }}>
        <div data-text="compact.name" data-ui style={{ fontSize: 32, fontWeight: 700, color: C.white, lineHeight: `${NAME_LH}px` }}>{name}</div>
        <div data-text="compact.activity" data-ui style={{ fontSize: 24, fontWeight: 500, color: C.text, lineHeight: `${ACT_LH}px` }}>{activity}</div>
        <div data-text="compact.period" data-ui style={{ fontSize: 22, fontWeight: 400, color: C.soft, lineHeight: `${PER_LH}px` }}>{period}</div>
      </div>
    </div>
  );
};
