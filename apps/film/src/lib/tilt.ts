// The standard 3D drift of app windows and devices: the graphe-relationnel
// window's motion, shared. Up to 4 degrees on Y and 2 on X, one slow cycle every 7 s, a pure
// function of the frame. Wrap the window in a parent with `perspective: TILT_PERSPECTIVE` and give
// the window's own box `tilt(F)` as its style.
import type React from 'react';

export const TILT_PERSPECTIVE = 2400;

/** Rotation angles at frame F. `phase` (frames) offsets the cycle so two windows don't move in lockstep. */
export const tiltAngles = (F: number, phase = 0) => ({
  y: 4 * Math.sin((2 * Math.PI * (F + phase)) / 420),
  x: 2 * Math.sin((2 * Math.PI * (F + phase)) / 300 + 1),
});

/** Style for the tilted box (preserve-3d so nested layers keep depth). */
export const tilt = (F: number, phase = 0): React.CSSProperties => {
  const a = tiltAngles(F, phase);
  return { transformStyle: 'preserve-3d', transform: `rotateX(${a.x}deg) rotateY(${a.y}deg)` };
};
