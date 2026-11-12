import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../brand/tokens';
import { E, prog } from '../../lib/anim';

// The compact experience card of this bit (detail 3): logo, company name, activity and period, nothing
// else. It sizes to its content (shrink-to-fit width, the text lines have fixed px heights, so the
// height is known every frame: `CARD_H`). It enters like the shared ExperienceCard: fade on E.smooth
// over 24 f, rise 16 px on E.out over 30 f, from `at` (absolute frames). The shared card is untouched.

const PAD_Y = 18;
const PAD_X = 22;
const LOGO = 72;
const NAME_LH = 38;
const ACT_LH = 30;
const PER_LH = 26;
const GAP_Y = 6;
/** The card's height in px: the text column (3 lines and 2 gaps, taller than the logo), plus padding and border. */
export const CARD_H = 2 * PAD_Y + (NAME_LH + ACT_LH + PER_LH + 2 * GAP_Y) + 3;

type Props = {
  logo: string; // path inside public/, e.g. 'companies/sncf.jpg' (wrapped in staticFile here)
  name: string;
  activity: string;
  period: string;
  F: number; // the bit's absolute frame
  at: number; // absolute frame the card starts to arrive
  x: number; // left edge, frame px
  y: number; // resting top, frame px
};

export const CompactCard: React.FC<Props> = ({ logo, name, activity, period, F, at, x, y }) => {
  const a = prog(F, at, at + 24, E.smooth);
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        boxSizing: 'border-box',
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
        <div style={{ fontSize: 32, fontWeight: 700, color: C.white, lineHeight: `${NAME_LH}px` }}>{name}</div>
        <div style={{ fontSize: 24, fontWeight: 500, color: C.text, lineHeight: `${ACT_LH}px` }}>{activity}</div>
        <div style={{ fontSize: 20, fontWeight: 400, color: C.soft, lineHeight: `${PER_LH}px` }}>{period}</div>
      </div>
    </div>
  );
};
