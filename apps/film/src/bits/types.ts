import type React from 'react';
import type { SoundEvent } from '../sync';

/**
 * Props every story bit component takes. `seed` picks the variation: each bit decides what a seed
 * changes (layout, which horse wins, timing offsets...) through rand(`${slug}:${seed}:<what>`).
 * Seed 1 is the reference.
 */
export type BitProps = { seed: number };

export type BitModule = {
  slug: string;
  Component: React.FC<BitProps>;
  /** Sound events for this bit at this seed (absolute frames); empty while the film is silent. */
  cues?: (seed: number) => SoundEvent[];
};
