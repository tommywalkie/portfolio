// sncf-carte: the tool round on a clean-room tablet. 4.0625 bars (9.75 s at 100 BPM, 585 f), was 7.5 s (450 f).
//   bar 1     the tablet (75-85% of the frame) and its list fill: three tools are added, one per tap (18, 45, 72)
//   bar 2     « Itinéraire » is tapped (99); the one route draws on from the agent (108-153); the total chip (162);
//             the agent leaves the entrance (126) and reaches stop 1 (171): its scan, the item is marked « Bon état »
//             (189). The camera zooms out right away (189-216): the plan is whole from here on.
//   bar 3     the agent walks on to stop 2 (216 → 252): scan, marked « À réparer » (270); on to stop 3
//             (288 → 333): scan, marked « Bon état » (351); the round is done
//   copy      the tablet slides left (369-405, E.cam) to make room; « Ownership de bout en bout. » rises beside it (387);
//             the experience card arrives under the line (414)
//   end       the copy and the card hold for about 2.3 s (585)
// Every cue sits on the 9 f grid. The walk legs are LEG_F (45 f), the scan holds SCAN_F (36 f), the mark sits in
// the middle of each scan (18 f in).
import { chain, type BitTimeline } from '../../lib/grid';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';
import { LEG_F, SCAN_F } from './route';

const SLUG = 'sncf-carte';

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 441 / 144,
  build: (from, locale = DEFAULT_LOCALE) => {
    const T = (x: number) => from + x; // frames from the bit's first frame (the grid is 144 f per bar)
    // the walk: each leg takes LEG_F frames, each scan holds the agent SCAN_F f at its stop
    const walk0 = T(126);
    const arr1 = walk0 + LEG_F;
    const leave1 = arr1 + SCAN_F;
    const arr2 = leave1 + LEG_F;
    const leave2 = arr2 + SCAN_F;
    const arr3 = leave2 + LEG_F;
    const cue = {
      open: T(0), // frame 0: the tablet is on screen
      tapAdd1: T(18), // the list gets its first tool (taps 27 f apart)
      tapAdd2: T(45),
      tapAdd3: T(72),
      tapRoute: T(99), // « Itinéraire » ripple
      drawFrom: T(108), // the route starts to draw from the agent
      drawTo: T(153), // the route is drawn
      chip: T(162), // the total chip
      walk0, // the agent leaves the entrance
      arr1, // stop 1: the scan frame appears
      mark1: arr1 + SCAN_F / 2, // stop 1's item is marked « Bon état », in the middle of its scan
      zoom0: arr1, // the camera zooms out as soon as the agent reaches stop 1 (earlier)
      zoom1: arr1 + 27, // and has settled on the whole plan
      leave1,
      arr2, // stop 2
      mark2: arr2 + SCAN_F / 2, // stop 2's item is marked « À réparer » (seed 1)
      leave2,
      arr3, // stop 3
      mark3: arr3 + SCAN_F / 2, // stop 3's item is marked « Bon état »
      cam0: leave2, // the tablet starts to slide left as the agent walks to stop 3 (headline earlier)
      cam1: leave2 + 36, // and has settled
      copy: leave2 + 18, // « Ownership de bout en bout. » rises beside the tablet
      card: leave2 + 45, // the experience card arrives under the line
      end: T(441), // the bit's end (3.0625 bars): about 1 s after everything is in
    };
    // the message is two lines at display size: one chain per line, both rising on the same frame
    const marche1 = chain(`${SLUG}.marche1`, 'build', [[STR.fr.msg[0], cue.copy, STR[locale].msg[0]]], { out: cue.end });
    const marche2 = chain(`${SLUG}.marche2`, 'build', [[STR.fr.msg[1], cue.copy, STR[locale].msg[1]]], { out: cue.end });
    return { cue, copy: [...marche1, ...marche2] };
  },
};

export default timeline;
