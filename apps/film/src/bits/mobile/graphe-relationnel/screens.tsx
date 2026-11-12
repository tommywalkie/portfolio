import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { mix } from '../../../lib/anim';
import { mixColor } from '../../../lib/color';
import { useStrings } from '../../../lib/i18n';
import { STR } from './copy';
import { LABS } from './data';
import { HUB_D, HUB_LABELS, HUB_PX, HUBS, MODEL_LABELS, MODEL_PX, MODELS, NODE_D, SEL, WORLD } from './layout';

const L = {
  page: C.appPage,
  panel: C.appPaper,
  side: C.appBand,
  field: C.appPage,
  ink: C.appInk,
  body: C.appInkBody,
  muted: C.appInkMute,
  rule: C.appFill,
  edge: C.appEdge,
  link: C.mid,
  active: C.appInkMute,
};

export const APP_W = 1084;
export const APP_H = 826;
const PREVIEW = { x: 16, y: 100, w: 1052, h: 710 };
const BORDER = 3;

export const CANVAS = { x: PREVIEW.x + BORDER, y: 212, w: PREVIEW.w - 2 * BORDER, h: PREVIEW.y + PREVIEW.h - BORDER - 212 };
const SIDEBAR = { x: 765, y: 168, w: 300, h: CANVAS.y + CANVAS.h - 168 };
export const EXPORT = { x: 790, y: 9, w: 200, h: 34 };

const at = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: w,
  height: h,
  boxSizing: 'border-box',
  transform: `translate(${x}px, ${y}px)`,
  ...extra,
});

const t = (size: number, weight: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.25,
  whiteSpace: 'pre',
  fontVariantNumeric: 'tabular-nums',
  ...extra,
});

const SK = {
  strong: C.appFill,
  light: C.appBand,
  sideLabel: C.appFill,
  sideValue: C.appInkFaint,
};
const Skel: React.FC<{ size: number; w: number; color: string }> = ({ size, w, color }) => (
  <div style={{ height: size * 1.25, display: 'flex', alignItems: 'center', flex: 'none' }}>
    <div style={{ width: w, height: Math.round(size * 0.6), borderRadius: 999, background: color }} />
  </div>
);
const NAV_W = [64, 58, 62, 44, 56];

