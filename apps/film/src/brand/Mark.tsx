import React from 'react';
import { C } from './tokens';

// The site's own logo (portfolio src/components/Logo.astro): a calligraphic T and the green dot.
// Geometry is in the logo's native units (505 x 473 box). `size` is the on-screen width.
// The dot is its own piece: it is where the film's story device (the pixel horse) comes to rest.
const T_PATH =
  'M 234.304 473.153 Q 207.992 473.153 195.462 462.19 Q 182.932 451.226 182.932 427.107 L 182.932 29.292 Q 172.909 30.231 158.03 32.894 Q 143.151 35.556 126.862 40.568 Q 110.574 45.58 94.285 52.628 Q 77.997 59.676 65.154 68.916 Q 52.311 78.157 44.167 89.747 Q 36.023 101.337 36.023 115.433 Q 36.023 125.456 38.685 131.408 Q 41.348 137.359 44.793 140.335 Q 48.239 143.311 51.841 144.094 Q 55.444 144.877 57.01 144.877 Q 64.841 144.877 69.853 142.215 Q 74.864 139.552 78.937 136.576 Q 83.009 133.601 86.611 130.938 Q 90.213 128.275 94.912 128.275 Q 98.671 128.275 102.899 129.998 Q 107.128 131.721 110.73 135.48 Q 114.333 139.239 116.839 145.347 Q 119.345 151.455 119.345 160.226 Q 119.345 172.756 114.489 181.84 Q 109.634 190.923 101.96 197.032 Q 94.285 203.14 84.418 206.116 Q 74.551 209.091 64.841 209.091 Q 49.805 209.091 37.745 203.923 Q 25.686 198.754 17.228 189.671 Q 8.771 180.587 4.385 168.37 Q 0 156.154 0 142.371 Q 0 105.722 20.204 78.94 Q 40.408 52.158 75.491 34.46 Q 110.574 16.762 157.247 8.304 Q 203.919 -0.153 257.17 -0.153 Q 282.543 -0.153 306.662 0.317 Q 330.782 0.787 350.673 1.726 Q 370.563 2.666 384.972 3.919 Q 399.381 5.172 405.959 6.738 Q 412.224 8.304 415.983 11.28 Q 419.742 14.256 421.621 18.015 Q 423.501 21.774 424.127 26.003 Q 424.754 30.231 424.754 34.617 Q 424.754 38.062 423.814 42.604 Q 422.874 47.146 420.995 51.218 Q 419.116 55.29 416.296 58.11 Q 413.477 60.929 409.405 60.929 Q 406.899 60.929 404.237 58.736 Q 401.574 56.543 396.875 53.411 Q 392.177 50.279 384.189 46.207 Q 376.202 42.134 363.202 38.689 Q 350.203 35.243 331.252 32.424 Q 312.301 29.605 285.362 28.665 L 285.362 427.107 Q 285.362 451.226 272.832 462.19 Q 260.303 473.153 234.304 473.153 Z';

const MARK = {
  box: { w: 505, h: 473 },
  T: { d: T_PATH, cx: 212, cy: 236 },
  D: { cx: 450.938, cy: 419.091, r: 54.062 }, // the dot
};

export type Piece = 'T' | 'D';

/** Per-piece pose in logo units. `origin` defaults to the piece centre. */
export type PieceXf = { x?: number; y?: number; rot?: number; s?: number; sx?: number; sy?: number; o?: number; origin?: [number, number] };

const xf = (p: PieceXf | undefined, cx: number, cy: number) => {
  if (!p) return undefined;
  const [ox, oy] = p.origin ?? [cx, cy];
  const sx = Math.max(0, (p.s ?? 1) * (p.sx ?? 1));
  const sy = Math.max(0, (p.s ?? 1) * (p.sy ?? 1));
  return `translate(${p.x ?? 0} ${p.y ?? 0}) rotate(${p.rot ?? 0} ${ox} ${oy}) translate(${ox} ${oy}) scale(${sx} ${sy}) translate(${-ox} ${-oy})`;
};

/** Height in px of the mark drawn at `size` px wide. */
const markHeight = (size: number) => (size * MARK.box.h) / MARK.box.w;

export const Mark: React.FC<{
  size: number; // on-screen width in px
  ink?: string;
  dot?: string;
  t?: PieceXf;
  d?: PieceXf;
  only?: Piece[];
  style?: React.CSSProperties;
}> = ({ size, ink = C.text, dot = C.accent, t, d, only, style }) => {
  const show = (p: Piece) => !only || only.includes(p);
  const { T, D, box } = MARK;
  return (
    <svg width={size} height={markHeight(size)} viewBox={`0 0 ${box.w} ${box.h}`} style={{ overflow: 'visible', display: 'block', ...style }}>
      {show('T') && <path d={T.d} fill={ink} transform={xf(t, T.cx, T.cy)} opacity={t?.o ?? 1} />}
      {show('D') && <circle cx={D.cx} cy={D.cy} r={D.r} fill={dot} transform={xf(d, D.cx, D.cy)} opacity={d?.o ?? 1} />}
    </svg>
  );
};
