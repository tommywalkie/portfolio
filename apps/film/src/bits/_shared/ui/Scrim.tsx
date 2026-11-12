import React from 'react';
import { C } from '../../../brand/tokens';

export type ScrimProps = {
  /** Frame px where the fade starts (fully transparent above). */
  from: number;
  /** Frame px where the stage colour is solid; solid down to the bottom of the frame. */
  to: number;
  /** Solid opacity reached at `to` (1 = the stage itself, below 1 = a semi-transparent plate). */
  strength?: number;
  opacity?: number;
  /** 'up' mirrors it: solid at the top of the frame down to `to`, transparent from `from`. */
  dir?: 'down' | 'up';
};

/** Stage-coloured gradient between an illustration and the text laid over it (portrait layouts). */
export const Scrim: React.FC<ScrimProps> = ({ from, to, strength = 1, opacity = 1, dir = 'down' }) => {
  const top = dir === 'down' ? from : 0;
  const height = dir === 'down' ? undefined : from;
  const span = Math.abs(to - from);
  const edge = dir === 'down' ? 'to bottom' : 'to top';
  const solidAt = dir === 'down' ? span : from - to;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        bottom: dir === 'down' ? 0 : undefined,
        height,
        opacity: opacity * strength,
        background: `linear-gradient(${edge}, transparent 0px, ${C.stage} ${solidAt}px, ${C.stage} 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};
