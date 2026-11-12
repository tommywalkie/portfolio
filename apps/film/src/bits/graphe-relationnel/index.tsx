import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, HEADLINE_LEAD } from '../../brand/tokens';
import { Chain } from '../../fx/Chain';
import { Cursor, cursorArc, pressAt } from '../../fx/Cursor';
import { E, mix, pace, prog } from '../../lib/anim';
import { useStrings } from '../../lib/i18n';
import { fitSize } from '../../lib/measure';
import { actOf, CUE, f60, H, W } from '../../timeline';
import { BrowserWindow } from '../_shared/ui/BrowserWindow';
import { Quote } from '../_shared/ui/Quote';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';
import { CompactCard } from './CompactCard';
import { STR } from './copy';
import { HUBS, MODELS, SEL } from './layout';
import { APP_H, APP_W, CANVAS, EntityPage, EXPORT, GraphPage, TopBar } from './screens';

const SLUG = 'graphe-relationnel';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

// Two zones (quote side rule: this slide is even, so mirrored): the copy and the testimonial in
// the left 35% (x 96 to 670), the app in the right 60% (window x 790 to 1880, inside 770-1920). Nothing of the
// app enters the gap.
const WIN = { x: 790, y: 96, w: 1090, h: 888 };
const CHROME = 56; // the browser chrome above the app
const COL_X = 96;
const COL_W = 574;
const CENTRE_Y = 540;
const CARD_GAP = 40; // the clear gap between the line and the card (detail gap rule: at least 40 px)

// The camera over the graph world (world px): the centre of view (cx, cy) and the zoom s; the canvas centre is HALF.
type Cam = { cx: number; cy: number; s: number };
const HALF = { x: CANVAS.w / 2, y: CANVAS.h / 2 };
const lerpCam = (a: Cam, b: Cam, p: number): Cam => ({ cx: mix(a.cx, b.cx, p), cy: mix(a.cy, b.cy, p), s: mix(a.s, b.s, p) });
const camXf = (k: Cam) => ({ s: k.s, tx: HALF.x - k.cx * k.s, ty: HALF.y - k.cy * k.s });
const NODE = MODELS[SEL];
const ANT = HUBS.find((h) => h.name === 'Anthropic')!;
const CAM_A: Cam = { cx: 880, cy: 640, s: 0.84 }; // the graph arrives: most of the world is beyond the canvas
const CAM_B: Cam = { cx: 800, cy: 600, s: 0.9 }; // the slow drag-pan's end
const CAM_Z: Cam = { cx: (ANT.x + NODE.x) / 2, cy: (ANT.y + NODE.y) / 2, s: 1.15 }; // zoom toward the Anthropic group
const CAM_P: Cam = { cx: NODE.x - (330 - HALF.x) / 1.15, cy: NODE.y, s: 1.15 }; // the node sits left of the sidebar