export const TopBar: React.FC<{ page: number; press: number; exportOp: number }> = ({ page, press, exportOp }) => {
  const { APP } = useStrings(STR);
  return (
  <>
    <div style={at(0, 0, APP_W, 52, { background: L.panel, borderBottom: `1.5px solid ${L.rule}` })}>
      <div style={at(24, 13, 220, 26, { display: 'flex', alignItems: 'center' })}>
        <Skel size={21} w={132} color={SK.strong} />
      </div>
      <div style={at(196, 9, 640, 34, { display: 'flex', alignItems: 'center', gap: 6 })}>
        {NAV_W.map((w, i) => {
          const hl = i === 1 ? 1 - page : i === 4 ? page : 0;
          return (
            <div key={i} style={{ position: 'relative', padding: '6px 14px', borderRadius: 10 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: L.active, borderRadius: 10, opacity: hl }} />
              <div style={{ position: 'relative' }}>
                <Skel size={17} w={w} color={mixColor(SK.light, C.appFill, hl)} />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={at(EXPORT.x, EXPORT.y, EXPORT.w, EXPORT.h, {
          opacity: exportOp,
          transform: `translate(${EXPORT.x}px, ${EXPORT.y}px) scale(${1 - 0.04 * press})`,
          transformOrigin: `${EXPORT.w / 2}px ${EXPORT.h / 2}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: `2px solid ${C.accentDeep}`,
          background: mixColor(C.appPaper, C.accentDeep, press),
          ...t(16, 600, mixColor(L.ink, C.appHi, press)),
        })}
      >
        {APP.exportBtn}
      </div>
      <div style={at(1032, 10, 32, 32, { borderRadius: 16, background: L.active })} />
    </div>
    <div style={at(0, 52, APP_W, 36, { background: L.page })}>
      <div style={at(24, 7, 700, 22, { opacity: 1 - page })}>
        <Skel size={16} w={430} color={SK.light} />
      </div>
      <div style={at(24, 7, 700, 22, { opacity: page })}>
        <Skel size={16} w={330} color={SK.light} />
      </div>
    </div>
  </>
  );
};

export const EntityPage: React.FC<{ op: number; shift: number; fieldP: number[] }> = ({ op, shift, fieldP }) => {
  const { ENTITY } = useStrings(STR);
  return (
  <div style={at(shift, 0, APP_W, APP_H, { opacity: op })}>
    <div style={at(16, 100, 220, 710, { background: L.side, border: `1.5px solid ${L.rule}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 })}>
      <div style={t(14, 500, L.muted, { marginBottom: 8 })}>{ENTITY.sideTitle}</div>
      {ENTITY.side.map((name, i) => {
        const active = i === ENTITY.side.length - 1;
        return (
          <div key={name} style={{ padding: '10px 12px', borderRadius: 8, background: active ? L.active : 'transparent', ...t(17, active ? 700 : 500, active ? C.appHi : L.ink) }}>
            {name}
          </div>
        );
      })}
    </div>
    <div style={at(256, 100, 812, 710, { background: L.panel, border: `1.5px solid ${L.rule}`, borderRadius: 12, display: 'flex', flexDirection: 'column' })}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px' }}>
        <div style={t(30, 700, L.ink)}>{ENTITY.title}</div>
        <div style={{ padding: '10px 20px', borderRadius: 8, background: L.active, ...t(17, 600, C.appHi) }}>{ENTITY.save}</div>
      </div>
      <div style={{ padding: '0 24px' }}>
        {ENTITY.fields.map((field, i) => {
          const p = fieldP[i] ?? 0;
          return (
            <div
              key={field.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 96,
                borderTop: `1px solid ${L.rule}`,
                opacity: p,
                transform: `translateY(${(1 - p) * 16}px)`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={t(14, 500, L.muted)}>{ENTITY.labelName}</div>
                <div style={t(22, 700, L.ink)}>{field.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <div style={t(14, 500, L.muted)}>{ENTITY.labelFormat}</div>
                <div style={{ padding: '8px 14px', borderRadius: 8, background: L.field, border: `1.5px solid ${L.rule}`, ...t(17, 500, L.ink) }}>{field.format}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '6px 14px', borderRadius: 16, background: L.panel, border: `1.5px solid ${L.active}`, ...t(15, 500, L.ink) }}>{children}</div>
);
const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '7px 14px', borderRadius: 8, background: L.panel, border: `1.5px solid ${L.edge}`, ...t(15, 500, L.ink) }}>{children}</div>
);

const SB_GAP = 18;

const Field: React.FC<{ label: number; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Skel size={14} w={label} color={SK.sideLabel} />
    {children}
  </div>
);
const Tags: React.FC<{ widths: number[] }> = ({ widths }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {widths.map((w, i) => (
      <div key={i} style={{ padding: '3px 12px', borderRadius: 999, background: L.field, border: `1.5px solid ${L.rule}` }}>
        <Skel size={15} w={w} color={SK.sideLabel} />
      </div>
    ))}
  </div>
);

export const GraphPage: React.FC<{ op: number; shift: number; cam: { s: number; tx: number; ty: number }; hubP: number[]; modelP: number[]; sel: number; sbX: number; sbP: number }> = ({ op, shift, cam, hubP, modelP, sel, sbX, sbP }) => {
  const { GRAPH, NODE } = useStrings(STR);
  const lineEnds = MODELS.map((m) => {
    const hub = HUBS[m.li];
    const dx = m.x - hub.x;
    const dy = m.y - hub.y;
    return { hub, m, len: Math.hypot(dx, dy) };
  });

  const btnRight = mix(PREVIEW.x + PREVIEW.w - 36, SIDEBAR.x - 16, sbP);
  return (
    <div style={at(shift, 0, APP_W, APP_H, { opacity: op })}>

      <div style={at(PREVIEW.x, PREVIEW.y, PREVIEW.w, PREVIEW.h, { background: L.panel, border: `${BORDER}px solid ${C.accentDeep}` })} />

      <div style={at(PREVIEW.x, PREVIEW.y + BORDER, PREVIEW.w, 22, { display: 'flex', justifyContent: 'center' })}>
        <span style={{ background: C.accentDeep, color: C.appInkDeep, padding: '2px 12px', borderRadius: '0 0 4px 4px', ...t(13, 700, C.appInkDeep, { letterSpacing: '0.12em' }) }}>{GRAPH.preview}</span>
      </div>

      <div style={at(36, 116, 1012, 40, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Skel size={26} w={380} color={SK.strong} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, border: `2px solid ${L.edge}` }} />
            <Skel size={15} w={78} color={SK.light} />
          </div>
        </div>
        <Skel size={15} w={140} color={SK.light} />
      </div>

      <div style={at(36, 168, 1012, 40, { display: 'flex', alignItems: 'center', gap: 10 })}>
        <Button><Skel size={15} w={84} color={SK.light} /></Button>
        <Button><Skel size={15} w={58} color={SK.light} /></Button>
        <Chip><Skel size={15} w={150} color={SK.light} /></Chip>
        <Chip><Skel size={15} w={150} color={SK.light} /></Chip>
        <Skel size={15} w={80} color={SK.light} />
      </div>

      <div style={at(CANVAS.x, CANVAS.y, CANVAS.w, CANVAS.h, { overflow: 'hidden', background: L.page })}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: WORLD.w, height: WORLD.h, transformOrigin: '0 0', transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})` }}>
          <svg width={WORLD.w} height={WORLD.h} style={at(0, 0, WORLD.w, WORLD.h)}>
            {lineEnds.map(({ hub, m, len }, k) => (
              <line
                key={k}
                x1={hub.x}
                y1={hub.y}
                x2={m.x}
                y2={m.y}
                stroke={L.link}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - (modelP[k] ?? 0))}
              />
            ))}
          </svg>

          {HUBS.map((hub) => {
            const p = hubP[hub.i] ?? 0;
            const d = HUB_D;
            const L2 = HUB_LABELS[hub.i];
            return (
              <React.Fragment key={hub.name}>
                <div
                  style={at(hub.x - d / 2, hub.y - d / 2, d, d, {
                    borderRadius: d / 2,
                    background: L.panel,
                    border: `3px solid ${L.link}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: p,
                    transform: `translate(${hub.x - d / 2}px, ${hub.y - d / 2}px) scale(${0.6 + 0.4 * p})`,
                    transformOrigin: `${d / 2}px ${d / 2}px`,
                  })}
                >
                  <Img src={staticFile(`logos/${hub.logo}.svg`)} style={{ width: 56, height: 56, objectFit: 'contain' }} />
                </div>
                <div style={at(L2.x0, L2.y0, L2.x1 - L2.x0, L2.y1 - L2.y0, { opacity: p, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                  <span style={{ background: L.page, padding: '0 6px', borderRadius: 4, ...t(HUB_PX, 700, L.ink) }}>{hub.name}</span>
                </div>
              </React.Fragment>
            );
          })}

          {MODELS.map((m, k) => {
            const p = modelP[k] ?? 0;
            const d = NODE_D;
            const selected = k === SEL;
            const lab = LABS[m.li];
            const L2 = MODEL_LABELS[k];

            const ring = selected ? mixColor(L.edge, C.accentDeep, sel) : L.edge;
            return (
              <React.Fragment key={`${m.name}`}>
                <div
                  style={at(m.x - d / 2, m.y - d / 2, d, d, {
                    borderRadius: d / 2,
                    background: L.panel,
                    border: `${selected ? 3 : 2}px solid ${ring}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: p,
                    transform: `translate(${m.x - d / 2}px, ${m.y - d / 2}px) scale(${0.5 + 0.5 * p})`,
                    transformOrigin: `${d / 2}px ${d / 2}px`,
                  })}
                >
                  <Img src={staticFile(`logos/${lab.id}.svg`)} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                </div>

                <div style={at(L2.x0, L2.y0, L2.x1 - L2.x0, L2.y1 - L2.y0, { opacity: p, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                  <span style={{ background: L.page, padding: '0 5px', borderRadius: 4, whiteSpace: 'nowrap', ...t(MODEL_PX, selected && sel > 0.5 ? 700 : 600, selected && sel > 0.5 ? L.ink : L.body) }}>{m.name}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={at(36, 756, 1012, 40, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
        <div style={{ padding: '8px 14px', borderRadius: 8, background: L.panel, border: `1.5px solid ${L.rule}` }}>
          <Skel size={15} w={160} color={SK.light} />
        </div>
      </div>

      <div style={at(0, 0, APP_W, APP_H, { clipPath: `inset(${PREVIEW.y + BORDER}px ${APP_W - (PREVIEW.x + PREVIEW.w - BORDER)}px ${APP_H - (PREVIEW.y + PREVIEW.h - BORDER)}px ${PREVIEW.x + BORDER}px)` })}>

      <div style={at(0, 756, APP_W, 40, { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: APP_W - btnRight })}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button><Skel size={15} w={74} color={SK.light} /></Button>
          <Button><Skel size={15} w={60} color={SK.light} /></Button>
        </div>
      </div>

      <div
        style={at(SIDEBAR.x + sbX, SIDEBAR.y, SIDEBAR.w, SIDEBAR.h, {
          background: L.side,
          borderLeft: `2px solid ${L.rule}`,
          padding: '12px 16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: SB_GAP,
        })}
      >

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skel size={14} w={56} color={SK.sideLabel} />
          <div style={{ padding: '3px 12px', borderRadius: 8, background: L.panel, border: `1.5px solid ${L.edge}` }}>
            <Skel size={14} w={44} color={SK.light} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: L.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Img src={staticFile(`logos/${NODE.logo}.svg`)} style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <div style={{ ...t(20, 700, L.ink), whiteSpace: 'normal', lineHeight: 1.2, minWidth: 0 }}>{NODE.name}</div>
        </div>
        <Field label={96}>
          <div style={{ alignSelf: 'flex-start', padding: '3px 12px', borderRadius: 999, background: L.field, border: `1.5px solid ${L.rule}` }}>
            <Skel size={16} w={84} color={SK.sideLabel} />
          </div>
        </Field>
        <Field label={80}>
          <Skel size={17} w={72} color={SK.sideValue} />
        </Field>
        <Field label={52}>
          <div style={{ alignSelf: 'stretch', padding: '6px 12px', borderRadius: 10, background: L.active }}>
            <Skel size={17} w={64} color={SK.sideLabel} />
          </div>
        </Field>
        <Field label={150}>
          <Tags widths={[44, 52, 48]} />
        </Field>
        <Field label={120}>
          <Tags widths={[44]} />
        </Field>
        <Field label={110}>
          <Skel size={17} w={96} color={SK.sideValue} />
        </Field>
        <Field label={90}>
          <Skel size={17} w={104} color={SK.sideValue} />
        </Field>
      </div>
      </div>
    </div>
  );
};
