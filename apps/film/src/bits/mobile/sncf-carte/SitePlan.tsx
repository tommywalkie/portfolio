import React from 'react';
import { C, FONT } from '../../../brand/tokens';
import { type Pt, VH, VW } from './route';
import { QR_CELLS } from './data';

export type Tone = 'wait' | 'good' | 'broken';
export type StopView = { at: Pt; tone: Tone; label: number; scale: number };

export const QrGlyph: React.FC<{ size: number; ink: string; paper?: string }> = ({ size, ink, paper }) => {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++)
      if (QR_CELLS[r * 7 + c] === '1') cells.push(<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={ink} />);
  return (
    <svg width={size} height={size} viewBox="0 0 7 7" shapeRendering="crispEdges">
      {paper && <rect x={0} y={0} width={7} height={7} fill={paper} />}
      {cells}
    </svg>
  );
};

const TONE = { wait: C.mid, good: C.accentDeep, broken: C.pendingRed } as const;

const BLOCKS: [number, number, number, number][] = [
  [70, 60, 230, 190],
  [360, 40, 170, 220],
  [600, 70, 200, 160],
  [840, 50, 170, 200],
  [70, 580, 220, 170],
  [380, 600, 260, 130],
  [740, 590, 260, 150],
];
const TREES: Pt[] = [
  [24, 250],
  [330, 252],
  [575, 258],
  [1036, 240],
  [330, 560],
  [1030, 600],
  [660, 780],
];
const BAND = { top: 350, bottom: 448 };
const RAILS = [364, 388, 412, 436];
const CROSSINGS = [520, 720, 960];
const WALK_UP = 300;
const WALK_DOWN = 510;

const polyD = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');

const Walk: React.FC<{ pts: Pt[] }> = ({ pts }) => (
  <>
    <path d={polyD(pts)} fill="none" stroke={C.appFill} strokeWidth={40} strokeOpacity={0.55} strokeLinejoin="round" />
    <path d={polyD(pts)} fill="none" stroke={C.mapWalk} strokeWidth={34} strokeLinejoin="round" />
  </>
);

export const SitePlan: React.FC<{
  z: number;
  cx: number;
  cy: number;
  route: Pt[];
  drawn: number;
  length: number;
  agent: Pt;
  stops: StopView[];
}> = ({ z, cx, cy, route, drawn, length, agent, stops }) => (
  <svg width={VW} height={VH} style={{ position: 'absolute', left: 0, top: 0 }}>
    <g transform={`translate(${VW / 2 - cx * z} ${VH / 2 - cy * z}) scale(${z})`}>

      <rect x={-200} y={-200} width={VW + 400} height={VH + 400} fill={C.mapGround} />

      {TREES.map((t, i) => (
        <circle key={`t${i}`} cx={t[0]} cy={t[1]} r={16} fill={C.appFill} opacity={0.7} />
      ))}

      {BLOCKS.map(([x, y, w, h], i) => (
        <g key={`b${i}`}>
          <rect x={x} y={y} width={w} height={h} rx={12} fill={C.mapBuilding} />
          <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} rx={8} fill="none" stroke={C.appFill} strokeWidth={3} />
        </g>
      ))}

      <Walk pts={[[0, WALK_UP], [VW, WALK_UP]]} />
      <Walk pts={[[0, WALK_DOWN], [VW, WALK_DOWN]]} />
      {CROSSINGS.map((x) => (
        <React.Fragment key={`c${x}`}>
          <Walk pts={[[x, WALK_UP], [x, BAND.top]]} />
          <Walk pts={[[x, BAND.bottom], [x, WALK_DOWN]]} />
        </React.Fragment>
      ))}

      <rect x={-20} y={BAND.top} width={VW + 40} height={BAND.bottom - BAND.top} fill={C.mapGround} />
      {Array.from({ length: Math.ceil((VW + 40) / 22) }, (_, i) => (
        <rect key={`s${i}`} x={-20 + i * 22} y={BAND.top + 2} width={8} height={BAND.bottom - BAND.top - 4} fill={C.mapSleeper} />
      ))}
      {RAILS.map((y) => (
        <line key={`r${y}`} x1={-20} y1={y} x2={VW + 20} y2={y} stroke={C.mapRail} strokeWidth={4} />
      ))}

      {CROSSINGS.map((x) => (
        <g key={`x${x}`}>
          <rect x={x - 17} y={BAND.top} width={34} height={BAND.bottom - BAND.top} fill={C.mapWalk} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={x - 17} y={BAND.top + 6 + k * 22} width={34} height={9} fill={C.appFill} />
          ))}
        </g>
      ))}

      <path
        d={polyD(route)}
        fill="none"
        stroke={C.appPaper}
        strokeWidth={18}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - drawn)}
      />
      <path
        d={polyD(route)}
        fill="none"
        stroke={C.accentDeep}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - drawn)}
      />

      {stops.map((s) => (
        <g key={`m${s.label}`} transform={`translate(${s.at[0]} ${s.at[1]}) scale(${s.scale})`}>
          <circle r={24} fill={TONE[s.tone]} stroke={C.appPaper} strokeWidth={4} />
          <text
            x={0}
            y={8.5}
            textAnchor="middle"
            fontFamily={FONT.text}
            fontSize={24}
            fontWeight={800}
            fill={C.appHi}
          >
            {s.label}
          </text>
        </g>
      ))}

      <g transform={`translate(${agent[0]} ${agent[1]})`}>
        <circle r={30} fill={C.accentDeep} opacity={0.22} />
        <circle r={14} fill={C.appInk} stroke={C.appPaper} strokeWidth={4} />
      </g>
    </g>
  </svg>
);
