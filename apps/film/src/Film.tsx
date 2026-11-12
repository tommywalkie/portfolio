import React from 'react';
import { AbsoluteFill, getStaticFiles, Html5Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { E, prog } from './lib/anim';
import { BIT_MODULES, FILM_SEED } from './bits/registry';
import { C } from './brand/tokens';
import { Audit } from './lib/Audit';
import { FontGate } from './lib/FontGate';
import { LocaleProvider } from './lib/i18n';
import type { Locale } from './lib/locale';
import type { SafeSpec } from './lib/safe';
import { planActs, W } from './timeline';

// Transitions between story bits.
// Where no transition is specified, the boundaries take turns through the four approved ones, in order. Each side of a
// boundary plays inside its own act (the outgoing bit's last T_LEN frames, the incoming bit's first T_LEN frames), so
// no bit's timing moves. The specific choices: the calculator fades in (the film's first frame); rugby comes in from
// the right and leaves to the left (push, with a speed blur); polyvalence fades in stronger and a bit longer.
type TKind = 'blur' | 'fade' | 'push' | 'zoom' | 'slide';
type TSpec = { kind: TKind; len: number };
const ROUND_ROBIN: TKind[] = ['blur', 'fade', 'push', 'zoom'];
const T_LEN = 18;

const boundary = (from: string, to: string, k: number): TSpec => {
  // rugby itself slides a full screen width (no fade), its pitch running past the frame; its neighbours push
  if (to === 'rugby' || from === 'rugby') return { kind: 'push', len: 24 };
  if (to === 'polyvalence') return { kind: 'fade', len: 42 };
  return { kind: ROUND_ROBIN[k % ROUND_ROBIN.length], len: T_LEN };
};

/** The look of a bit at visibility p (0 hidden, 1 fully on), entering (dir 1: from the right) or leaving (dir -1). */
const look = (kind: TKind, p: number, dir: 1 | -1): React.CSSProperties => {
  const q = 1 - p;
  switch (kind) {
    case 'fade':
      return { opacity: p };
    case 'blur':
      return { opacity: p, filter: `blur(${(q * 18).toFixed(2)}px)` };
    case 'zoom':
      return { opacity: p, transform: `scale(${(1 + 0.04 * q).toFixed(4)})` }; // out: grows to 104 %; in: settles from 104 %
    case 'slide':
      // a full screen width, fading with the move (a strong fade), blur peaking mid-move
      return { opacity: p * p, transform: `translateX(${(dir * q * W).toFixed(1)}px)`, filter: `blur(${(Math.sin(Math.PI * q) * 12).toFixed(2)}px)` };
    case 'push':
      // the speed blur peaks mid-move (a motion-blur stand-in: the push is fastest there)
      return { opacity: Math.min(1, p * 1.6), transform: `translateX(${(dir * q * W * 0.6).toFixed(1)}px)`, filter: `blur(${(Math.sin(Math.PI * Math.min(1, q * 1.2)) * 10).toFixed(2)}px)` };
  }
};

const ActTransition: React.FC<{ dur: number; enter: TSpec; exit: TSpec | null; children: React.ReactNode }> = ({ dur, enter, exit, children }) => {
  const f = useCurrentFrame();
  let style: React.CSSProperties = {};
  if (f < enter.len) style = look(enter.kind, prog(f, 0, enter.len, E.out), 1);
  else if (exit && f >= dur - exit.len) style = look(exit.kind, 1 - prog(f, dur - exit.len, dur, E.smooth), -1);
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Written by `npm run audio`. Renders are muted and scripts/render.sh muxes it with ffmpeg. */
const SOUNDTRACK = 'audio/soundtrack.wav';

export type FilmProps = { audit?: boolean; safe?: SafeSpec; locale?: Locale };

// The whole resume film: one Sequence per story bit of the plan (src/plans.ts), each at its film seed.
// `locale` (fr | en) is the text every bit shows; the timing is the same for both.
export const Film: React.FC<FilmProps> = ({ audit = false, safe, locale = 'fr' }) => {
  const hasScore = getStaticFiles().some((s) => s.name === SOUNDTRACK);
  return (
    <LocaleProvider locale={locale}>
      <FontGate>
        <AbsoluteFill style={{ background: C.stage }}>
          {planActs().map((a, i, acts) => {
            const mod = BIT_MODULES.find((m) => m.slug === a.slug);
            if (!mod) throw new Error(`Film: plan bit "${a.slug}" is not registered`);
            const { Component } = mod;
            // rugby: comes in from the right and leaves to the left, a full-width slide with a speed blur
            const own = (_side: 'enter' | 'exit'): TSpec | null => (a.slug === 'rugby' ? { kind: 'slide', len: 27 } : null);
            const body = <Component seed={FILM_SEED[a.slug] ?? 1} />;
            return (
              <Sequence key={a.slug} from={a.from} durationInFrames={a.dur} name={a.slug}>
                <ActTransition
                  dur={a.dur}
                  enter={own('enter') ?? (i === 0 ? { kind: 'fade', len: T_LEN + 18 /* the first slide's fade-in, +300 ms */ } : boundary(acts[i - 1].slug, a.slug, i - 1))}
                  exit={i === acts.length - 1 ? null : own('exit') ?? boundary(a.slug, acts[i + 1].slug, i)}
                >
                  {body}
                </ActTransition>
              </Sequence>
            );
          })}
          {hasScore && <Html5Audio src={staticFile(SOUNDTRACK)} />}
          {audit && <Audit safe={safe} />}
        </AbsoluteFill>
      </FontGate>
    </LocaleProvider>
  );
};