// No seed-dependent variation: the same app, the same timing for every seed.
const Bit: React.FC<BitProps> = () => {
  const { APP, AUTHOR, EXPERIENCE, QUOTE, TEXT } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute
  const c = K;

  // the window arrives (fade and a small rise), then the app's own motion takes over
  const arrive = prog(F, c('open'), c('open') + 30, E.smooth);
  const lift = (1 - prog(F, c('open'), c('open') + 30, E.out)) * 16;
  // the 3D drift: up to 4 degrees on Y and 2 on X, one slow cycle every 7 s (a pure function of the frame)
  const tiltY = 4 * Math.sin((2 * Math.PI * F) / 420);
  const tiltX = 2 * Math.sin((2 * Math.PI * F) / 300 + 1);

  // the page switch: entity page → graph preview (a short horizontal slide, crossfade)
  const pageP = prog(F, c('pageSwitch'), c('pageSwitch') + 28, E.inOut); // the nav highlight and crumb
  const entityOp = 1 - prog(F, c('pageSwitch'), c('pageSwitch') + 12, E.smooth); // the entity page leaves first
  const graphOp = prog(F, c('pageSwitch') + 12, c('pageSwitch') + 28, E.smooth); // then the graph arrives
  const entityShift = mix(0, -40, pageP);
  const graphShift = mix(40, 0, pageP);
  const fieldP = [0, 1, 2, 3, 4].map((i) => prog(F, c('fields') + 9 * i, c('fields') + 9 * i + 24, E.out));

  // the graph assembles: hubs, then the models radiating from them
  const hubP = HUBS.map((h) => prog(F, c('hubs') + 8 * h.i, c('hubs') + 8 * h.i + 24, E.out));
  const modelP = MODELS.map((_, k) => prog(F, c('models') + 3 * k, c('models') + 3 * k + 24, E.out));
  const exportOp = prog(F, c('exportIn'), c('exportIn') + 16, E.smooth);

  // the camera over the graph world: a slow drag-pan across it (from the graph's arrival to the cursor's entry),
  // a zoom toward the Anthropic group (cursor entry to the click), then a pan that brings the selected node clear of
  // the sidebar as it slides in (the click to 36 f on). Each stage starts where the previous one ended.
  const camNow = (ff: number) => {
    const pA = prog(ff, c('pageSwitch'), c('cursorIn'), E.inOut);
    const p1 = prog(ff, c('cursorIn'), c('click'), E.cam);
    const p2 = prog(ff, c('click'), c('click') + 36, E.cam);
    return lerpCam(lerpCam(lerpCam(CAM_A, CAM_B, pA), CAM_Z, p1), CAM_P, p2);
  };
  const sbP = prog(F, c('click'), c('click') + 32, E.inOut);
  const sbX = mix(330, 0, sbP);
  const sel = prog(F, c('click'), c('click') + 16, E.smooth);

  // the cursor: in from the bottom of the graph, onto « Claude Fable Latest », click, then to the export button
  const start = { x: 560, y: 640 };
  const nodeAt = (ff: number) => {
    const k = camNow(ff);
    return { x: CANVAS.x + HALF.x + (NODE.x - k.cx) * k.s, y: CANVAS.y + HALF.y + (NODE.y - k.cy) * k.s };
  };
  const exportAt = { x: EXPORT.x + EXPORT.w / 2 - 6, y: EXPORT.y + EXPORT.h / 2 - 4 };
  const reach = prog(F, c('cursorIn'), c('click'), E.glide);
  const cur =
    F < c('exportMove')
      ? cursorArc(start, nodeAt(F), reach, 0.18)
      : cursorArc(nodeAt(c('exportMove')), exportAt, prog(F, c('exportMove'), c('press'), E.glide), 0.18);
  const curOp = prog(F, c('cursorIn'), c('cursorIn') + 14, E.smooth) * (1 - prog(F, c('press'), c('press') + 26, E.smooth));
  const press = Math.max(pressAt(F, c('click')), pressAt(F, c('press')));
  const exportPress = pressAt(F, c('press'));

  // The line in the left zone: sized to fit the column (the display role, one line), centred on the quote's line.
  const seulSize = fitSize(TEXT.seul, COL_W, 96, 700, -0.035);
  const seulTop = CENTRE_Y - (HEADLINE_LEAD * seulSize) / 2;
  // The La Mètis card sits under the line (detail gap rule: 40 px clear), arrives with it and leaves with it.
  const cardY = seulTop + HEADLINE_LEAD * seulSize + CARD_GAP;

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: arrive, transform: `translate(0px, ${lift}px)`, perspective: 2400 }}>
        {/* the window drifts in 3D, a few degrees, slowly (eased sine of the frame): it stays in the illustration zone */}
        <div style={{ position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, transformStyle: 'preserve-3d', transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}>
        <BrowserWindow x={0} y={0} w={WIN.w} h={WIN.h} url={APP.url}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: APP_W, height: APP_H, transform: `translate(0px, ${CHROME}px)`, overflow: 'hidden' }}>
            <EntityPage op={entityOp} shift={entityShift} fieldP={fieldP} />
            <GraphPage op={graphOp} shift={graphShift} cam={camXf(camNow(F))} hubP={hubP} modelP={modelP} sel={sel} sbX={sbX} sbP={sbP} />
            <TopBar page={pageP} press={exportPress} exportOp={exportOp} />
            {curOp > 0 && (
              <Cursor x={cur.x} y={cur.y} scale={1.5} press={press} opacity={curOp} fill={C.appInk} stroke={C.appHi} />
            )}
          </div>
        </BrowserWindow>
        </div>
      </div>

      {/* detail 2: the line with the La Mètis card under it, then detail 3 (the testimonial) takes their place */}
      <Chain chain={`${SLUG}.seul`} frame={f} from={act.from} role="display" size={seulSize} x={COL_X} top={seulTop} align="left" />
      <CompactCard logo={EXPERIENCE.logo} name={EXPERIENCE.company} activity={EXPERIENCE.activity} period={EXPERIENCE.period} maxW={COL_W} F={F} at={c('seul')} out={c('quoteIn')} outDur={f60(pace.exitDur)} x={COL_X} y={cardY} />
      <Quote photo={AUTHOR.photo} name={AUTHOR.name} title={AUTHOR.role} sentences={[QUOTE]} times={[c('quote1')]} F={F} at={c('quoteIn')} x={COL_X} cy={CENTRE_Y} w={COL_W} />
    </AbsoluteFill>
  );
};

const cues = (): SoundEvent[] => {
  const ev: SoundEvent[] = [
    sfx('card', K('open') + 6, 'window', { weight: 0.6 }),
    sfx('text', K('seul') + 6, 'headline', { weight: 0.7 }),
    sfx('card', K('seul') + 14, 'card', { weight: 0.5 }),
    sfx('page', K('pageSwitch') + 6, 'pageSwitch', { weight: 0.7 }),
    sfx('camera', K('cursorIn') + 31, 'zoom', { weight: 0.7, apexFrac: 0.5 }),
    sfx('mouse', K('click'), 'clickNode'),
    sfx('panel', K('click') + 4, 'sidebar', { weight: 0.45, pan: 0.4, apexFrac: 0.5 }),
    sfx('item', K('exportIn') + 4, 'exportBtn', { weight: 0.5 }),
    sfx('mouse', K('press'), 'clickExport'),
    sfx('text', K('quoteIn') + 8, 'quote', { weight: 0.8 }),
  ];
  HUBS.forEach((h) => ev.push(sfx('item', K('hubs') + 8 * h.i + 4, `hub${h.i}`, { weight: 0.55, pan: (h.i - 1.5) * 0.25 })));
  MODELS.forEach((_, k) => {
    if (k % 6 === 0) ev.push(sfx('item', K('models') + 3 * k + 4, `model${k}`, { weight: 0.35, pan: ((k % 4) - 1.5) * 0.2 }));
  });
  return ev;
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
