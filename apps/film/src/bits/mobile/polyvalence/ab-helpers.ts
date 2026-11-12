import type { Tool } from '../../../data/tools';

export const chipSize = (score: number) => 40 + (score - 1) * 11;

export const chipWidth = (t: Tool, size = chipSize(t.score)) => size * 1.34 + size * 0.21 * t.label.length;

export type Box = { x: number; y: number; w: number; h: number };

export const gapOf = (a: Box, b: Box) => Math.max(Math.abs(a.x - b.x) - (a.w + b.w) / 2, Math.abs(a.y - b.y) - (a.h + b.h) / 2);
