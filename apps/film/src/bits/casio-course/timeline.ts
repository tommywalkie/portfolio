// casio-course: the racehorse game on the Graph 35+E, opened by a short programming beat. 513 f = 8.55 s at 100 BPM / 60 fps (144 f a bar).
//   opening, 0-225 f (3.75 s, unchanged):
//     0      the program editor is open; the horse race code is typed (1.95 s), caret on the last character
//     117    the file is saved: the caret goes, SAVED shows
//     135    the program list (PRGM) replaces the editor; the cursor walks up to COURSE (153, 171, 189)
//     207    COURSE is highlighted, then it runs (225: the horse menu appears)
//   race, counted from the menu at 225 f (r = frames after it):
//   r 0      close on the LCD: the TUI menu; the cursor walks down (r 18, 27) and selects the pick at r 36
//   r 45     the screen switches to the race lanes; r 54 the race starts
//   r 72-108 the race: three pixel horses run left to right at random speeds (r 54-117, 1.05 s)
//   r 117    the winner's nose crosses; r 126 the status line shows GAGNE / PERDU
//   r 135    the camera starts to pull back to the tilted calculator (landed at r 171); « Tout a commencé ici. »
//            rises from the same frame, then holds about 1.4 s to the end (r 288)
import { BAR, bitClock, chain, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'casio-course';
/** The opening's length in frames: 225 f = 1.5625 bars at 100 BPM / 60 fps (144 f a bar). Fixed. */
const OPENING = 225;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: (OPENING + 288) / BAR,
  build: (from, locale = DEFAULT_LOCALE) => {
    const { at } = bitClock(from);
    // The menu and race, in frames counted from the menu cue (r 0 = absolute OPENING after the start).
    const R = (n: number) => from + OPENING + n;
    const cue = {
      code: at(1), // frame 0: the editor is open, the code is typed from here
      typeA: at(1, 1), // typing progress markers (the typing is a continuous action: a cue at least every 72 f)
      typeB: at(1, 2),
      save: at(1, 3, 1), // 117 f: the last character is in; the caret goes, SAVED shows
      list: at(1, 3, 3), // 135 f: the program list replaces the editor
      listUp1: at(2, 0, 1), // the cursor moves up to INTEGRA
      listUp2: at(2, 0, 3), // ...to DERIV
      listUp3: at(2, 1, 1), // ...to COURSE
      listSel: at(2, 1, 3), // COURSE is highlighted
      menu: R(0), // 225 f: COURSE runs; the horse menu appears
      step1: R(18), // the cursor moves down
      step2: R(27), // the cursor moves down again
      select: R(36), // inverse-video highlight on the picked line
      grid: R(45), // the screen switches to the race lanes
      go: R(54), // the race starts
      // the horses advance on every LCD tick through the race: these mark its progress
      race1: R(72),
      race2: R(90),
      race3: R(108),
      finish: R(117), // the winner's nose crosses the line
      result: R(126), // the status line shows GAGNE / PERDU
      pull: R(135), // the camera pulls back from the LCD...
      rest: R(171), // ...and rests on the tilted calculator
      title: R(144), // 150 ms (9 f) after the pull-back starts, so the copy doesn't overlap the illustration
      end: R(288), // the bit ends: the copy has been fully in for about 1.4 s
    };
    const copy = [...chain(`${SLUG}.titre`, 'build', [[STR.fr.TITLE, cue.title, STR[locale].TITLE]], { out: cue.end })];
    return { cue, copy };
  },
};

export default timeline;
