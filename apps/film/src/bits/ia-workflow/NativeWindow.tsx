import React from 'react';
import { C, FONT } from '../../brand/tokens';

/**
 * A light-mode native desktop window: a visible border, a title bar (the app icon, the app name, and the three window
 * controls at the right) and the app below it. No address bar: a desktop app is not a website. Children are absolute,
 * in window coordinates (0,0 is the window's top-left, the title bar included). The title bar is C.appPaper with a C.appFill
 * hairline, so it never shares a colour with the app sidebar (C.appBand) or the app page (C.appPage).
 */
export const TITLE_BAR = 48; // the title bar's height, px (the app area starts under it)
const BORDER = 3;
const CONTROL_W = 46;

export type NativeWindowProps = {
  w: number;
  h: number;
  title: string; // the app's name, shown in the title bar
  children?: React.ReactNode;
};

const control = (x: number, key: string, glyph: React.ReactNode) => (
  <div key={key} style={{ position: 'absolute', left: x, top: 0, width: CONTROL_W, height: TITLE_BAR }}>
    <svg width={CONTROL_W} height={TITLE_BAR} viewBox={`0 0 ${CONTROL_W} ${TITLE_BAR}`} style={{ display: 'block' }}>
      {glyph}
    </svg>
  </div>
);

export const NativeWindow: React.FC<NativeWindowProps> = ({ w, h, title, children }) => {
  const inner = w - 2 * BORDER;
  const ink = C.appInkDeep;
  // the glyphs sit at the centre of their 46 px cell, drawn with 1.5 px strokes
  const cx = CONTROL_W / 2;
  const cy = TITLE_BAR / 2;
  const minimize = <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke={ink} strokeWidth={1.5} />;
  const maximize = <rect x={cx - 6} y={cy - 6} width={12} height={12} fill="none" stroke={ink} strokeWidth={1.5} />;
  const close = (
    <path d={`M${cx - 6} ${cy - 6} L${cx + 6} ${cy + 6} M${cx + 6} ${cy - 6} L${cx - 6} ${cy + 6}`} stroke={ink} strokeWidth={1.5} fill="none" />
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderRadius: 12,
        border: `${BORDER}px solid ${C.appEdge}`,
        background: C.appPage,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: inner, height: TITLE_BAR, background: C.appPaper }}>
        {/* the app icon (a rounded tile) and the app name */}
        <div style={{ position: 'absolute', left: 14, top: (TITLE_BAR - 22) / 2, width: 22, height: 22, borderRadius: 6, background: C.appInkMute }} />
        <div
          style={{
            position: 'absolute',
            left: 46,
            top: 0,
            height: TITLE_BAR,
            display: 'flex',
            alignItems: 'center',
            fontFamily: FONT.text,
            fontSize: 20,
            fontWeight: 600,
            color: C.appInkDeep,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        {/* the window controls: minimise, maximise, close */}
        {control(inner - 3 * CONTROL_W, 'min', minimize)}
        {control(inner - 2 * CONTROL_W, 'max', maximize)}
        {control(inner - CONTROL_W, 'close', close)}
        {/* the hairline under the title bar */}
        <div style={{ position: 'absolute', left: 0, top: TITLE_BAR - 2, width: inner, height: 2, background: C.appFill }} />
      </div>
      {children}
    </div>
  );
};
