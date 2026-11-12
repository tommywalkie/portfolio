import React from 'react';
import { C, FONT } from '../../../brand/tokens';
import { LCD_H, LCD_W, type Px } from './lcd';

// A clean, simplified Casio Graph 35+E, drawn as an SVG group in its own units (480 x 800).
// Put it inside a full-frame <svg> and move it with a transform: SVG transforms stay vector-sharp
// at any camera scale (a CSS scale on an <svg> would rasterise it first, then blur).

export const CALC = {
  w: 480,
  h: 800,
  /** The LCD glass: 128 x 64 pixels at 2.65 units each. */
  lcd: { x: 70, y: 128, w: 340, h: 170 },
};
const LCD_PX = CALC.lcd.w / LCD_W; // units per LCD pixel
/** Centre of the LCD, in calculator units: the camera's focus for screen close-ups. */
export const LCD_CENTRE = { x: CALC.lcd.x + CALC.lcd.w / 2, y: CALC.lcd.y + CALC.lcd.h / 2 };

const KEY_ROWS: { labels: string[]; kind: 'f' | 'k' }[] = [
  { labels: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'], kind: 'f' },
  { labels: ['SHIFT', 'OPTN', 'VARS', 'MENU', '◀', '▶'], kind: 'k' },
  { labels: ['ALPHA', 'x²', '^', 'EXIT', '▲', '▼'], kind: 'k' },
  { labels: ['X,θ,T', 'log', 'ln', 'sin', 'cos', 'tan'], kind: 'k' },
  { labels: ['7', '8', '9', 'DEL', 'AC'], kind: 'k' },
  { labels: ['4', '5', '6', '×', '÷'], kind: 'k' },
  { labels: ['1', '2', '3', '+', '−'], kind: 'k' },
  { labels: ['0', '.', 'EXP', '(−)', 'EXE'], kind: 'k' },
];

const Keys: React.FC = () => {
  const x0 = 46;
  const x1 = CALC.w - 46;
  let y = 352;
  return (
    <g>
      {KEY_ROWS.map((row, r) => {
        const n = row.labels.length;
        const gap = 12;
        const kw = (x1 - x0 - gap * (n - 1)) / n;
        const kh = row.kind === 'f' ? 30 : r >= 4 ? 40 : 32;
        const top = y;
        y += kh + (r === 0 ? 22 : r === 3 ? 22 : 14);
        return row.labels.map((label, i) => {
          const x = x0 + i * (kw + gap);
          return (
            <g key={`${r}-${i}`}>
              <rect x={x} y={top} width={kw} height={kh} rx={kh / 2.4} fill={row.kind === 'f' ? C.fkey : C.key} />
              <text
                x={x + kw / 2}
                y={top + kh / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily={FONT.text}
                fontWeight={600}
                fontSize={r >= 4 ? 17 : 12}
                fill={row.kind === 'f' ? C.key : C.keyLabel}
              >
                {label}
              </text>
            </g>
          );
        });
      })}
    </g>
  );
};

/** The LCD's lit pixels, drawn as merged horizontal runs (far fewer rects than one per pixel). */
const LcdPixels: React.FC<{ px: Px[]; color?: string }> = ({ px, color = C.lcdInk }) => {
  const rows = new Map<number, number[]>();
  for (const [x, y] of px) {
    if (x < 0 || y < 0 || x >= LCD_W || y >= LCD_H) continue;
    const r = rows.get(y);
    if (r) r.push(x);
    else rows.set(y, [x]);
  }
  const rects: React.ReactNode[] = [];
  const s = LCD_PX;
  const inset = 0; // solid pixels: a hairline grid strobes into stripes once the camera scales it
  rows.forEach((xs, y) => {
    const sorted = [...new Set(xs)].sort((a, b) => a - b);
    let start = sorted[0];
    let prev = sorted[0];
    const flush = () =>
      rects.push(<rect key={`${y}-${start}`} x={CALC.lcd.x + start * s + inset} y={CALC.lcd.y + y * s + inset} width={(prev - start + 1) * s - 2 * inset} height={s - 2 * inset} fill={color} />);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === prev + 1) prev = sorted[i];
      else {
        flush();
        start = prev = sorted[i];
      }
    }
    flush();
  });
  return <g shapeRendering="crispEdges">{rects}</g>;
};

/** The calculator body with its screen content. Units: 480 x 800, origin top-left. */
export const Calculator: React.FC<{ px: Px[] }> = ({ px }) => {
  const { lcd } = CALC;
  return (
    <g>
      <rect x={6} y={6} width={CALC.w - 12} height={CALC.h - 12} rx={58} fill={C.shell} stroke={C.shellEdge} strokeWidth={14} />
      <text x={46} y={84} fontFamily={FONT.text} fontWeight={800} fontSize={34} letterSpacing={1} fill={C.key}>
        CASIO
      </text>
      <text x={CALC.w - 46} y={82} textAnchor="end" fontFamily={FONT.text} fontWeight={600} fontSize={20} fill={C.key}>
        GRAPH 35+E
      </text>
      {/* bezel, then the glass */}
      <rect x={lcd.x - 18} y={lcd.y - 16} width={lcd.w + 36} height={lcd.h + 32} rx={16} fill={C.fkey} />
      <rect x={lcd.x} y={lcd.y} width={lcd.w} height={lcd.h} rx={3} fill={C.lcd} />
      <LcdPixels px={px} />
      <Keys />
    </g>
  );
};
