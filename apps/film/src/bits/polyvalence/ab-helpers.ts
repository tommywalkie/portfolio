// Helpers shared by polyvalence variant A and B. Pure TypeScript: no React, no frame reads.
import type { Tool } from '../../data/tools';

/** Chip height (px) by score: score 2 = 51, score 5 = 84. The chip's text is 40% of it. */
export const chipSize = (score: number) => 40 + (score - 1) * 11;

/** Width (px) of a ToolChip of height `size` for this label: padding, logo, gap and text, estimated. */
export const chipWidth = (t: Tool, size = chipSize(t.score)) => size * 1.34 + size * 0.21 * t.label.length;

/** A chip as a centred box, px. */
export type Box = { x: number; y: number; w: number; h: number };

/** Clearance between two centred boxes: the larger of the horizontal and vertical gaps (negative = overlap). */
export const gapOf = (a: Box, b: Box) => Math.max(Math.abs(a.x - b.x) - (a.w + b.w) / 2, Math.abs(a.y - b.y) - (a.h + b.h) / 2);
