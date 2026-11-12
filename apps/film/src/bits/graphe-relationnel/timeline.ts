// graphe-relationnel: the graph CMS of the final month of the role, 8.6 s (516 f at 60 fps, 3.58 bars). Detail 1 is the app (an
// entity page, then the graph preview assembling); detail 2 is the line « Du besoin au produit. » in the left zone with
// the La Mètis experience card under it (both from 18 f, both leave at 153 f); detail 3 is Nicolas Kahn's testimonial,
// which takes their place at 153 f and stays to the end.
// The testimonial stays fully on screen for words / 3.5 s + 2 s (12 words: 333 f), rounded up to the 9 f grid,
// counted from the moment it is fully readable (183 f): the bit ends at 516 f.
// Local frames (from the act's start), 60 fps:
//   0-30     the window arrives on the entity page (Modèle: its fields rise in from 18 f)
//   18       « Du besoin au produit. » rises in the left zone (build chain, one fragment); the card arrives under it
//   153      the line and the card leave; the testimonial arrives
//   108-136  the page switches to the graph preview (Aperçu); the export button appears from 198
//   135-159  the four lab hubs appear (OpenAI, Anthropic, Mistral, Qwen), 8 f apart
//   171-246  the 26 models radiate from their hubs, 3 f apart, each line drawn out from its hub
//   153      the line leaves and the testimonial arrives (sentence fully readable from 183)
//   108-252  the camera pan over the graph (slower than before)
//   252-315  the cursor reaches « Claude Fable Latest » and clicks (press at 315); the zoom toward Anthropic runs 252-315
//   315-351  the sidebar slides in from the right and the graph eases left to make room (open at 347)
//   351-405  hold ~0.9 s, then the cursor moves to « Exporter le graphe » (top right) and presses it at 450 (press feedback only)
//   450-516  the press, then the window keeps its 3D drift until the testimonial has been read
//   516      the sentence's last frame on screen (the bit's end)
import { BAR, chain, type BitTimeline, type Copy } from '../../lib/grid';
import { wordCount } from '../../lib/pace';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

// The timing is written from the French text (the same frames in every locale).
const QUOTE = STR.fr.QUOTE;

const SLUG = 'graphe-relationnel';

// Testimonial read time: words / 3.5 s + 2 s, rounded
// up to the 9 f grid; the fade-in (30 f) is not part of the time on screen.
const QUOTE_IN = 216; // The line and card stay about 1 s longer (was 153)
const QUOTE_READ = QUOTE_IN + 30; // 183: fully readable
// Quote: « C'est un développeur fiable, curieux et attentif aux besoins des utilisateurs. » is 12 words
// (temoignage-metis, « C'est » = 2), 11 by a plain whitespace count: the longer count is kept, 12 / 3.5 s + 2 s = 333 f.
const QUOTE_WORDS = Math.max(12, wordCount(QUOTE));
const QUOTE_FOR = Math.ceil(Math.ceil((QUOTE_WORDS * 60) / 3.5 + 120) / 9) * 9; // 12 words: 333 f
const END = Math.ceil((QUOTE_READ + QUOTE_FOR) / 9) * 9; // 585 (on the 9 f grid)

const timeline: BitTimeline = {
  slug: SLUG,
  bars: END / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const S = STR[locale];
    const at = (n: number) => from + n; // local frames, 60 fps
    const cue = {
      open: at(0),
      fields: at(18), // the entity page's fields rise in one by one (9 f apart)
      // every cue on the 16th grid (9 f): each one is the nearest grid point of its former local frame
      seul: at(18), // « Du besoin au produit. » (was 14)
      quoteIn: at(QUOTE_IN), // the line leaves; the testimonial arrives (was 150)
      quote1: at(QUOTE_IN), // the testimonial sentence starts (its fade-in ends at 183) (was 156)
      pageSwitch: at(108), // entity page → graph preview (was 112)
      hubs: at(135), // the lab hubs appear (was 132)
      models: at(171), // the models radiate (was 168)
      exportIn: at(198), // the export button appears on the graph (was 200)
      cursorIn: at(252), // the cursor comes in (the camera pan ends here) (was 250)
      click: at(315), // the node click: the sidebar opens (the zoom ends here) (was 316)
      pan: at(315), // the graph eases left to make room for the sidebar (was 316)
      exportMove: at(405), // the cursor leaves the node for the export button (was 402)
      press: at(450), // the export button is pressed (press feedback only) (was 452)
      end: at(END),
    };
    const copy: Copy[] = [
      ...chain(`${SLUG}.seul`, 'build', [[STR.fr.TEXT.seul, cue.seul, S.TEXT.seul]], { out: cue.quoteIn }),
      {
        id: `${SLUG}.quote.1`,
        text: S.QUOTE,
        in: cue.quoteIn,
        resolved: at(QUOTE_READ),
        out: cue.end,
        chain: `${SLUG}.quote`,
        mode: 'replace',
      },
    ];
    return { cue, copy };
  },
};

export default timeline;
