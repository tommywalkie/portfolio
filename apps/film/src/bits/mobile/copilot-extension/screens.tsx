import React from 'react';
import { C, FONT } from '../../../brand/tokens';

export const CW = 1114;
export const CH = 826;
export const SB = 430;

export const t = (size: number, weight: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.25,
  whiteSpace: 'pre',
  fontVariantNumeric: 'tabular-nums',
  ...extra,
});

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: 'absolute', left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, ...extra });

const Bar: React.FC<{ x: number; y: number; w: number; h: number; fill?: string }> = ({ x, y, w, h, fill = C.appBand }) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: h / 2, background: fill })} />
);

const Pane: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={abs(x, y, { width: w, height: h, boxSizing: 'border-box', borderRadius: 16, background: C.appPaper, border: `2px solid ${C.appBand}`, overflow: 'hidden' })}>{children}</div>
);

export const SalesforcePage: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, background: C.appPage }}>
    <div style={abs(0, 0, { width: CW, height: 68, background: C.appPaper, borderBottom: `2px solid ${C.appBand}`, boxSizing: 'border-box' })}>

      <div style={abs(22, 12, { width: 44, height: 44, boxSizing: 'border-box', borderRadius: 12, border: `2px solid ${C.appBand}`, display: 'grid', gridTemplateColumns: 'repeat(3, 6px)', gap: 5, alignContent: 'center', justifyContent: 'center' })}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: C.mid }} />
        ))}
      </div>
      <Bar x={88} y={24} w={110} h={20} fill={C.appFill} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Bar key={i} x={236 + i * 120} y={27} w={[70, 86, 96, 80, 100][i]} h={14} />
      ))}
    </div>
    <Pane x={28} y={92} w={CW - 56} h={150}>
      <div style={abs(24, 24, { width: 96, height: 96, borderRadius: 48, background: C.appBand })} />
      <Bar x={146} y={44} w={300} h={26} fill={C.appFill} />
      <Bar x={146} y={88} w={220} h={18} />
    </Pane>
    <Pane x={28} y={266} w={560} h={532}>
      <Bar x={26} y={28} w={150} h={22} fill={C.appFill} />
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <Bar x={26} y={82 + i * 84} w={110} h={14} />
          <Bar x={26} y={106 + i * 84} w={[300, 240, 260, 180, 220][i]} h={18} />
        </React.Fragment>
      ))}
    </Pane>
    <Pane x={612} y={266} w={CW - 640} h={532}>
      <Bar x={26} y={28} w={140} h={22} fill={C.appFill} />
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <div style={abs(26, 86 + i * 96, { width: 14, height: 14, borderRadius: 7, background: C.mid })} />
          <Bar x={56} y={84 + i * 96} w={[260, 220, 290][i]} h={18} />
          <Bar x={56} y={114 + i * 96} w={[150, 130, 170][i]} h={14} />
        </React.Fragment>
      ))}
    </Pane>
  </div>
);

export const LinkedInPage: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, background: C.appPage }}>
    <Pane x={28} y={24} w={CW - 56} h={470}>
      <div style={abs(0, 0, { width: CW - 56, height: 150, background: C.appFill })} />
      <div style={abs(36, 80, { width: 152, height: 152, boxSizing: 'border-box', borderRadius: 76, border: `6px solid ${C.appPaper}`, background: C.appBand })} />
      <Bar x={40} y={262} w={320} h={28} fill={C.appFill} />
      <Bar x={40} y={310} w={440} h={18} />
      <Bar x={40} y={344} w={260} h={16} />
      <Bar x={40} y={400} w={360} h={16} />
    </Pane>
    <Pane x={28} y={518} w={CW - 56} h={280}>
      <Bar x={26} y={28} w={140} h={22} fill={C.appFill} />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={26} y={86 + i * 44} w={[560, 480, 520, 380][i]} h={18} />
      ))}
    </Pane>
  </div>
);

export const FAB_W = 64;
export const FAB_H = 196;
export const FAB_HIT = { x: FAB_W / 2, y: 92 };
export const Fab: React.FC<{ x: number; y: number; ring?: number; press?: number }> = ({ x, y, ring = 0, press = 0 }) => (
  <div
    style={abs(x, y, {
      width: FAB_W,
      height: FAB_H,
      borderRadius: '16px 0 0 16px',
      background: C.appInk,
      boxShadow: '-12px 16px 40px rgba(0,0,0,.28)',
    })}
  >

    <div style={abs(FAB_W / 2 - 9, 18, { display: 'grid', gridTemplateColumns: 'repeat(3, 4px)', gap: 3 })}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: C.appEdge }} />
      ))}
    </div>

    <div style={abs(FAB_W / 2 - 22, FAB_HIT.y - 22, { width: 44, height: 44, transform: `translate(${FAB_W / 2 - 22}px, ${FAB_HIT.y - 22}px) scale(${1 - 0.12 * press})` })}>
      <svg width={44} height={44} viewBox="0 0 24 24">
        <path d="M4 5h16v14H4z M4 13h4.5l1.5 2.5h4l1.5-2.5H20" fill="none" stroke={C.appHi} strokeWidth={1.9} strokeLinejoin="round" />
      </svg>
      {ring > 0 && <div style={abs(30, -4, { width: 18, height: 18, borderRadius: 9, border: `2px solid ${C.pendingRed}`, transform: `translate(30px, -4px) scale(${1 + 0.8 * ring})`, opacity: 1 - ring })} />}
      <div style={abs(32, -2, { width: 14, height: 14, borderRadius: 7, background: C.pendingRed, border: `2px solid ${C.appInk}` })} />
    </div>

    <div style={abs(FAB_W / 2 - 22, 136)}>
      <svg width={44} height={44} viewBox="0 0 24 24">
        <circle cx={10.5} cy={10.5} r={6.5} fill="none" stroke={C.appHi} strokeWidth={1.9} />
        <path d="M15.5 15.5L20 20 M8 12.5v-2 M10.5 12.5v-4 M13 12.5v-3" fill="none" stroke={C.appHi} strokeWidth={1.9} strokeLinecap="round" />
      </svg>
    </div>
  </div>
);
