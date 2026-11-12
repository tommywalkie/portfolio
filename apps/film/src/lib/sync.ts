// Sync points computed from the picture's own curves, never typed by hand. src/sync.ts calls these
// to place sounds; acts call them to make a visible moment land ON a beat. Node-safe (no DOM).
import type { Ease } from './anim';

/** First frame an eased tween from a to b reaches `thr` of its travel (0.97 = where a settle sound goes). */
export const settleOf = (a: number, b: number, ease: Ease, thr = 0.97): number => {
  for (let f = Math.ceil(a); f < b; f++) if (ease((f - a) / (b - a)) >= thr) return f;
  return Math.ceil(b);
};
