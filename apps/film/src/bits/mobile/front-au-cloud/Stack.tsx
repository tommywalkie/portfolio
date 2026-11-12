import React from 'react';
import { C } from '../../../brand/tokens';
import { E, mix, prog } from '../../../lib/anim';
import { boxFaces, flat, pts } from './iso';

export const T = 40;
const LVL = { cloud: 0, backend: 290, frontend: 580 };
const HALF = 200;

export type StackProps = {
  F: number;
  c: (name: string) => number;
  seed: number;
};

const drop = (F: number, at: number) => (1 - prog(F, at, at + 60, E.out)) * 260;

const Box: React.FC<{ cx: number; y: number; cz: number; w: number; d: number; h: number; top: string; zf: string; xf: string; op?: number }> = ({ cx, y, cz, w, d, h, top, zf, xf, op = 1 }) => {
  const f = boxFaces(cx, y, cz, w, d, h);
  return (
    <g opacity={op}>
      <polygon points={pts(f.zFace)} fill={zf} />
      <polygon points={pts(f.xFace)} fill={xf} />
      <polygon points={pts(f.top)} fill={top} />
    </g>
  );
};

const Slab: React.FC<{ y: number; top: string; zf: string; xf: string; op: number }> = ({ y, top, zf, xf, op }) => (
  <Box cx={0} y={y} cz={0} w={HALF * 2} d={HALF * 2} h={T} top={top} zf={zf} xf={xf} op={op} />
);

const Panel: React.FC<{ cx: number; cz: number; w: number; d: number; y: number; op: number }> = ({ cx, cz, w, d, y, op }) => (
  <g opacity={op}>
    <Box cx={cx} y={y} cz={cz} w={w} d={d} h={10} top={C.appPaper} zf={C.appEdge} xf={C.appInkMute} />
    <polygon points={pts(flat(cx, y + 10.5, cz - d / 2 + 14, w - 20, 22))} fill={C.mid} />
    <polygon points={pts(flat(cx - 10, y + 10.5, cz + 14, w - 70, 12))} fill={C.appFill} />
    <polygon points={pts(flat(cx - 10, y + 10.5, cz + 36, w - 100, 12))} fill={C.appFill} />
  </g>
);

const Frontend: React.FC<StackProps> = ({ F, c }) => {
  const base = LVL.frontend + drop(F, c('fe'));
  const top = base + T;
  const op = prog(F, c('fe'), c('fe') + 30, E.smooth);
  const panels = [
    { cx: -95, cz: -40, w: 170, d: 120, at: c('feCards') },
    { cx: 70, cz: -70, w: 130, d: 110, at: c('feCards') + 18 },
    { cx: -10, cz: 90, w: 210, d: 90, at: c('feCards') + 36 },
  ];
  return (
    <g opacity={op}>
      <Slab y={base} top={C.objSoft} zf={C.objMute} xf={C.objDeep} op={1} />
      {panels.map((p, i) => {
        const q = prog(F, p.at, p.at + 36, E.out);
        return <Panel key={i} cx={p.cx} cz={p.cz} w={p.w} d={p.d} y={top + (1 - q) * 120} op={q} />;
      })}
      <Box cx={-95} y={top + 10 + (1 - prog(F, c('feCards') + 36, c('feCards') + 72, E.out)) * 120} cz={-40} w={28} d={28} h={24} top={C.mid} zf={C.objDeep} xf={C.objLine} op={prog(F, c('feCards') + 36, c('feCards') + 60, E.smooth)} />
    </g>
  );
};

