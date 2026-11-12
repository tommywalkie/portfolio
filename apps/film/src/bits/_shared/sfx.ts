// The film's sound vocabulary: ONE sound per on-screen event type, the same in every
// story bit. Variety comes only from the earshot takes of that one sound (audio/kit.json roles "<kind>.<variant>",
// several seeds each), never from switching sounds for the same event. Every bit's `cues` builds its events with
// sfx(); export-cues / grid checks can then rely on the variant being one of these.
import type { SoundEvent } from '../../sync';

export const SFX = {
  transition: { kind: 'whoosh', variant: 'transition' }, // every slide change
  camera: { kind: 'whoosh', variant: 'camera' }, // a camera move: pan, zoom, pull-back
  panel: { kind: 'whoosh', variant: 'panel' }, // a panel or sidebar sliding in, a device morph
  page: { kind: 'whoosh', variant: 'page' }, // a page switch
  card: { kind: 'land', variant: 'card' }, // a window or card landing
  object: { kind: 'land', variant: 'object' }, // a small object landing (pill on the tray, dispenser parts, floors)
  text: { kind: 'snap', variant: 'line' }, // a text line landing (headline, quote, name, role, site): a soft click
  chat: { kind: 'pop', variant: 'chat' }, // a chat bubble or question card arriving (ia-workflow)
  item: { kind: 'pop', variant: 'item' }, // an item appearing (post-it, signal, graph node, vote, slot)
  pill: { kind: 'pop', variant: 'pill' }, // a pill leaving the drum
  type: { kind: 'key', variant: 'type' }, // laptop typing (IDE, terminal, chat), one per character
  calc: { kind: 'key', variant: 'calc' }, // a calculator rubber button (typing, save, select)
  mouse: { kind: 'click', variant: 'mouse' }, // every mouse click (FAB, picks, grabs, export)
  tap: { kind: 'click', variant: 'tap' }, // every finger tap on a phone or tablet
  scan: { kind: 'tick', variant: 'scan' }, // a scan or check (QR scan, copilot name, CI check, row done, selection)
  status: { kind: 'tick', variant: 'status' }, // a counter or status starting (arep counter, row start, sncf mark)
  latch: { kind: 'snap', variant: 'latch' }, // something snapping into place (kanban drop, fix applied)
  success: { kind: 'bell', variant: 'success' }, // a success (calculator result, CI pass, lint done, finish line)
  detent: { kind: 'tick', variant: 'detent' }, // the dispenser drum turning
  step: { kind: 'tock', variant: 'step' }, // footsteps (gallop, horse stride)
} as const satisfies Record<string, { kind: SoundEvent['kind']; variant?: string }>;

export type SfxName = keyof typeof SFX;

/** One sound event of the film vocabulary at absolute frame f. */
export const sfx = (name: SfxName, f: number, id: string, opts: { weight?: number; pan?: number; apexFrac?: number } = {}): SoundEvent => ({
  f,
  ...SFX[name],
  ...opts,
  id,
});
