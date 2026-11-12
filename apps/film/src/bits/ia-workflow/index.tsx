import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../brand/tokens';
import { Chain } from '../../fx/Chain';
import { E, mix, prog } from '../../lib/anim';
import { useStrings } from '../../lib/i18n';
import { fitSize } from '../../lib/measure';
import { actOf, CUE, H, W } from '../../timeline';
import { NativeWindow } from './NativeWindow';
import { BrowserWindow } from '../_shared/ui/BrowserWindow';

/** The browser chrome's height above the horse scene (BrowserWindow's default). */
const HORSE_CHROME = 56;
import { TILT_PERSPECTIVE, tilt, tiltAngles } from '../../lib/tilt';

/** The film's 3D drift, a bit stronger (1.6x the standard angles) and with a soft shadow, for the IDE and the browser. */
const TILT_GAIN = 1.6;
const WIN3D = (F: number, phase: number): React.CSSProperties => {
  const a = tiltAngles(F, phase);
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    boxShadow: '0 28px 90px rgba(0,0,0,.16)',
    ...tilt(F, phase),
    transform: `rotateX(${a.x * TILT_GAIN}deg) rotateY(${a.y * TILT_GAIN}deg)`,
  };
};
import type { SoundEvent } from '../../sync';
import { sfx, type SfxName } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';
import { STR } from './copy';
import { APP_H, APP_W, CHAT_BOTTOM, CHAT_TOP, CHAT_W, ChatColumn, CHROME, HORSE_H, HORSE_W, HorseScene, Ide, IDE_H, IDE_W, TeamApp, WIN } from './screens';

const SLUG = 'ia-workflow';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

/**
 * The AionUI team window (detail 2) is not rendered: the story now shows the IDE's agent thread only.
 * Its code stays in screens.tsx (TeamApp) and its copy in copy.ts. Set it to true only together with its cues.
 */
const SHOW_TEAM = false;

// The copy runs across the top on one line (centred, 96 px margins), the illustration below it at full width.
const MARGIN = 96;
const LINE_TOP = 72;
const LINE_W = W - 2 * MARGIN;

/** The team window, drawn over the IDE when SHOW_TEAM is on. Its cues are read only here. */
const TeamLayer: React.FC<{ F: number }> = ({ F }) => {
  const { APP } = useStrings(STR);
  const c = K;
  const aionIn = prog(F, c('aionIn'), c('aionIn') + 36, E.smooth);
  const aionLift = (1 - prog(F, c('aionIn'), c('aionIn') + 36, E.out)) * 16;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, perspective: TILT_PERSPECTIVE, opacity: aionIn, transform: `translate(0px, ${aionLift}px)` }}>
      <div style={{ position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, ...tilt(F, 90) }}>
        <NativeWindow w={WIN.w} h={WIN.h} title={APP.title}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: APP_W, height: APP_H, transform: `translate(0px, ${CHROME}px)`, overflow: 'hidden' }}>
            <TeamApp F={F} c={c} />
          </div>
        </NativeWindow>
      </div>
    </div>
  );
};

