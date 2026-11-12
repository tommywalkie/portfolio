import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { E, prog } from '../../../lib/anim';

export type DistinctionCardProps = {
  logo: string;
  name: string;
  activity: string;
  period: string;
  F: number;
  at: number;
  x: number;
  y: number;
  w: number;
};

export const DistinctionCard: React.FC<DistinctionCardProps> = ({ logo, name, activity, period, F, at, x, y, w }) => {
  const a = prog(F, at, at + 24, E.smooth);
  const lift = (1 - prog(F, at, at + 30, E.out)) * 16;
  return (
    <div
      data-mover="distinction-card"
      style={{
        position: 'absolute',
        left: x,
        top: y + lift,
        width: w,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: 26,
        borderRadius: 22,
        border: `1.5px solid ${C.line}`,
        background: C.ink2,
        opacity: a,
      }}
    >
      <div style={{ width: 104, height: 104, borderRadius: 14, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden' }}>
        <Img src={staticFile(logo)} style={{ width: 96, height: 96, objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <div data-text="distinction.name" data-ui style={{ fontFamily: FONT.text, fontSize: 32, fontWeight: 700, color: C.white, lineHeight: 1.2 }}>{name}</div>
        <div data-text="distinction.activity" data-ui style={{ fontFamily: FONT.text, fontSize: 26, fontWeight: 500, color: C.text, lineHeight: 1.25 }}>{activity}</div>
        <div data-text="distinction.period" data-ui style={{ fontFamily: FONT.text, fontSize: 22, fontWeight: 400, color: C.soft, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{period}</div>
      </div>
    </div>
  );
};
