// paris-californie: the shared whiteboard of the Paris and San Francisco teams. 6.3 bars (906 f = 15.1 s at 100 BPM).
// Every cue is on the 16th grid (9 f); bar 1 starts at `from`, the bit's frame 0 is `from`.
//   bar 1     the Shape Up kanban on the board; the line « Productif, à l’international. » is up from frame 18.
//             Two card moves on the kanban: Paris « Formulaire de connexion » to « En cours » (63 → 99), San Francisco
//             « API des commandes » to « Livré » (108 → 153); then the San Francisco cursor glides down (171 → 198)
//   bar 2     the camera pans from the kanban to the sailboat retrospective (270 → 324); the two cursors drop the two
//             sticky notes: « Revues de code rapides » in « Vent » (342), « CI trop lente » in « Ancre » (378)
//   bar 3 +   dot votes: a cursor glides to a sticky and a dot appears on it (639, 747, 855)
//   quote     at 99 the line leaves and Maxime Gaudin's quote arrives in its place; his two sentences in a carousel:
//             the short one (117 → 402), the long one (414 → end). Each stays fully on screen for its read time.
// The sway over the retro panel runs from 324 to the end.
import { b, bitClock, BAR, line, type BitTimeline, type Copy } from '../../lib/grid';
import { wordCount } from '../../lib/pace';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

// The timing is written from the French text (the same frames in every locale).
const QUOTES = STR.fr.QUOTES;

const SLUG = 'paris-californie';

// Testimonial read time: a sentence stays fully on
// screen for words / 3.5 s + 2 s (about 210 words a minute), rounded up to the 9 f grid. The fade-in (24 f) is not
// part of the time on screen; the fade-out (12 f) starts before the next sentence.
const RISE = 24;
const FADE = 12;
const readFor = (text: string) => Math.ceil(Math.ceil((wordCount(text) * 60) / 3.5 + 120) / 9) * 9;

const Q1_IN = b(1, 0, 13); // 117: the short sentence starts (8 words: 261 f on screen)
const Q1_OUT = Q1_IN + RISE + readFor(QUOTES[0]); // 402
const Q2_IN = Q1_OUT + FADE; // 414: the long sentence (20 words: 468 f on screen)
const END = Q2_IN + RISE + readFor(QUOTES[1]); // 906: the long sentence stays to the end

const timeline: BitTimeline = {
  slug: SLUG,
  bars: END / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const S = STR[locale];
    const { at } = bitClock(from);
    const n = (k: number) => at(1, 0, k); // the k-th sixteenth of the bit: frame 9k
    const cue = {
      open: n(0), // the kanban is on the board
      line: n(2), // « Productif, à l’international. » starts to rise
      pApproach: n(4), // the Paris cursor comes in toward « Formulaire de connexion »
      pGrab: n(7), // grab
      pDrop: n(11), // drop in « En cours »
      box: n(11), // the quote box rises under the line
      sApproach: n(9), // the San Francisco cursor comes in toward « API des commandes »
      sGrab: n(12),
      sDrag: n(13),
      sDrop: n(17), // drop in « Livré »
      sAway: n(19), // the San Francisco cursor glides down, away from the Paris cursor's row (the two stay apart)
      sAwayEnd: n(22),
      pan: n(30), // the camera pans to the sailboat
      pFly: n(34), // the Paris cursor flies to the « Vent » zone
      panEnd: n(36),
      sFly: n(37), // the San Francisco cursor flies to the « Ancre » zone (along x first, then up)
      stA: n(38), // « Revues de code rapides » drops
      stB: n(42), // « CI trop lente » drops
      // dot votes: a cursor glides to a sticky (go, arrive) and a dot appears on it (vote). Three votes 108 f apart,
      // the last one at v0's last vote (855), so no stretch after the long sentence's read goes over 72 f quiet.
      // every cursor glides down to the board's bottom edge (Down → DownEnd) once its move is done
      pDown1: n(12),
      pDownEnd1: n(15),
      pDown2: n(39),
      pDownEnd2: n(41),
      pDown3: n(84),
      pDownEnd3: n(87),
      sDown2: n(43),
      sDownEnd2: n(46),
      sDown3: n(72),
      sDownEnd3: n(75),
      sDown4: n(96),
      sDownEnd4: n(99),
      sGo1: n(66),
      sArr1: n(70),
      sVote1: n(71),
      pGo1: n(78),
      pArr1: n(82),
      pVote1: n(83),
      sGo2: n(90),
      sArr2: n(94),
      sVote2: n(95),
      q1: from + Q1_IN, // the short sentence of the carousel
      q2: from + Q2_IN, // the long sentence (the short one leaves 12 f before)
      end: from + END, // the bit's end: the long sentence stays to here
    };
    const copy: Copy[] = [
      line(`${SLUG}.line`, STR.fr.LINE, cue.line, cue.box, S.LINE), // the line leaves as the quote arrives
      { id: `${SLUG}.q1`, text: S.QUOTES[0], in: cue.q1, resolved: cue.q1 + RISE, out: cue.q2 - FADE },
      { id: `${SLUG}.q2`, text: S.QUOTES[1], in: cue.q2, resolved: cue.q2 + RISE, out: cue.end },
    ];
    return { cue, copy };
  },
};

export default timeline;
