import { LABS } from './data';

export const WORLD = { w: 1900, h: 1250 };
export const NODE_D = 34;
export const HUB_D = 92;
export const MODEL_PX = 15;
export const HUB_PX = 18;
const LABEL_H = 22;
const HUB_LABEL_H = 26;
const CHAR = 0.62;
const BOX_PAD = 12;

type Pt = { x: number; y: number };
export type Rect = { x0: number; y0: number; x1: number; y1: number };
type Link = { a: Pt; b: Pt };

const HUB_POS: Record<string, Pt> = {
  openai: { x: 600, y: 470 },
  anthropic: { x: 1330, y: 330 },
  mistral: { x: 540, y: 960 },
  qwen: { x: 1290, y: 960 },
};

const SPREAD: Record<string, [number, number][]> = {
  openai: [
    [105, 230],
    [150, 330],
    [195, 200],
    [238, 300],
    [282, 220],
    [330, 290],
  ],
  anthropic: [
    [-95, 200],
    [-55, 300],
    [-18, 250],
    [12, 180],
    [-80, 210],
    [20, 260],
    [70, 240],
  ],
  mistral: [
    [200, 330],
    [225, 300],
    [260, 420],
    [300, 260],
    [340, 380],
    [30, 240],
  ],
  qwen: [
    [40, 170],
    [75, 160],
    [110, 190],
    [-10, 230],
    [-40, 170],
  ],
};

export const HUBS = LABS.map((lab, i) => ({ i, name: lab.name, logo: lab.logo, ...HUB_POS[lab.id] }));

export const MODELS = LABS.flatMap((lab, li) => {
  const hub = HUB_POS[lab.id];
  const sp = SPREAD[lab.id];
  if (!sp || sp.length !== lab.models.length) throw new Error(`graphe-relationnel: ${lab.id} needs ${lab.models.length} spreads`);
  return lab.models.map((name, i) => {
    const [deg, r] = sp[i];
    const a = (deg * Math.PI) / 180;
    return { li, name, x: Math.round(hub.x + r * Math.cos(a)), y: Math.round(hub.y + r * Math.sin(a)) };
  });
});

const LINKS: Link[] = MODELS.map((m) => ({ a: HUB_POS[LABS[m.li].id], b: { x: m.x, y: m.y } }));

const boxW = (text: string, px: number) => Math.ceil(text.length * px * CHAR) + BOX_PAD;
const box = (cx: number, cy: number, hw: number, hh: number): Rect => ({ x0: cx - hw, y0: cy - hh, x1: cx + hw, y1: cy + hh });
const overlaps = (a: Rect, b: Rect, pad = 0) => a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;
const linkHits = (l: Link, r: Rect, pad = 2) => {
  const x0 = r.x0 - pad;
  const x1 = r.x1 + pad;
  const y0 = r.y0 - pad;
  const y1 = r.y1 + pad;
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const x = l.a.x + (l.b.x - l.a.x) * t;
    const y = l.a.y + (l.b.y - l.a.y) * t;
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return true;
  }
  return false;
};

const NODE_OBS = MODELS.map((m) => box(m.x, m.y, NODE_D / 2 + 2, NODE_D / 2 + 2));
const HUB_OBS = HUBS.map((h) => box(h.x, h.y, HUB_D / 2 + 2, HUB_D / 2 + 2));

MODELS.forEach((m, k) => {
  HUB_OBS.forEach((h, j) => {
    if (overlaps(NODE_OBS[k], h)) throw new Error(`graphe-relationnel: ${m.name} sits on hub ${HUBS[j].name}`);
  });
});

const placed: { name: string; r: Rect }[] = [];
const clear = (r: Rect, pad = 4) => {
  if (NODE_OBS.some((n) => overlaps(r, n))) return false;
  if (HUB_OBS.some((h) => overlaps(r, h))) return false;
  if (placed.some((p) => overlaps(r, p.r, pad))) return false;
  if (LINKS.some((l) => linkHits(l, r))) return false;
  return true;
};

export const HUB_LABELS: Rect[] = HUBS.map((h) => {
  const w = boxW(h.name, HUB_PX);
  const hh = HUB_LABEL_H;
  const r = HUB_D / 2 + 6;
  const cands: Rect[] = [
    { x0: h.x - w / 2, y0: h.y + r, x1: h.x + w / 2, y1: h.y + r + hh },
    { x0: h.x - w / 2, y0: h.y - r - hh, x1: h.x + w / 2, y1: h.y - r },
    { x0: h.x + r, y0: h.y - hh / 2, x1: h.x + r + w, y1: h.y + hh / 2 },
    { x0: h.x - r - w, y0: h.y - hh / 2, x1: h.x - r, y1: h.y + hh / 2 },
  ];
  const pick = cands.find((c) => clear(c));
  if (!pick) throw new Error(`graphe-relationnel: no clear label place for hub ${h.name}`);
  placed.push({ name: h.name, r: pick });
  return pick;
});

export const MODEL_LABELS: Rect[] = MODELS.map((m) => {
  const hub = HUB_POS[LABS[m.li].id];
  const w = boxW(m.name, MODEL_PX);
  const o = NODE_D / 2 + 5;
  const dx = m.x - hub.x;
  const dy = m.y - hub.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const cands: { dir: Pt; r: Rect }[] = [
    { dir: { x: 0, y: 1 }, r: { x0: m.x - w / 2, y0: m.y + o, x1: m.x + w / 2, y1: m.y + o + LABEL_H } },
    { dir: { x: 0, y: -1 }, r: { x0: m.x - w / 2, y0: m.y - o - LABEL_H, x1: m.x + w / 2, y1: m.y - o } },
    { dir: { x: 1, y: 0 }, r: { x0: m.x + o, y0: m.y - LABEL_H / 2, x1: m.x + o + w, y1: m.y + LABEL_H / 2 } },
    { dir: { x: -1, y: 0 }, r: { x0: m.x - o - w, y0: m.y - LABEL_H / 2, x1: m.x - o, y1: m.y + LABEL_H / 2 } },
  ];
  cands.sort((p, q) => (q.dir.x * ux + q.dir.y * uy) - (p.dir.x * ux + p.dir.y * uy));
  const pick = cands.find((c) => clear(c.r));
  if (!pick) throw new Error(`graphe-relationnel: no clear label place for ${m.name}`);
  placed.push({ name: m.name, r: pick.r });
  return pick.r;
});

export const SEL = MODELS.findIndex((m) => m.name === 'Claude Fable Latest');
