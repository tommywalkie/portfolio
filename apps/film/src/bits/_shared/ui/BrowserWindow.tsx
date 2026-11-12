import React from 'react';
import { C, FONT } from '../../../brand/tokens';

/**
 * A light-mode browser window: a visible border, a chrome bar (three dots and an address pill) and
 * the app below it. In the light film the whole window steps one shade darker (the app ramp in
 * tokens.ts), so it still lifts off the white page. The chrome is appPaper with an appFill hairline
 * under it, so it never shares a colour with an app sidebar (appBand) or the app page (appPage).
 * Positions and sizes are in frame px; children are absolute, in window coordinates (0,0 is the
 * window's top-left, the chrome included). Use it for any desktop app slide. To morph the window into
 * a device, pass the same numbers every frame and fade `chromeOpacity` to 0 (see arep-checkin).
 */
export type BrowserWindowProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number; // corner radius, px (default 18)
  border?: number; // the frame's border, px (default 3)
  chromeH?: number; // the chrome bar's height, px (default 56)
  chromeOpacity?: number; // 0..1: fades the chrome out during a morph (default 1)
  url: string; // the address pill's text (a fictional host)
  dark?: boolean; // a depicted dark-mode app: its own theme, pinned in both film themes (default false: light)
  children?: React.ReactNode;
};

const pillText: React.CSSProperties = { fontFamily: FONT.text, fontSize: 22, fontWeight: 400, color: C.mid, lineHeight: 1.2, whiteSpace: 'pre' };

export const BrowserWindow: React.FC<BrowserWindowProps> = ({ x, y, w, h, r = 18, border = 3, chromeH = 56, chromeOpacity = 1, url, dark = false, children }) => {
  const chromeBg = dark ? C.dkChrome : C.appPaper;
  const pillBg = dark ? C.dkPanel : C.appPage;
  const pillInk = dark ? C.dkMute : C.mid;
  const dot = dark ? C.dkFill : C.appFill;
  const hairline = dark ? C.dkLine : C.appFill;
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
      borderRadius: r,
      border: `${border}px solid ${dark ? C.dkFill : C.appEdge}`,
      background: dark ? C.dkPage : C.appPage,
      transform: `translate(${x}px, ${y}px)`,
    }}
  >
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: chromeH, background: chromeBg, opacity: chromeOpacity }}>
      {[24, 48, 72].map((dx) => (
        <div key={dx} style={{ position: 'absolute', left: 0, top: 0, width: 14, height: 14, borderRadius: 7, background: dot, transform: `translate(${dx - 7}px, ${(chromeH - 14) / 2}px)` }} />
      ))}
      <div style={{ position: 'absolute', left: 0, top: 0, width: w - 240, height: 32, borderRadius: 16, background: pillBg, transform: `translate(120px, ${(chromeH - 32) / 2}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(24px, 4px)', ...pillText, color: pillInk }}>{url}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: 2, background: hairline, transform: `translate(0px, ${chromeH - 2}px)` }} />
    </div>
    {children}
  </div>
  );
};