const Backend: React.FC<StackProps> = ({ F, c, seed }) => {
  const base = LVL.backend + drop(F, c('be'));
  const top = base + T;
  const op = prog(F, c('be'), c('be') + 30, E.smooth);
  const rise = (i: number) => (1 - prog(F, c('beBlocks') + i * 9, c('beBlocks') + i * 9 + 36, E.out)) * 140;
  const blocks = [
    { cx: -110, cz: -60, w: 120, d: 120, h: 100, i: 0 },
    { cx: 60, cz: -110, w: 100, d: 100, h: 70, i: 1 },
    { cx: 70, cz: 80, w: 130, d: 110, h: 120, i: 2 },
  ];
  const redisOn = prog(F, c('redis'), c('redis') + 24, E.smooth);
  const pulse = 0.5 + 0.5 * Math.sin(((F - c('redis')) / 60) * Math.PI * 2 * 0.9);

  const starts: [number, number, number, number] = [c('pkt'), c('pkt'), c('req2'), c('req2')];
  const from: [[number, number], [number, number], [number, number], [number, number]] = [
    [-110, -60],
    [70, 80],
    [60, -110],
    [70, 80],
  ];
  const packets = starts.map((start, k) => {
    const u = ((F - start + rand01(seed, k) * 60) / 60 / 2.2) % 1;
    const a = from[k];
    const b: [number, number] = [-10, 170];
    const x = mix(a[0], b[0], u);
    const z = mix(a[1], b[1], u);
    const on = prog(F, start, start + 24, E.smooth);
    return { x, z, on };
  });
  return (
    <g opacity={op}>
      <Slab y={base} top={C.objMute} zf={C.objDeep} xf={C.objLine} op={1} />
      {blocks.map((b) => (
        <Box key={b.i} cx={b.cx} y={top + rise(b.i)} cz={b.cz} w={b.w} d={b.d} h={b.h} top={C.objBright} zf={C.objMute} xf={C.objDeep} op={prog(F, c('beBlocks') + b.i * 9, c('beBlocks') + b.i * 9 + 24, E.smooth)} />
      ))}
      <Box cx={-10} y={top} cz={170} w={84} d={84} h={46} top={C.objBright} zf={C.objMute} xf={C.objDeep} op={redisOn} />
      <polygon points={pts(flat(-10, top + 47, 170, 84 + 26 * pulse, 84 + 26 * pulse))} fill="none" stroke={C.objSoft} strokeWidth={3} opacity={redisOn * (0.2 + 0.5 * pulse)} />
      {packets.map((pk, k) => (
        <polygon key={k} points={pts(flat(pk.x, top + 2, pk.z, 18, 18))} fill={C.objWhite} opacity={pk.on} />
      ))}
    </g>
  );
};

const rand01 = (seed: number, k: number) => ((seed * 7919 + k * 104729) % 1000) / 1000;

const Cloud: React.FC<StackProps> = ({ F, c }) => {
  const base = LVL.cloud + drop(F, c('cl'));
  const top = base + T;
  const op = prog(F, c('cl'), c('cl') + 30, E.smooth);
  const boxes = [
    { cx: -120, cz: -70, w: 130, d: 130, h: 70 },
    { cx: 50, cz: -90, w: 110, d: 110, h: 90 },
    { cx: 40, cz: 100, w: 150, d: 110, h: 60 },
  ];
  const fall = (i: number) => (1 - prog(F, c('containers') + i * 12, c('containers') + i * 12 + 36, E.out)) * 220;

  const deployed = (i: number) => prog(F, c('deploy') + i * 18, c('deploy') + i * 18 + 24, E.smooth);
  return (
    <g opacity={op}>
      <Slab y={base} top={C.mid} zf={C.objDeep} xf={C.objLine} op={1} />
      {boxes.map((b, i) => (
        <Box key={i} cx={b.cx} y={top + fall(i)} cz={b.cz} w={b.w} d={b.d} h={b.h} top={C.objBright} zf={C.objMute} xf={C.objDeep} op={prog(F, c('containers') + i * 12, c('containers') + i * 12 + 24, E.smooth)} />
      ))}
      <Box cx={185} y={top} cz={-170} w={96} d={96} h={44} top={C.objBright} zf={C.objMute} xf={C.objDeep} op={prog(F, c('containers') + 30, c('containers') + 54, E.smooth)} />
      {boxes.map((b, i) => (
        <polygon key={`l${i}`} points={pts(flat(b.cx, top + b.h + fall(i) + 0.5, b.cz, 26, 26))} fill={C.accentDeep} opacity={deployed(i)} />
      ))}
    </g>
  );
};

export const Stack: React.FC<StackProps & { between?: React.ReactNode }> = ({ between, ...p }) => (
  <g>
    <polygon points={pts(flat(0, -2, 0, 560, 560))} fill={C.objInk2} opacity={0.7} />
    <Cloud {...p} />
    {between}
    <Backend {...p} />
    <Frontend {...p} />
  </g>
);
