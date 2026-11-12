// Non-text data of the check-in app: the colour of each event's dot and the guests present before the film
// starts. Every string (guests, events, labels, the experience card) is in copy.ts (i18n).

// Colour of each event's dot in the sidebar (keys of the palette in brand/tokens.ts).
export const EVENT_TONES = ['mid', 'soft', 'appTeal', 'deep', 'mute'] as const;

// Guests present before the film starts; each check-in adds one.
export const PRESENT_BASE = 118;
