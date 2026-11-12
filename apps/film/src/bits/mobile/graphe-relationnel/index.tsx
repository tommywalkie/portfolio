import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../../brand/tokens';
import { Chain } from '../../../fx/Chain';
import { Cursor, cursorArc, pressAt } from '../../../fx/Cursor';
import { E, mix, pace, prog } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import { actOf, CUE, f60, H, W } from '../../../timeline';
import { BrowserWindow } from '../../_shared/ui/BrowserWindow';
import { Quote } from '../../_shared/ui/Quote';
import type { SoundEvent } from '../../../sync';
import { sfx } from '../../_shared/sfx';
import type { BitModule, BitProps } from '../../types';
import { COL_W, COL_X, DETAIL_GAP, headlineBox, headlineSize, ILLU_TOP, MobileCard, QUOTE_GAP, QUOTE_SIZE, TEXT_GAP } from '../layout';
import { STR } from './copy';
import { HUBS, MODELS, SEL } from './layout';
import { APP_H, APP_W, CANVAS, EntityPage, EXPORT, GraphPage, TopBar } from './screens';

const SLUG = 'graphe-relationnel';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

const WIN = { w: 1090, h: 888 };
// The desktop app keeps its own coordinates; the whole window is scaled down to the text column's width.
const WIN_S = COL_W / WIN.w;
const WIN_Y = ILLU_TOP;
const CHROME = 56;
const WIN_BOTTOM = WIN_Y + WIN.h * WIN_S;
const TEXT_TOP = WIN_BOTTOM + TEXT_GAP;

type Cam = { cx: number; cy: number; s: number };
const HALF = { x: CANVAS.w / 2, y: CANVAS.h / 2 };
const lerpCam = (a: Cam, b: Cam, p: number): Cam => ({ cx: mix(a.cx, b.cx, p), cy: mix(a.cy, b.cy, p), s: mix(a.s, b.s, p) });
const camXf = (k: Cam) => ({ s: k.s, tx: HALF.x - k.cx * k.s, ty: HALF.y - k.cy * k.s });
const NODE = MODELS[SEL];
const ANT = HUBS.find((h) => h.name === 'Anthropic')!;
const CAM_A: Cam = { cx: 880, cy: 640, s: 0.84 };
const CAM_B: Cam = { cx: 800, cy: 600, s: 0.9 };
const CAM_Z: Cam = { cx: (ANT.x + NODE.x) / 2, cy: (ANT.y + NODE.y) / 2, s: 1.15 };
const CAM_P: Cam = { cx: NODE.x - (330 - HALF.x) / 1.15, cy: NODE.y, s: 1.15 };

const Bit: React.FC<BitProps> = () => {
  const { APP, AUTHOR, EXPERIENCE, QUOTE, TEXT } = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from;
  const c = K;

  const arrive = prog(F, c('open'), c('open') + 30, E.smooth);
  const lift = (1 - prog(F, c('open'), c('open') + 30, E.out)) * 16;

  const tiltY = 4 * Math.sin((2 * Math.PI * F) / 420);
  const tiltX = 2 * Math.sin((2 * Math.PI * F) / 300 + 1);

  const pageP = prog(F, c('pageSwitch'), c('pageSwitch') + 28, E.inOut);
  const entityOp = 1 - prog(F, c('pageSwitch'), c('pageSwitch') + 12, E.smooth);
  const graphOp = prog(F, c('pageSwitch') + 12, c('pageSwitch') + 28, E.smooth);
  const entityShift = mix(0, -40, pageP);
  const graphShift = mix(40, 0, pageP);
  const fieldP = [0, 1, 2, 3, 4].map((i) => prog(F, c('fields') + 9 * i, c('fields') + 9 * i + 24, E.out));

  const hubP = HUBS.map((h) => prog(F, c('hubs') + 8 * h.i, c('hubs') + 8 * h.i + 24, E.out));
  const modelP = MODELS.map((_, k) => prog(F, c('models') + 3 * k, c('models') + 3 * k + 24, E.out));
  const exportOp = prog(F, c('exportIn'), c('exportIn') + 16, E.smooth);

  const camNow = (ff: number) => {
    const pA = prog(ff, c('pageSwitch'), c('cursorIn'), E.inOut);
    const p1 = prog(ff, c('cursorIn'), c('click'), E.cam);
    const p2 = prog(ff, c('click'), c('click') + 36, E.cam);
    return lerpCam(lerpCam(lerpCam(CAM_A, CAM_B, pA), CAM_Z, p1), CAM_P, p2);
  };
  const sbP = prog(F, c('click'), c('click') + 32, E.inOut);
  const sbX = mix(330, 0, sbP);
  const sel = prog(F, c('click'), c('click') + 16, E.smooth);

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

  const seulSize = headlineSize(TEXT.seul);
  const seulTop = TEXT_TOP;
  const cardY = seulTop + headlineBox(seulSize) + DETAIL_GAP;

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: arrive, transform: `translate(0px, ${lift}px)`, perspective: 2400 }}>

        <div style={{ position: 'absolute', left: COL_X, top: WIN_Y, width: WIN.w, height: WIN.h, transformOrigin: '0 0', transformStyle: 'preserve-3d', transform: `scale(${WIN_S}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}>
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

      <Chain chain={`${SLUG}.seul`} frame={f} from={act.from} role="display" size={seulSize} x={COL_X} top={seulTop} align="left" />
      <MobileCard logo={EXPERIENCE.logo} name={EXPERIENCE.company} activity={EXPERIENCE.activity} period={EXPERIENCE.period} F={F} at={c('seul')} out={c('quoteIn')} outDur={f60(pace.exitDur)} y={cardY} />
      <Quote photo={AUTHOR.photo} name={AUTHOR.name} title={AUTHOR.role} sentences={[QUOTE]} times={[c('quote1')]} F={F} at={c('quoteIn')} x={COL_X} y={WIN_BOTTOM + QUOTE_GAP} w={COL_W} size={QUOTE_SIZE} />
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
