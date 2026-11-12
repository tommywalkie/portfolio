// The sound events of the film, computed from the picture code. scripts/export-cues.ts calls the
// default export and writes out/cues.json; scripts/audio/score.py voices each event.
// Each story bit owns its cues (BitModule.cues in src/bits/<slug>/index.tsx); this file gathers
// them at each bit's FILM_SEED. Every sound has a visible cause; impacts land on the contact frame, pops on the
// 50% frame, settles on the 97% frame; one soft `text` sound per fragment, never per word.
import { BIT_MODULES, FILM_SEED } from './bits/registry';
import { ACT, planActs, TOTAL } from './timeline';
import { SFX } from './bits/_shared/sfx';

export type Kind =
  | 'tick' | 'tock' | 'hit' | 'land' | 'pop' | 'whoosh' | 'riser'
  | 'drop' | 'key' | 'click' | 'snap' | 'swell' | 'bell' | 'suck' | 'text';

export type SoundEvent = {
  f: number; // absolute frame the sound belongs on (fractional is fine)
  kind: Kind;
  weight?: number; // 0..2, 1 = normal
  pan?: number; // -1 left .. +1 right
  pitch?: number | string;
  apexFrac?: number;
  dur?: number;
  variant?: string;
  id?: string;
};

const actOf = (f: number) => Object.entries(ACT).find(([, a]) => f >= a.from && f < a.from + a.dur)?.[0] ?? 'tail';

export default function cues(): SoundEvent[] {
  const ev: SoundEvent[] = BIT_MODULES.flatMap((m) => m.cues?.(FILM_SEED[m.slug] ?? 1) ?? []);

  // A soft whoosh on every slide change (src/Film.tsx transitions), its apex on the cut. Rugby's own entry is the
  // whistle, so no whoosh into or out of it.
  const acts = planActs();
  acts.slice(1).forEach((a, i) => {
    if (a.slug === 'rugby' || acts[i].slug === 'rugby') return;
    ev.push({ f: a.from, kind: 'whoosh', variant: 'transition', weight: 0.5, pan: 0, apexFrac: 0.5, id: `transition-${a.slug}` });
  });

  // Vocabulary check: every event must be one of the film's event-type sounds (src/bits/_shared/sfx.ts), so the same
  // on-screen event can never get a different sound in another bit, or rotate sounds within one.
  const allowed = new Set(Object.values(SFX).map((s) => `${s.kind}.${'variant' in s ? s.variant : ''}`));
  const bad = ev.filter((e) => !allowed.has(`${e.kind}.${e.variant ?? ''}`));
  if (bad.length) throw new Error(`sync: ${bad.length} event(s) outside the sound vocabulary (src/bits/_shared/sfx.ts), e.g. ${bad.slice(0, 5).map((e) => `${e.id} ${e.kind}.${e.variant ?? ''}`).join(', ')}`);

  // Voice quota: never more than MAX_VOICES sounds starting within WINDOW frames of each other, except typing and
  // touch taps. The events with the highest priority (success, text, clicks, cards...) win; the quiet small ones
  // (footsteps, ticks, object landings) give way first.
  const MAX_VOICES = 2;
  const WINDOW = 18; // frames, 0.3 s
  const key = (s: { kind: string; variant?: string }) => `${s.kind}.${s.variant ?? ''}`;
  const EXEMPT = new Set([key(SFX.type), key(SFX.calc), key(SFX.tap)]);
  const PRIORITY: Record<string, number> = Object.fromEntries(
    Object.entries({
      // scan ranks high: a QR scan or check must always sound, even next to a pop and a whoosh
      success: 10, latch: 9, mouse: 8, text: 8, chat: 8, scan: 7, card: 7, pill: 6, item: 6,
      camera: 5, panel: 5, page: 5, transition: 4, status: 3, detent: 3, object: 3, step: 1,
    }).map(([name, p]) => [key(SFX[name as keyof typeof SFX]), p]),
  );
  const kept: SoundEvent[] = ev.filter((e) => EXEMPT.has(key(e)));
  const quota: SoundEvent[] = [];
  [...ev.filter((e) => !EXEMPT.has(key(e)))]
    .sort((a, b) => (PRIORITY[key(b)] ?? 0) - (PRIORITY[key(a)] ?? 0) || a.f - b.f)
    .forEach((e) => {
      if (quota.filter((q) => Math.abs(q.f - e.f) < WINDOW).length < MAX_VOICES) quota.push(e);
    });
  ev.splice(0, ev.length, ...[...kept, ...quota].sort((a, b) => a.f - b.f));

  for (const e of ev) {
    if (!(e.f >= 0 && e.f < TOTAL)) throw new Error(`sync: ${e.id} at f=${e.f} is outside the film (0..${TOTAL - 1})`);
    e.id = `${actOf(e.f)}:${e.id}`;
  }
  return ev;
}
