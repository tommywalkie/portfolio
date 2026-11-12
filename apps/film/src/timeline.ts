// The master timeline. Every story bit (one slide of the resume) keeps its own timing in
// src/bits/<slug>/timeline.ts, written in its own bars. This file lays the built bits end to end,
// bar-aligned, in story order, and exposes the flat ACT / CUE / COPY / TOTAL that the cinetic
// tooling reads (grid-check, export-cues, layout-audit, blur, Chain).
// Keep this file free of React and CSS imports: Node scripts load it directly.
//
// i18n: the timing is the same for every locale (it is written from the French text). The copy's
// text differs: COPY is the text of ACTIVE_LOCALE (fr, or FILM_LOCALE=en for the scripts), and
// copyOf(locale) / chainOf(id, locale) give the text of any locale for the components.
import { BITS } from './bits/timelines';
import { BAR, FPS, PACE_NAME, TAIL, type Copy } from './lib/grid';
import { ACTIVE_LOCALE, LOCALES, type Locale } from './lib/locale';
import { PACE, readingWindows } from './lib/pace';
import { FILM_ORDER } from './plans';

// The Node scripts (grid-check, export-cues, layout-audit) load this module by path and read these exports.
export { PACE } from './lib/pace';
export { BAR, BEAT, BPM, b, chain, f60, FPS, H, line, PACE_NAME, TAIL, W, type Copy } from './lib/grid';
export { ACTIVE_LOCALE, LOCALES, type Locale } from './lib/locale';

type Act = { from: number; dur: number };

type Built = { ACT: Record<string, Act>; CUE: Record<string, number>; COPY: Copy[]; TOTAL: number };

/** A length in bars, in frames, padded up to the 16th grid (9 f at 100 BPM / 60 fps), so the next act starts on it. */
const SIXTEENTH = BAR / 16;
const padded = (bars: number) => Math.ceil(Math.round(bars * BAR) / SIXTEENTH - 1e-6) * SIXTEENTH;

const build = (locale: Locale): Built => {
  const ACT: Record<string, Act> = {};
  const CUE: Record<string, number> = {};
  const COPY: Copy[] = [];
  let cursor = 0;
  for (const bit of BITS) {
    // Fractional bar lengths (e.g. 300 f) are padded up to the grid; the bit simply holds/drifts for the extra frames.
    const dur = padded(bit.bars);
    ACT[bit.slug] = { from: cursor, dur };
    const t = bit.build(cursor, locale);
    for (const [k, v] of Object.entries(t.cue)) CUE[`${bit.slug}.${k}`] = v;
    for (const c of t.copy) {
      if (!c.id.startsWith(`${bit.slug}.`)) throw new Error(`timeline: copy id "${c.id}" must start with "${bit.slug}."`);
      COPY.push(c);
    }
    cursor += dur;
  }
  // The last act holds through the tail, so the film never ends on a cut.
  const lastSlug = BITS[BITS.length - 1]?.slug;
  if (lastSlug) ACT[lastSlug].dur += TAIL;
  return { ACT, CUE, COPY, TOTAL: cursor + TAIL };
};

const BUILT: Record<Locale, Built> = { fr: build('fr'), en: build('en') };

// Both locales must share every frame: the copy is timed from the French text. A mismatch means a
// timeline reads its timing from the locale's text, which would make the English film retimed.
for (const locale of LOCALES) {
  const ref = BUILT.fr;
  const got = BUILT[locale];
  const same =
    JSON.stringify(ref.ACT) === JSON.stringify(got.ACT) &&
    JSON.stringify(ref.CUE) === JSON.stringify(got.CUE) &&
    ref.COPY.length === got.COPY.length &&
    ref.COPY.every((c, i) => c.id === got.COPY[i].id && c.in === got.COPY[i].in && c.resolved === got.COPY[i].resolved && c.out === got.COPY[i].out);
  if (!same) throw new Error(`timeline: the ${locale} timing differs from the fr timing (a copy's frames must not depend on its text)`);
}

const ACTIVE = BUILT[ACTIVE_LOCALE];

/** One act per built story bit, contiguous and bar-aligned, in story order. */
export const ACT = ACTIVE.ACT;
/** Every bit's cues, flattened as "<slug>.<cue>" (absolute frames). Locale-independent. */
export const CUE = ACTIVE.CUE;
export const TOTAL = ACTIVE.TOTAL;
/** Every bit's copy in ACTIVE_LOCALE (the scripts' view; components use copyOf / chainOf with their locale). */
export const COPY: Copy[] = ACTIVE.COPY;

const pace = PACE[PACE_NAME];
/** When each COPY entry is being read; nothing new should start inside a window. */
export const READ = readingWindows(COPY, pace, FPS, TOTAL);

/** The copy of one locale (default: the active locale), for the components. */
const copyOf = (locale: Locale = ACTIVE_LOCALE): Copy[] => BUILT[locale].COPY;

/** The fragments of one chain, in order of arrival, in the given locale (default: the active one). */
export const chainOf = (id: string, locale: Locale = ACTIVE_LOCALE): Copy[] => {
  const list = copyOf(locale)
    .filter((x) => x.chain === id)
    .sort((p, q) => p.in - q.in);
  if (!list.length) throw new Error(`timeline: no COPY chain "${id}"`);
  return list;
};

/** A bit's act: where it starts in the film and how long it runs. */
export const actOf = (slug: string): Act => {
  const a = ACT[slug];
  if (!a) throw new Error(`timeline: no built bit "${slug}"`);
  return a;
};

/** A bit's length in frames (padded to the grid). */
const lengthOf = (slug: string): number => {
  const bit = BITS.find((b) => b.slug === slug);
  if (!bit) throw new Error(`timeline: no built bit "${slug}"`);
  return padded(bit.bars);
};

export type PlanAct = { slug: string; from: number; dur: number };

/** The acts of the film plan (src/plans.ts): each bit's place and length; the last one carries the tail. */
export const planActs = (): PlanAct[] => {
  let cursor = 0;
  const acts = FILM_ORDER.map((slug) => {
    const dur = lengthOf(slug);
    const a = { slug, from: cursor, dur };
    cursor += dur;
    return a;
  });
  if (acts.length) acts[acts.length - 1].dur += TAIL;
  return acts;
};

/** The film's total length in frames. */
export const planTotal = (): number => {
  const acts = planActs();
  const last = acts[acts.length - 1];
  return last ? last.from + last.dur : 0;
};
