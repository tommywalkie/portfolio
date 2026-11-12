import { BAR, type BitTimeline, type Copy } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'titre';

const LEN = 120;

export const RISE = 16;

export const EXIT = 12;

const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {

    const at = (n: number) => Math.ceil((from + n) / S16) * S16;
    const cue: Record<string, number> = {
      name: at(9),
      nameOut: at(108),
      role: at(54),
      roleOut: at(108),
    };
    const S = STR[locale];
    const copy: Copy[] = [
      { id: `${SLUG}.nom.0`, text: S.name, in: cue.name, resolved: cue.name + RISE, out: cue.nameOut },
      { id: `${SLUG}.role.0`, text: S.role, in: cue.role, resolved: cue.role + RISE, out: cue.roleOut },
    ];
    return { cue, copy };
  },
};

export default timeline;
