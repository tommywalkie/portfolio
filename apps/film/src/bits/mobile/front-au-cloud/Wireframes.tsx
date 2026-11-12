import React from 'react';
import { C, FONT } from '../../../brand/tokens';
import { typeFrames } from '../../../fx/TypeOn';
import { arrive, E, fd, mix, prog, rand } from '../../../lib/anim';
import { H, W } from '../../../timeline';
import { useStrings } from '../../../lib/i18n';
import { STR } from './copy';
import { IDE_LINES, type Run } from './data';

// Boxes at design size; WIRE_S scales each one around its centre, so x/y place the unscaled box.
const PLACE = {
  react: { x: 103, y: 230, w: 250, h: 190 },
  swagger: { x: 103, y: 600, w: 250, h: 200 },
  ide: { x: 650, y: 240, w: 300, h: 240 },
  aws: { x: 103, y: 975, w: 250, h: 190 },
} as const;

const WIRE_S = 1.25;

const SHOW_SWAGGER = false;

const POSE_LEFT = { from: { rx: 12, ry: -85, z: -160 }, rest: { rx: 6, ry: 22, z: 0 } };
const POSE_RIGHT = { from: { rx: 12, ry: 85, z: -160 }, rest: { rx: 6, ry: -22, z: 0 } };

type Box = { x: number; y: number; w: number; h: number };

type Pose = { rx: number; ry: number; z: number };
export type WireProps = {
  F: number;
  c: (name: string) => number;
  seed: number;
};

const CHROME = 34;
const LINE = 20;

const phaseOf = (seed: number, key: string) => rand(`front-au-cloud:${seed}:float:${key}`) * Math.PI * 2;

const Wrap: React.FC<{ box: Box; F: number; enter: number; exit?: number; phase: number; from: Pose; rest: Pose; children: React.ReactNode }> = ({
  box,
  F,
  enter,
  exit,
  phase,
  from,
  rest,
  children,
}) => {
  const a = prog(F, enter, enter + 30, E.smooth);
  const swing = prog(F, enter, enter + 64, E.out);
  const lift = (1 - arrive(prog(F, enter, enter + 30, E.out))) * 16;
  const q = exit === undefined ? 0 : prog(F, exit, exit + 36, E.inOut);
  const dy = Math.sin((F / 170) * Math.PI * 2 + phase) * 4;
  const dx = Math.sin((F / 230) * Math.PI * 2 + phase * 1.7) * 2.5;
  const ry = mix(from.ry, rest.ry, swing) + dy;
  const rx = mix(from.rx, rest.rx, swing) + dx;
  const z = mix(from.z, rest.z, swing);
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y + lift,
        width: box.w,
        height: box.h,
        opacity: a * (1 - q),
        transformOrigin: '50% 50%',
        transform: `perspective(1400px) translateZ(${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${WIRE_S})`,
      }}
    >
      {children}
    </div>
  );
};

const SKIN = {
  light: { edge: C.appEdge, body: C.appPage, chrome: C.appPaper, chromeLine: C.appFill, dot: C.appFill, pill: C.appPage, pillInk: C.mid, shadow: '0 18px 50px rgba(0,0,0,.45)' },
  dark: { edge: C.dkLine, body: C.dkPage, chrome: C.dkChrome, chromeLine: C.dkLine, dot: C.dkFill, pill: C.dkPanel, pillInk: C.dkMute, shadow: '0 18px 50px rgba(0,0,0,.45)' },
};

