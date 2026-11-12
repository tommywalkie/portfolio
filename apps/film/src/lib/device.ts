// FILM_DEVICE=desktop (default) or mobile. Baked into the bundle like the theme (remotion.config.ts), because the
// frame size and the list of bits are read at module scope: one bundle = one device.
declare const __FILM_DEVICE__: string | undefined;

type Device = 'desktop' | 'mobile';
const DEVICES: Device[] = ['desktop', 'mobile'];

const raw =
  typeof __FILM_DEVICE__ !== 'undefined'
    ? __FILM_DEVICE__
    : (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.FILM_DEVICE;

if (raw && !DEVICES.includes(raw as Device)) throw new Error(`device: FILM_DEVICE must be desktop or mobile, got "${raw}"`);

/** Portrait 1080x1920, story bits from src/bits/mobile/. */
export const MOBILE = ((raw as Device) || 'desktop') === 'mobile';
