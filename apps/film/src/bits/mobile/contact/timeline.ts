import { BAR, type BitTimeline, type Copy } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'contact';

const LEN = 54;

export const RISE = 18;

export const EXIT = 18;

const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {

    const at = (n: number) => Math.ceil((from + n) / S16) * S16;
    const cue: Record<string, number> = {
      msg: at(0),
      msgOut: at(27),
    };
    const S = STR[locale];
    const copy: Copy[] = [{ id: `${SLUG}.msg.0`, text: S.msg, in: cue.msg, resolved: cue.msg + RISE, out: cue.msgOut }];
    return { cue, copy };
  },
};

export default timeline;
