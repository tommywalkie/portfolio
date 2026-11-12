import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { E, prog } from '../../../lib/anim';

const PAD_Y = 18;
const PAD_X = 22;
const LOGO = 72;
const NAME_LH = 38;
const ACT_LH = 30;
const PER_LH = 26;
const GAP_Y = 6;

type Props = {
  logo: string;
  name: string;
  activity: string;
  period: string;
  maxW: number;
  F: number;
  at: number;
  out: number;
  outDur: number;
  x: number;
  y: number;
};

export const CompactCard: React.FC<Props> = ({ logo, name, activity, period, maxW, F, at, out, outDur, x, y }) => {
  const a = prog(F, at, at + 24, E.smooth) * (1 - prog(F, out, out + outDur, E.smooth));
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;
  return (
    <div
      data-mover="compact-card"
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
