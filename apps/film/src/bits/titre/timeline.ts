// titre: the title card between slide 1 (casio-course) and slide 3 (olympiades). Trailer-style, 2 s: 120 f at 60 fps
// (0.8333 bars at 100 BPM, 1 bar = 144 f). The master pads the act up to the 16th grid: 126 f.
// Local frames (from the act's start), 60 fps; every cue sits on the absolute 16th grid (9 f), snapped up:
//   9    « Tom Bazarnik » rises out of its mask on E.out (RISE f), its letter-spacing closes from wide to the display track
//   54   the name leaves upward (EXIT f), gone by 66
//   72   « Développeur Fullstack » rises in the same way, once the name has cleared the frame
//   108  the role leaves upward (EXIT f), gone by 120; the stage is empty for the last 6 f, then the olympiades act starts
import { BAR, type BitTimeline, type Copy } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'titre';
/** The length in frames (2 s). */
const LEN = 120;
/** Frames each line takes to rise in. */
export const RISE = 16;
/** Frames each line takes to leave upward. */
export const EXIT = 12;
/** The 16th grid of a 100 BPM / 60 fps bit (9 f). */
const S16 = 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: LEN / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    // The act starts on the 16th grid (the acts before it pad to it), so each cue snaps up to the absolute grid.
    const at = (n: number) => Math.ceil((from + n) / S16) * S16;
    const cue: Record<string, number> = {
      name: at(9),
      nameOut: at(108), // the name stays and leaves together with the role
      role: at(54), // under the name, which stays up (was 72)
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
