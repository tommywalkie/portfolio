import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { Chain } from '../../../fx/Chain';
import { arrive, clamp, E, lmix, mix, prog, rand, SPR, spr } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import { TILT_PERSPECTIVE, tilt } from '../../../lib/tilt';
import { actOf, CUE } from '../../../timeline';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';
import { DeviceFrame } from '../../_shared/ui/DeviceFrame';
import { STR } from './copy';
import { ROUTE_TOTAL } from './data';
import { COL_X, DETAIL_GAP, headlineBox, headlineSize, MobileCard, TEXT_GAP } from '../layout';
import { lengthOf, pointAt, ROUTES, SCAN_F, STOPS, stopArcs, VH, VW, type Pt } from './route';
import { QrGlyph, SitePlan, type StopView, type Tone } from './SitePlan';

const SLUG = 'sncf-carte';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const pickOf = (seed: number): number[] => {
  if (seed === 1) return [0, 1, 2];
  return STR.fr.tools.map((_, i) => i)
    .sort((a, b) => rand(`${SLUG}:${seed}:order:${a}`) - rand(`${SLUG}:${seed}:order:${b}`))
    .slice(0, 3);
};
const brokenOf = (seed: number) => (seed === 1 ? 1 : Math.floor(rand(`${SLUG}:${seed}:broken`) * 3));
const variantOf = (seed: number) => (seed === 1 ? 0 : rand(`${SLUG}:${seed}:route`) < 0.5 ? 0 : 1);

const SCR = { w: 1480, h: 900, r: 40, pad: 28 };
const HEAD = 84;
const PANEL_W = 420;

const LOCAL_C = [SCR.w / 2, SCR.h / 2] as const;
const DEV_C0 = [540, 900] as const;
const DEV_C1 = [540, 600] as const;
// The landscape tablet with its bezel spans the 936 px between the margins.
const FULL = 936 / (SCR.w + 2 * SCR.pad);
const SMALL = FULL;
const ZOOM = 1.3;

const TABLET_BOTTOM = 891;
const BLOCK_Y = TABLET_BOTTOM + TEXT_GAP;

const ripple = (F: number, cue: number, x: number, y: number, key: string) => {
  if (F < cue) return null;
  const p = prog(F, cue, cue + 30, E.out);
  const r = mix(12, 150, p);
  return (
    <div
      key={key}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 2 * r,
        height: 2 * r,
        borderRadius: '50%',
        background: C.mid,
        opacity: 0.4 * (1 - p),
        transform: `translate(${x - r}px, ${y - r}px)`,
      }}
    />
  );
};

const txt = (size: number, weight: number, color: string): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.2,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'pre',
});

const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const arcAt = (F: number, legs: [number, number, number, number][]) => {
  for (const [t0, t1, s0, s1] of legs) {
    if (F < t0) return s0;
    if (F < t1) return mix(s0, s1, prog(F, t0, t1, E.smooth));
  }
  return legs[legs.length - 1][3];
};

