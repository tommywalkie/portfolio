// Text measurement against the real, loaded font. Only call it under <FontGate> (every act is),
// because a measurement taken with the fallback face would be cached and silently wrong.
import { FONT } from '../brand/tokens';

const widths = new Map<string, number>();

/** Advance width in px of one line, exactly as the DOM lays it out (variable weight, em tracking). */
export const measureTracked = (text: string, size: number, weight: number, trackEm: number, family = FONT.text) => {
  const key = `${text}|${size}|${weight}|${trackEm}|${family}`;
  const hit = widths.get(key);
  if (hit !== undefined) return hit;
  const span = document.createElement('span');
  span.textContent = text;
  Object.assign(span.style, {
    position: 'absolute',
    visibility: 'hidden',
    whiteSpace: 'pre',
    fontFamily: family,
    fontSize: `${size}px`,
    fontWeight: String(weight),
    letterSpacing: `${trackEm}em`,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '1',
  });
  document.body.appendChild(span);
  const w = span.getBoundingClientRect().width;
  document.body.removeChild(span);
  widths.set(key, w);
  return w;
};

/** Largest size (px, at most `max`) at which `text` fits in `maxWidth`. Widths scale linearly with size. */
export const fitSize = (text: string, maxWidth: number, max: number, weight: number, trackEm: number, family = FONT.text) =>
  Math.min(max, (maxWidth / measureTracked(text, 100, weight, trackEm, family)) * 100);

