import { BAR, chain, type BitTimeline, type Copy } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'ia-workflow';

const S16 = 9;

export const STRIDE = 36;

const STREAM_CPS = 110;

export const streamFrames = (frText: string) => Math.ceil(((frText.length / STREAM_CPS) * 60 + 6) / S16) * S16;
const D_TOM1 = streamFrames(STR.fr.CHAT.tom.game);
const D_TOM3 = streamFrames(STR.fr.CHAT.tom.eslint);

const tom1 = 117;
const ask1 = tom1 + D_TOM1 + 18;
const card1 = ask1 + 36;
const pick1 = card1 + 90;
const ask2 = pick1 + 36;
const card2 = ask2 + 36;
const pick2 = card2 + 90;
const agentsMd = pick2 + 36;
const specMd = agentsMd + 45;
const sub1 = specMd + 72;
const subDone2 = sub1 + 90;
const slide = subDone2 + 9;
const ideIn = slide + 27;
const cursorIn = ideIn + 54;
const selStart = cursorIn + 45;
const selEnd = selStart + 63;
const tom3 = selEnd + 27;
const eslint = tom3 + D_TOM3 + 18;
const lint = eslint + 45;
const reply = lint + 36 + 27;
const duckIn = reply + 81;

const P = {
  open: 0,
  sys1: 36,
  sys1Done: 72,
  sys2: 81,
  sys2Done: 108,
  tom1,
  ask1,
  card1,
  hover1: card1 + 36,
  pick1,
  ask1Done: pick1 + 18,
  ask2,
  card2,
  hover2: card2 + 36,
  pick2,
  ask2Done: pick2 + 18,
  agentsMd,
  agentsMdDone: agentsMd + 36,
  specMd,
  specMdDone: specMd + 36,
  sub1,
  sub2: sub1 + 18,
  subDone1: sub1 + 72,
  subDone2,
  slide,
  ideIn,
  cursorIn,
  selStart,
  selEnd,
  tom3,
  eslint,
  eslintDone: eslint + 36,
  lint,
  lintDone: lint + 36,
  reply,
  fix: reply,
  fixFade: reply + 45,
  duckIn,
  LEN: duckIn + 198,
};

const timeline: BitTimeline = {
  slug: SLUG,
  bars: P.LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const at = (n: number) => Math.ceil((from + n) / S16) * S16;

    const cue: Record<string, number> = {};
    for (const [k, v] of Object.entries(P)) if (k !== 'LEN') cue[k] = at(v);
    cue.end = at(P.LEN);

    for (let i = 1, f = P.duckIn + STRIDE; f < P.LEN; i++, f += STRIDE) cue[`step${i}`] = at(f);

    const copy: Copy[] = chain(`${SLUG}.line`, 'build', [[STR.fr.TEXT.powered, at(18), STR[locale].TEXT.powered]], { out: at(P.LEN) });
    return { cue, copy };
  },
};

export default timeline;