const Bit: React.FC<BitProps> = ({ seed }) => {

  const TX = useStrings(STR);
  const { app: APP, status: STATUS, tools: TOOLS, experience: EXPERIENCE, msg: MSG_LINES, chip: chipOf } = TX;
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const Fd = Math.round(F);

  const order = pickOf(seed);
  const broken = brokenOf(seed);
  const route = ROUTES[variantOf(seed)];
  const arcs = stopArcs(route.pts);
  const len = lengthOf(route.pts);

  const adds = [K('tapAdd1'), K('tapAdd2'), K('tapAdd3')];
  const marks = [K('mark1'), K('mark2'), K('mark3')];
  const arrs = [K('arr1'), K('arr2'), K('arr3')];
  const toneOf = (i: number): Tone => (Fd >= marks[i] ? (i === broken ? 'broken' : 'good') : 'wait');

  const open = K('open');
  const entry = mix(0.94, 1, prog(F, open, open + 30, E.out));
  const camP = prog(F, K('cam0'), K('cam1'), E.cam);
  const S = lmix(entry * FULL, SMALL, camP);
  const dcx = mix(DEV_C0[0], DEV_C1[0], camP);
  const dcy = mix(DEV_C0[1], DEV_C1[1], camP);
  const tx = dcx - LOCAL_C[0] * S;
  const ty = dcy - LOCAL_C[1] * S;

  const legs: [number, number, number, number][] = [
    [K('walk0'), arrs[0], 0, arcs[0]],
    [K('leave1'), arrs[1], arcs[0], arcs[1]],
    [K('leave2'), arrs[2], arcs[1], arcs[2]],
  ];
  const agent: Pt = pointAt(route.pts, arcAt(F, legs));
  const z = lmix(lmix(1, ZOOM, prog(F, K('walk0'), arrs[0], E.cam)), 1, prog(F, K('zoom0'), K('zoom1'), E.cam));
  const hw = VW / (2 * z);
  const hh = VH / (2 * z);
  const camX = clamp(agent[0], hw, VW - hw);
  const camY = clamp(agent[1], hh, VH - hh);
  const drawn = prog(F, K('drawFrom'), K('drawTo'), E.inOut);

  const stops: StopView[] = STOPS.map((at, i) => ({ at, tone: toneOf(i), label: i + 1, scale: spr(F, adds[i], SPR.micro) }));

  let scan: { i: number; env: number; t: number } | null = null;
  for (let i = 0; i < arrs.length; i++) {
    const a = arrs[i];
    const env = prog(F, a, a + 10, E.out) * (1 - prog(F, a + SCAN_F, a + SCAN_F + 12, E.smooth));
    if (env > 0 && (!scan || env > scan.env)) scan = { i, env, t: clamp((F - a) / SCAN_F) };
  }

  const slots = [0, 1, 2].map((i) => {
    const add = adds[i];
    const on = Fd >= add;
    const p = prog(F, add + 6, add + 30, E.glide);
    const tone = toneOf(i);
    return (
      <div
        key={`slot${i}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 364,
          height: 92,
          boxSizing: 'border-box',
          borderRadius: 18,
          transform: `translate(${28 + (on ? mix(40, 0, p) : 0)}px, ${86 + i * 108}px)`,
          background: on ? C.appPage : 'transparent',
          border: on ? 'none' : `2px dashed ${C.appFill}`,
          opacity: on ? p : 1,
        }}
      >
        {!on && (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 364, height: 92, display: 'flex', alignItems: 'center', paddingLeft: 26, boxSizing: 'border-box', ...txt(28, 700, C.appFill) }}>
            {String(i + 1)}
          </div>
        )}
        {on && (
          <>
            <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(18px, 18px)' }}>
              <QrGlyph size={52} ink={C.appInk} paper={C.appPaper} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(92px, 12px)', whiteSpace: 'nowrap', ...txt(21, 700, C.appInk) }}>{TOOLS[order[i]]}</div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: 32,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 16px',
                borderRadius: 16,
                transform: 'translate(92px, 50px)',
                background: tone === 'good' ? C.accentDeep : tone === 'broken' ? C.pendingRed : 'transparent',
                color: tone === 'wait' ? C.appInkFaint : C.appHi,
                ...txt(20, 800, tone === 'wait' ? C.appInkFaint : C.appHi),
              }}
            >
              {tone === 'good' && <CheckIcon size={18} color={C.appHi} />}
              {tone === 'good' ? STATUS.good : tone === 'broken' ? STATUS.broken : STATUS.wait}
            </div>
          </>
        )}
      </div>
    );
  });

  const chipP = prog(F, K('chip'), K('chip') + 24, E.out);

  const msgSize = headlineSize(...MSG_LINES);
  const pitch = headlineBox(msgSize);
  const blockTop = BLOCK_Y;
  const cardY = blockTop + 2 * pitch + DETAIL_GAP;

  return (
    <AbsoluteFill style={{ background: C.stage }}>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SCR.w,
          height: SCR.h,
          transformOrigin: '0px 0px',
          transform: `translate(${tx}px, ${ty}px) scale(${S})`,
        }}
      >

        <div style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR.h, perspective: TILT_PERSPECTIVE }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR.h, ...tilt(F, 0) }}>
            <DeviceFrame x={0} y={0} w={SCR.w} h={SCR.h} r={SCR.r} pad={SCR.pad} opacity={1} camera={1} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR.h, borderRadius: SCR.r, overflow: 'hidden', background: C.appPage }}>

              <div style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: HEAD, background: C.appPaper }}>
                <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(40px, 24px)', ...txt(32, 700, C.appInk) }}>{APP.name}</div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: 2, background: C.appFill, transform: `translate(0px, ${HEAD - 2}px)` }} />
              </div>

              <div style={{ position: 'absolute', left: 0, top: HEAD, width: PANEL_W, height: SCR.h - HEAD, background: C.appPaper, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(36px, 34px)', ...txt(30, 700, C.appInk) }}>{APP.panel}</div>
                {slots}

                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 364,
                    height: 64,
                    borderRadius: 32,
                    background: C.mid,
                    transform: 'translate(28px, 426px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...txt(28, 700, C.appHi),
                  }}
                >
                  {APP.add}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 364,
                    height: 64,
                    borderRadius: 32,
                    background: C.appInkMute,
                    transform: 'translate(28px, 510px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...txt(28, 700, C.appHi),
                  }}
                >
                  {APP.route}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 364,
                    height: 84,
                    boxSizing: 'border-box',
                    borderRadius: 22,
                    background: C.appPage,
                    border: `2px solid ${C.appFill}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: chipP,
                    transform: `translate(28px, ${616 + 12 * (1 - arrive(chipP))}px)`,
                    ...txt(30, 800, C.appInk),
                  }}
                >
                  {chipOf(ROUTE_TOTAL)}
                </div>
                {ripple(F, K('tapAdd1'), 210, 458, 'ra1')}
                {ripple(F, K('tapAdd2'), 210, 458, 'ra2')}
                {ripple(F, K('tapAdd3'), 210, 458, 'ra3')}
                {ripple(F, K('tapRoute'), 210, 542, 'rr')}
              </div>

              <div style={{ position: 'absolute', left: PANEL_W, top: HEAD, width: VW, height: VH, overflow: 'hidden', background: C.mapGround }}>
                <SitePlan z={z} cx={camX} cy={camY} route={route.pts} drawn={drawn} length={len} agent={agent} stops={stops} />

                {[
                  { y: 24, d: 'M16 32h32M32 16v32' },
                  { y: 104, d: 'M16 32h32' },
                ].map((b) => (
                  <div
                    key={`zb${b.y}`}
                    style={{ position: 'absolute', left: 0, top: 0, width: 64, height: 64, borderRadius: 14, background: C.appPaper, boxShadow: `0px 2px 0px ${C.appFill}`, transform: `translate(${VW - 24 - 64}px, ${b.y}px)` }}
                  >
                    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" stroke={C.appInk} strokeWidth={4} strokeLinecap="round">
                      <path d={b.d} />
                    </svg>
                  </div>
                ))}

                {scan && (
                  <>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, background: C.appInk, opacity: 0.42 * scan.env }} />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: 300,
                        height: 300,
                        opacity: scan.env,
                        transform: `translate(${VW / 2 - 150}px, ${VH / 2 - 170}px) scale(${mix(0.9, 1, scan.env)})`,
                      }}
                    >
                      <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: 'absolute', left: 0, top: 0 }}>
                        <path
                          d="M4 60V4H60M240 4H296V60M296 240V296H240M60 296H4V240"
                          fill="none"
                          stroke={C.accentDeep}
                          strokeWidth={8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div style={{ position: 'absolute', left: 40, top: 40, width: 220, height: 220, borderRadius: 16, background: C.appPaper }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(20px, 20px)' }}>
                          <QrGlyph size={180} ink={C.appInk} />
                        </div>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          left: 46,
                          top: 40 + 20 + scan.t * 180,
                          width: 208,
                          height: 4,
                          borderRadius: 2,
                          background: C.accentDeep,
                        }}
                      />
                    </div>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, textAlign: 'center', transform: `translate(0px, ${VH / 2 + 160}px)`, opacity: scan.env, ...txt(28, 700, C.appHi) }}>
                      {APP.scan}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Chain chain={`${SLUG}.marche1`} frame={f} from={act.from} role="display" size={msgSize} x={COL_X} top={blockTop} align="left" />
      <Chain chain={`${SLUG}.marche2`} frame={f} from={act.from} role="display" size={msgSize} x={COL_X} top={blockTop + pitch} align="left" />

      <MobileCard logo="companies/sncf.jpg" name={EXPERIENCE.company} activity={EXPERIENCE.activity} period={EXPERIENCE.period} F={F} at={K('card')} y={cardY} />
    </AbsoluteFill>
  );
};

