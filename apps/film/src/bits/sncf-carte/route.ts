// The site plan's geometry (pure TS: the timeline reads LEG_F, the picture reads the rest).
// World px: the map viewport is VW x VH at zoom 1. Stops are the three tools' places on the plan;
// the routes are the walkways the itinerary can take between them. Both routes have the same
// length, so the agent's walk takes the same time for every seed.

export type Pt = [number, number];

export const VW = 1060;
export const VH = 816;

const START: Pt = [40, 300];
const STOP_1: Pt = [520, 300];
const STOP_2: Pt = [720, 510];
const STOP_3: Pt = [960, 300];
export const STOPS: Pt[] = [STOP_1, STOP_2, STOP_3];

/** Frames the agent takes for each walk leg (fixed, so the timing is the same for every seed; 5 steps of 9 f). */
export const LEG_F = 45;
/** Frames the agent holds at each stop for its scan (the viewfinder sweep; the result lands at its middle). */
export const SCAN_F = 36;

/**
 * Two walkway variants. Both cross the rails only at the marked crossings (x 520, 720, 960).
 * 0: along the upper walkway to stop 1, down at x 720, then east along the lower one to stop 3 via x 960.
 * 1: down at x 520 and along the lower walkway to stop 2, then up at x 720 and along the upper one.
 */
export const ROUTES: { pts: Pt[] }[] = [
  { pts: [START, STOP_1, [720, 300], STOP_2, [960, 510], STOP_3] },
  { pts: [START, STOP_1, [520, 510], STOP_2, [720, 300], STOP_3] },
];

const seg = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Total length of a polyline, in world px. */
export const lengthOf = (pts: Pt[]) => {
  let s = 0;
  for (let i = 1; i < pts.length; i++) s += seg(pts[i - 1], pts[i]);
  return s;
};

/** Arc length (world px) at each of the three stops, in the order they are visited. */
export const stopArcs = (pts: Pt[]): number[] => {
  const out: number[] = [];
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) s += seg(pts[i - 1], pts[i]);
    if (STOPS.includes(pts[i])) out.push(s);
  }
  return out;
};

/** The point at arc length s along a polyline (clamped to its ends). */
export const pointAt = (pts: Pt[], s: number): Pt => {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const L = seg(pts[i - 1], pts[i]);
    if (s <= acc + L) {
      const t = L === 0 ? 0 : (s - acc) / L;
      const a = pts[i - 1];
      const b = pts[i];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    acc += L;
  }
  return pts[pts.length - 1];
};
