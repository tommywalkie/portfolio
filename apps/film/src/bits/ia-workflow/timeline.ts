// ia-workflow: slide 12 of the story. No window: a chat column on the stage, then an IDE wireframe and the duck preview.
// The copy « Propulsé par l'IA. » sits on ONE line across the top (position and timing as in v0).
// Local frames (from the act's start), 60 fps. Every cue is snapped up to the 16th grid (9 f) by at(). The plan is a
// fixed list of frames (no text is measured), so both locales share every frame. A beat lands at least every 72 f.
//   0        open
//   18       « Propulsé par l'IA. » (the line starts, held to the end)
//   sys1     system row « MCP · Blender connecté » (spinner, then a check at sys1Done)
//   sys2     system row « Skill · réponses courtes » (check at sys2Done)
//   tom1     the one opening message (game + spec); the cursor then clicks the picked option of each card
//   (selStart..selEnd: the drag-select of the faulty text; lint, lintDone: the « pnpm lint » row)
//   card1    the agent's card « Quel rendu ? » (title, then one button per line); hover1 then pick1 on « Low poly »
//   card2    « Contrôles ? »; hover2 then pick2 on « Clavier »
//   agentsMd, specMd   system rows: the writes (each ticks 36 f later)
//   sub1, sub2         system rows: the subagents (each ticks 72 f later)
//   slide    the chat column eases from the centre to the left; ideIn the IDE wireframe (src/duck.ts) enters on the right
//   cursorIn the cursor reaches the faulty line and wiggles around it (wiggle, wiggle2 mark the motion)
//   tom3     « Ajoute ESLint, avec une règle contre ça. »
//   eslint   system row « Écriture · eslint.config.js » (eslintDone); the cursor leaves
//   reply    the agent: « no-explicit-any activé, ligne corrigée. »; fix: the IDE line becomes the typed one (fixFade)
//   duckIn   the IDE leaves, the duck preview enters; step<i> marks each stride (36 f) to the end
import { BAR, chain, type BitTimeline, type Copy } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'ia-workflow';
/** Typed characters per second (read by the team window's code, which is off). */
export const CPS = 30;
/** The 16th grid of a 100 BPM / 60 fps bit (9 f). */
const S16 = 9;
/** One duck stride, in frames (two steps). */
export const STRIDE = 36;

/** The chat's messages stream in (like an assistant's tokens) at this many characters per second. */
const STREAM_CPS = 110;
/** Frames a message takes to stream, from the French text (every locale shares the frames): a 6 f lead-in, then
 *  STREAM_CPS characters a second, rounded up to the 9 f grid. */
export const streamFrames = (frText: string) => Math.ceil(((frText.length / STREAM_CPS) * 60 + 6) / S16) * S16;
const D_TOM1 = streamFrames(STR.fr.CHAT.tom.game);
const D_TOM3 = streamFrames(STR.fr.CHAT.tom.eslint);

// The plan in local frames (multiples of 9), built in order: each message's stream, then 18 f of hold, then the
// next event. A question card arrives after its own status row « Demande d'informations » (the question tool).
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
    // the duck's strides, one cue each, to the end
    for (let i = 1, f = P.duckIn + STRIDE; f < P.LEN; i++, f += STRIDE) cue[`step${i}`] = at(f);

    // The copy: one line, built in one step at 18 f, held to the end.
    const copy: Copy[] = chain(`${SLUG}.line`, 'build', [[STR.fr.TEXT.powered, at(18), STR[locale].TEXT.powered]], { out: at(P.LEN) });
    return { cue, copy };
  },
};

export default timeline;