const cues = (seed: number): SoundEvent[] => {
  void seed;
  const ev: SoundEvent[] = [];
  ['tapAdd1', 'tapAdd2', 'tapAdd3'].forEach((n, i) => {
    ev.push(sfx('tap', K(n), `add${i + 1}`));
    ev.push(sfx('item', K(n) + 8, `slot${i + 1}`, { weight: 0.6 }));
  });
  ev.push(sfx('tap', K('tapRoute'), 'route-tap', { weight: 1.2 }));
  ev.push(sfx('panel', (K('drawFrom') + K('drawTo')) / 2, 'route-draw', { weight: 0.4, apexFrac: 0.5 }));
  ev.push(sfx('item', K('chip') + 6, 'chip'));
  ev.push(sfx('step', K('walk0'), 'walk0', { weight: 0.6 }));
  ['arr1', 'arr2', 'arr3'].forEach((n, i) => {
    ev.push(sfx('scan', K(n), `scan${i + 1}`));
    ev.push(sfx('status', K(`mark${i + 1}`), `mark${i + 1}`, { weight: 1.2 }));
  });
  ev.push(sfx('camera', (K('zoom0') + K('zoom1')) / 2, 'zoom', { weight: 0.8, apexFrac: 0.5 }));
  ev.push(sfx('camera', (K('cam0') + K('cam1')) / 2, 'cam', { weight: 0.7, pan: -0.2, apexFrac: 0.5 }));
  ev.push(sfx('text', K('copy') + 6, 'headline'));
  ev.push(sfx('card', K('card') + 8, 'card', { weight: 0.9 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
