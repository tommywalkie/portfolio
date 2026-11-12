import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../../brand/tokens';
import { Chain } from '../../../fx/Chain';
import { E, mix, prog } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import { HEADLINE_MAX, headlineBox, headlineSize, ILLU_TOP, TEXT_GAP } from '../layout';
import { actOf, CUE, W } from '../../../timeline';
import { BrowserWindow } from '../../_shared/ui/BrowserWindow';

const HORSE_CHROME = 56;
import { TILT_PERSPECTIVE, tilt, tiltAngles } from '../../../lib/tilt';

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
import type { SoundEvent } from '../../../sync';
import { sfx, type SfxName } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';
import { STR } from './copy';
import { CHAT_W, ChatColumn, HORSE_H, HORSE_W, HorseScene, Ide, IDE_H, IDE_W } from './screens';

const SLUG = 'ia-workflow';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const LINE_TOP = ILLU_TOP;
const CHAT_TOP = Math.round(LINE_TOP + headlineBox(HEADLINE_MAX) + TEXT_GAP);
const CHAT_FULL_BOTTOM = 1720;
const CHAT_SHORT_BOTTOM = 1060;
const PANE_TOP = CHAT_SHORT_BOTTOM + 60;

const Bit: React.FC<BitProps> = () => {
  const { TEXT } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const c = K;

  const chatX = (W - CHAT_W) / 2;
  // The chat fills the frame, then yields its lower part to the IDE and preview; bottom-aligned, it scrolls up.
  const chatBottom = mix(CHAT_FULL_BOTTOM, CHAT_SHORT_BOTTOM, prog(F, c('slide'), c('slide') + 30, E.inOut));
  const RIGHT_X = (W - IDE_W) / 2;
  const ideOp = prog(F, c('ideIn'), c('ideIn') + 30, E.smooth) * (1 - prog(F, c('duckIn'), c('duckIn') + 24, E.smooth));
  const ideLift = (1 - prog(F, c('ideIn'), c('ideIn') + 30, E.out)) * 16;
  const horseOp = prog(F, c('duckIn') + 12, c('duckIn') + 42, E.smooth);
  const horseLift = (1 - prog(F, c('duckIn') + 12, c('duckIn') + 42, E.out)) * 16;

  const size = headlineSize(TEXT.powered);

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <ChatColumn F={F} c={c} x={chatX} top={CHAT_TOP} bottom={chatBottom} />
      {ideOp > 0 && (
        <div style={{ position: 'absolute', left: RIGHT_X, top: PANE_TOP, width: IDE_W, height: IDE_H, perspective: TILT_PERSPECTIVE, opacity: ideOp, transform: `translate(0px, ${ideLift}px)` }}>
          <div style={WIN3D(F, 0)}>
            <Ide F={F} c={c} />
          </div>
        </div>
      )}
      {horseOp > 0 && (

        <div style={{ position: 'absolute', left: RIGHT_X, top: PANE_TOP, width: HORSE_W, height: HORSE_H + HORSE_CHROME, perspective: TILT_PERSPECTIVE, opacity: horseOp, transform: `translate(0px, ${horseLift}px)` }}>
          <div style={WIN3D(F, 0)}>
            <BrowserWindow x={0} y={0} w={HORSE_W} h={HORSE_H + HORSE_CHROME} chromeH={HORSE_CHROME} url="localhost:5173">
              <div style={{ position: 'absolute', left: 0, top: HORSE_CHROME, width: HORSE_W, height: HORSE_H }}>
                <HorseScene F={F} c={c} />
              </div>
            </BrowserWindow>
          </div>
        </div>
      )}

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
