import { BAR, chain, type BitTimeline, type Copy } from '../../../lib/grid';
import { wordCount } from '../../../lib/pace';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const QUOTE = STR.fr.QUOTE;

const SLUG = 'graphe-relationnel';

const QUOTE_IN = 216;
const QUOTE_READ = QUOTE_IN + 30;

const QUOTE_WORDS = Math.max(12, wordCount(QUOTE));
const QUOTE_FOR = Math.ceil(Math.ceil((QUOTE_WORDS * 60) / 3.5 + 120) / 9) * 9;
const END = Math.ceil((QUOTE_READ + QUOTE_FOR) / 9) * 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: END / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const S = STR[locale];
    const at = (n: number) => from + n;
    const cue = {
      open: at(0),
      fields: at(18),

      seul: at(18),
      quoteIn: at(QUOTE_IN),
      quote1: at(QUOTE_IN),
      pageSwitch: at(108),
      hubs: at(135),
      models: at(171),
      exportIn: at(198),
      cursorIn: at(252),
      click: at(315),
      pan: at(315),
      exportMove: at(405),
      press: at(450),
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