const Frame: React.FC<{ title: string; mono?: boolean; dark?: boolean; children: React.ReactNode }> = ({ title, mono, dark, children }) => {
  const s = dark ? SKIN.dark : SKIN.light;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        boxSizing: 'border-box',
        border: `3px solid ${s.edge}`,
        borderRadius: 14,
        background: s.body,
        overflow: 'hidden',
        boxShadow: s.shadow,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: CHROME, boxSizing: 'border-box', background: s.chrome, borderBottom: `2px solid ${s.chromeLine}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 12 + i * 14, top: 12, width: 8, height: 8, borderRadius: 4, background: s.dot }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 64,
            right: 12,
            top: 7,
            height: 20,
            boxSizing: 'border-box',
            padding: '0 10px',
            borderRadius: 10,
            background: s.pill,
            fontFamily: mono ? FONT.mono : FONT.text,
            fontSize: 12,
            lineHeight: '20px',
            color: s.pillInk,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: CHROME, right: 0, bottom: 0 }}>{children}</div>
    </div>
  );
};

const ReactPage: React.FC<WireProps & { n?: string }> = ({ F, c, seed, n = '' }) => {
  const { UI } = useStrings(STR);
  const t0 = c(`reactIn${n}`);
  const spin = (F - t0) * 1.4;
  return (
    <Wrap box={PLACE.react} F={F} enter={t0} exit={c(`reactOut${n}`)} phase={phaseOf(seed, `react${n}`)} {...POSE_LEFT}>
      <Frame title={UI.react.url}>
        <div style={{ position: 'absolute', left: 12, right: 12, top: 8, bottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center' }}>
          <svg width={48} height={48} viewBox="-50 -50 100 100">
            <g transform={`rotate(${spin.toFixed(2)})`}>
              {[0, 60, 120].map((r) => (
                <ellipse key={r} cx={0} cy={0} rx={46} ry={17} fill="none" stroke={C.mid} strokeWidth={4} transform={`rotate(${r})`} />
              ))}
            </g>
            <circle cx={0} cy={0} r={7} fill={C.accentDeep} />
          </svg>
          <div style={{ fontFamily: FONT.text, fontSize: 16, fontWeight: 700, color: C.appInk, lineHeight: 1.2 }}>{UI.react.title}</div>
          <div style={{ fontFamily: FONT.text, fontSize: 12, color: C.appInk, lineHeight: 1.4 }}>{UI.react.body}</div>
          <div style={{ fontFamily: FONT.text, fontSize: 12, fontWeight: 600, color: C.mid, lineHeight: 1.4 }}>{UI.react.link}</div>
        </div>
      </Frame>
    </Wrap>
  );
};

const METHOD: Record<string, [string, string]> = {
  GET: [C.mid, C.appHi],
  POST: [C.accentDeep, C.appInk],
  PATCH: [C.appFill, C.appInk],
  DELETE: [C.pendingRed, C.appInk],
};

const SwaggerPage: React.FC<WireProps> = ({ F, c, seed }) => {
  const { UI } = useStrings(STR);
  const t0 = c('swaggerIn');
  const r0 = c('swaggerRows');
  return (
    <Wrap box={PLACE.swagger} F={F} enter={t0} exit={c('swaggerOut')} phase={phaseOf(seed, 'swagger')} {...POSE_LEFT}>
      <Frame title={UI.swagger.url}>
        <div style={{ position: 'absolute', left: 12, right: 12, top: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 22 }}>
            <div style={{ fontFamily: FONT.text, fontSize: 15, fontWeight: 700, color: C.appInk, lineHeight: '22px', whiteSpace: 'nowrap' }}>{UI.swagger.title}</div>
            <div style={{ fontFamily: FONT.text, fontSize: 10, fontWeight: 700, color: C.appHi, background: C.appInkMute, borderRadius: 6, padding: '2px 7px', lineHeight: 1.2 }}>{UI.swagger.version}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
            {UI.swagger.rows.map(([m, p], i) => {
              const a = prog(F, r0 + i * 8, r0 + i * 8 + 20, E.out);
              const [fill, ink] = METHOD[m];
              return (
                <div
                  key={p}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24, padding: '0 8px', boxSizing: 'border-box', borderRadius: 7, background: C.appPaper, opacity: a, transform: `translateX(${((1 - a) * -8).toFixed(2)}px)` }}
                >
                  <div style={{ flex: 'none', width: 54, height: 16, borderRadius: 5, background: fill, color: ink, fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, lineHeight: '16px', textAlign: 'center' }}>{m}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.appInk, whiteSpace: 'nowrap' }}>{p}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Frame>
    </Wrap>
  );
};

const KIND: Record<Run[1], { color: string; weight: number }> = {
  deco: { color: C.accent, weight: 700 },
  key: { color: C.dkMute, weight: 400 },
  cls: { color: C.dkInk, weight: 700 },
  punct: { color: C.dkDim, weight: 400 },
};

const head = (s: string, n: number) =>
  Array.from(s)
    .filter((_, i) => i < n)
    .join('');

const Ide: React.FC<WireProps> = ({ F, c, seed }) => {
  const { UI } = useStrings(STR);
  const t0 = c('ideIn');
  const typeAt = c('ideType');
  const text = IDE_LINES.map((runs) => runs.map((r) => r[0]).join('')).join('\n');
  const keys = typeFrames(text.length, { start: typeAt, cps: 30 });
  const n = keys.filter((k) => k <= fd(F)).length;
  const blink = Math.floor(fd(F) / 16) % 2 === 0;
  let start = 0;
  const rows = IDE_LINES.map((runs, li) => {
    const len = runs.reduce((sum, r) => sum + r[0].length, 0);
    const shown = Math.max(0, Math.min(len, n - start));
    const caret = n >= start && n <= start + len;
    start += len + 1;
    let left = shown;
    return (
      <div key={li} style={{ height: LINE, whiteSpace: 'pre', fontFamily: FONT.mono, fontSize: 13, lineHeight: `${LINE}px`, color: C.dkBody }}>
        {runs.map(([s, kind], k) => {
          const take = Math.max(0, Math.min(s.length, left));
          left -= s.length;
          if (take <= 0) return null;
          return (
            <span key={k} style={{ color: KIND[kind].color, fontWeight: KIND[kind].weight }}>
              {head(s, take)}
            </span>
          );
        })}
        {caret && (n < text.length || blink) ? <span style={{ display: 'inline-block', width: 7, height: 14, marginLeft: 1, verticalAlign: 'middle', background: C.accent }} /> : null}
      </div>
    );
  });
  return (
    <Wrap box={PLACE.ide} F={F} enter={t0} exit={c('ideOut')} phase={phaseOf(seed, 'ide')} {...POSE_RIGHT}>
      <Frame title={UI.ide.title} mono dark>
        <div style={{ position: 'absolute', left: 12, right: 12, top: 10 }}>{rows}</div>
      </Frame>
    </Wrap>
  );
};

const Aws: React.FC<WireProps & { n?: string }> = ({ F, c, seed, n = '' }) => {
  const { UI } = useStrings(STR);
  const t0 = c(`awsIn${n}`);
  const r0 = c(`awsRows${n}`);
  return (
    <Wrap box={PLACE.aws} F={F} enter={t0} exit={c(`awsOut${n}`)} phase={phaseOf(seed, `aws${n}`)} {...POSE_LEFT}>
      <Frame title={UI.aws.url}>
        <div style={{ position: 'absolute', left: 12, right: 12, top: 10 }}>
          <div style={{ fontFamily: FONT.text, fontSize: 14, fontWeight: 700, color: C.appInk, lineHeight: '20px' }}>{UI.aws.head}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {UI.aws.rows.map(([kind, name], i) => {
              const a = prog(F, r0 + i * 12, r0 + i * 12 + 18, E.smooth);
              const on = prog(F, r0 + i * 12 + 16, r0 + i * 12 + 34, E.smooth);
              return (
                <div
                  key={name}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, height: 32, padding: '0 10px', boxSizing: 'border-box', borderRadius: 8, background: C.appPaper, opacity: a }}
                >
                  <div style={{ flex: 'none', width: 46, height: 20, borderRadius: 6, background: C.appInkMute, color: C.appHi, fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, lineHeight: '20px', textAlign: 'center' }}>{kind}</div>
                  <div style={{ flex: 1, minWidth: 0, fontFamily: FONT.mono, fontSize: 13, color: C.appInk, whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ flex: 'none', width: 9, height: 9, borderRadius: 5, background: C.appFill, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 9, height: 9, borderRadius: 5, background: C.accentDeep, opacity: on }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Frame>
    </Wrap>
  );
};

export const Wireframes: React.FC<WireProps> = (p) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
    <ReactPage {...p} />
    <ReactPage {...p} n="2" />
    {SHOW_SWAGGER && <SwaggerPage {...p} />}
    <Ide {...p} />
    <Aws {...p} />
    <Aws {...p} n="2" />
  </div>
);