// No seed-dependent variation: the same app and the same timing for every seed.
const Bit: React.FC<BitProps> = () => {
  const { TEXT } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute
  const c = K;

  // No window. The chat column sits centred, then eases to the left (slide) to make room on the right
  // for the IDE wireframe (ideIn), which gives way to the duck preview (duckIn): no UI around the duck.
  const chatX = mix((W - CHAT_W) / 2, MARGIN, prog(F, c('slide'), c('slide') + 30, E.inOut));
  const RIGHT_X = W - MARGIN - IDE_W;
  const MID_Y = (CHAT_TOP + CHAT_BOTTOM) / 2;
  const ideOp = prog(F, c('ideIn'), c('ideIn') + 30, E.smooth) * (1 - prog(F, c('duckIn'), c('duckIn') + 24, E.smooth));
  const ideLift = (1 - prog(F, c('ideIn'), c('ideIn') + 30, E.out)) * 16;
  const horseOp = prog(F, c('duckIn') + 12, c('duckIn') + 42, E.smooth);
  const horseLift = (1 - prog(F, c('duckIn') + 12, c('duckIn') + 42, E.out)) * 16;

  // « Propulsé par l'IA. » on one line at the top
  const size = fitSize(TEXT.powered, LINE_W, 120, 700, -0.035);

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <ChatColumn F={F} c={c} x={chatX} />
      {ideOp > 0 && (
        <div style={{ position: 'absolute', left: RIGHT_X, top: MID_Y - IDE_H / 2, width: IDE_W, height: IDE_H, perspective: TILT_PERSPECTIVE, opacity: ideOp, transform: `translate(0px, ${ideLift}px)` }}>
          <div style={WIN3D(F, 0)}>
            <Ide F={F} c={c} />
          </div>
        </div>
      )}
      {horseOp > 0 && (
        // The horse preview sits in the film's browser window wireframe (_shared/ui/BrowserWindow)
        <div style={{ position: 'absolute', left: RIGHT_X, top: MID_Y - (HORSE_H + HORSE_CHROME) / 2, width: HORSE_W, height: HORSE_H + HORSE_CHROME, perspective: TILT_PERSPECTIVE, opacity: horseOp, transform: `translate(0px, ${horseLift}px)` }}>
          <div style={WIN3D(F, 0)}>
            <BrowserWindow x={0} y={0} w={HORSE_W} h={HORSE_H + HORSE_CHROME} chromeH={HORSE_CHROME} url="localhost:5173">
              <div style={{ position: 'absolute', left: 0, top: HORSE_CHROME, width: HORSE_W, height: HORSE_H }}>
                <HorseScene F={F} c={c} />
              </div>
            </BrowserWindow>
          </div>
        </div>
      )}

      {SHOW_TEAM && <TeamLayer F={F} />}

      {/* « Propulsé par l'IA. » on one centred line at the top */}
      <Chain chain={`${SLUG}.line`} frame={f} from={act.from} role="display" size={size} x={W / 2} top={LINE_TOP} align="center" />
    </AbsoluteFill>
  );
};

const cues = (): SoundEvent[] => {
  const ev: SoundEvent[] = [];
  const add = (name: string, s: SfxName, weight: number, dt = 0, pan?: number) => {
    ev.push(sfx(s, K(name) + dt, name, { weight, ...(pan === undefined ? {} : { pan }) }));
  };
  add('sys1', 'status', 0.5, 4, -0.3);
  add('sys1Done', 'scan', 0.25, 0, -0.3);
  add('sys2', 'status', 0.5, 4, -0.3);
  add('sys2Done', 'scan', 0.35, 0, -0.3);
  add('tom1', 'chat', 0.8, 4, -0.2);
  add('ask1', 'status', 0.5, 4, -0.3);
  add('card1', 'chat', 0.8, 4, -0.2);
  add('pick1', 'mouse', 1, 0, -0.2);
  add('ask1Done', 'scan', 0.35, 0, -0.3);
  add('ask2', 'status', 0.5, 4, -0.3);
  add('card2', 'chat', 0.8, 4, -0.2);
  add('pick2', 'mouse', 1, 0, -0.2);
  add('ask2Done', 'scan', 0.35, 0, -0.3);
  add('agentsMd', 'status', 0.5, 4, -0.3);
  add('agentsMdDone', 'scan', 0.35, 0, -0.3);
  add('specMd', 'status', 0.5, 4, -0.3);
  add('specMdDone', 'scan', 0.35, 0, -0.3);
  add('sub1', 'status', 0.5, 4, -0.3);
  add('sub2', 'status', 0.5, 4, -0.3);
  add('subDone1', 'scan', 0.35, 0, -0.3);
  add('subDone2', 'scan', 0.35, 0, -0.3);
  add('slide', 'panel', 0.5, 15, -0.2);
  add('ideIn', 'card', 0.9, 14, 0.3);
  // the drag-select of the faulty text: two sounds only, the mouse button going down, then released
  ev.push(sfx('mouse', K('selStart'), 'sel-press', { weight: 0.9, pan: 0.3 }));
  ev.push(sfx('mouse', K('selEnd'), 'sel-release', { weight: 0.6, pan: 0.3 }));
  add('tom3', 'chat', 0.8, 4, -0.2);
  add('eslint', 'status', 0.5, 4, -0.3);
  add('eslintDone', 'scan', 0.35, 0, -0.3);
  add('lint', 'status', 0.5, 4, -0.3);
  add('lintDone', 'success', 0.35, 0, -0.3);
  add('fix', 'latch', 0.9, 0, 0.3);
  add('reply', 'chat', 0.8, 9, -0.2);
  add('duckIn', 'card', 0.9, 24, 0.3);
  for (const name of Object.keys(CUE).filter((k) => k.startsWith(`${SLUG}.step`)).map((k) => k.slice(SLUG.length + 1))) add(name, 'step', 0.3, 0, 0.3);
  ev.push(sfx('text', K('open') + 22, 'headline', { weight: 0.8 }));
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
