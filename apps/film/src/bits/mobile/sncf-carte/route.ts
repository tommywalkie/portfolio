export type Pt = [number, number];

export const VW = 1060;
export const VH = 816;

const START: Pt = [40, 300];
const STOP_1: Pt = [520, 300];
const STOP_2: Pt = [720, 510];
const STOP_3: Pt = [960, 300];
export const STOPS: Pt[] = [STOP_1, STOP_2, STOP_3];

export const LEG_F = 45;

export const SCAN_F = 36;

export const ROUTES: { pts: Pt[] }[] = [
  { pts: [START, STOP_1, [720, 300], STOP_2, [960, 510], STOP_3] },
  { pts: [START, STOP_1, [520, 510], STOP_2, [720, 300], STOP_3] },
];

const seg = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

export const lengthOf = (pts: Pt[]) => {
  let s = 0;
  for (let i = 1; i < pts.length; i++) s += seg(pts[i - 1], pts[i]);
  return s;
};

export const stopArcs = (pts: Pt[]): number[] => {
  const out: number[] = [];
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) s += seg(pts[i - 1], pts[i]);
    if (STOPS.includes(pts[i])) out.push(s);
  }
  return out;
};

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
