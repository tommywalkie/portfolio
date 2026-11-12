import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { E, prog } from '../../../lib/anim';

/**
 * Detail 3 for any slide: an experience card with the company logo, the company name, its activity
 * and, smaller, the period and its duration. The strings come from the calling bit's data.ts.
 * Entrance: fades in on E.smooth over 24 f, rises 16 px on E.out over 30 f, from `at` (absolute
 * frames, `F` = the bit's absolute frame). Place it under a line of copy, not over a device.
 */
export type ExperienceCardProps = {
  logo: string; // path inside public/, e.g. 'companies/arep.jpg' (wrapped in staticFile here)
  name: string;
  activity: string;
  period: string;
  F: number; // the bit's absolute frame
  at: number; // absolute frame the card starts to arrive
  x: number; // left edge, frame px
  y: number; // resting top, frame px
  w?: number; // card width, px (default 700)
  h?: number; // card height, px (default 210)
  textScale?: number; // multiplies the text sizes (a card drawn inside a scaled-down group keeps readable text)
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

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ logo, name, activity, period, F, at, x, y, w = 700, h = 210, textScale = 1 }) => {
  const a = prog(F, at, at + 24, E.smooth);
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;
  return (
    <div
      // text check (scripts/layout-audit.sh): the card is a box that may cover text (data-mover: sampled by the
      // "covered" check), and its lines are text boxes (data-text: checked for overlap with any other text)
      data-mover="experience-card"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: 26,
        borderRadius: 22,
        border: `1.5px solid ${C.line}`,
        background: C.ink2,
        opacity: a,
        transform: `translate(${x}px, ${y + lift}px)`,
      }}
    >
      <Img src={staticFile(logo)} style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', flex: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div data-text="card.name" data-ui style={txt(36 * textScale, 700, C.white)}>{name}</div>
        <div data-text="card.activity" data-ui style={txt(26 * textScale, 500, C.text)}>{activity}</div>
        <div data-text="card.period" data-ui style={txt(22 * textScale, 400, C.soft)}>{period}</div>
      </div>
    </div>
  );
};
