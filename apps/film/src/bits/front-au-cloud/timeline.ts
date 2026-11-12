// front-au-cloud: an isometric stack of three floors (Frontend, Backend, Cloud) that comes alive floor by floor,
// then 14.4 s (6 bars, 864 f at 100 BPM, 60 fps). The copy « Frontend, Backend, Cloud. » comes in word by word
// under the stack's first 2 s. The stack eases left while Manuel Darcemont's box takes the right: sentence 1 shows
// whole, then sentence 2 shows whole and stays to the end. The picture keeps scripted action through the whole bit
// (no stretch longer than 72 f without an event): a CI gate runs its two jobs and ends on success, a viewfinder
// scans the cloud floor and its Trivy terminal reports, the containers light up one by one on deploy, a second
// request joins the backend flow, the IDE, the AWS list and the React page come back, and a second scan runs over
// the deployed cloud floor. Floating wireframes swing in (3D) and fade out (opacity only).
// Phases (bit-local frames, 60 fps):
//   0-117     the stack builds: frontend floor (0), panels (27); copy « Frontend, » (9); backend floor (45), copy
//             « Backend, » (54), blocks rise (72); cloud floor (81), copy « Cloud. » (99), redis pulses (90),
//             packets flow (99), containers drop in (117); the copy leaves at 189
//   135-396   IDE window (135), the NestJS module typed from 150 (30 cps, about 224 f), fades out at 396
//   153-225   React welcome page (153), fades out at 225
//   162-225   the stack eases left (aside), the quote box arrives at 198; the camera pushes in from 180 to the end
//   207-450   terminal window (207), trivy typed from 225 (26 cps); output at 342 / 360 / 378, « 0 vulnérabilité
//             critique » in accent at 402; fades out at 450
//   216-396   CI gate (216): build job 234-270, test job 279-315, success state at 324; fades out at 396
//   306-390   viewfinder on the cloud floor (306); the beam sweeps it top to bottom 324-384; fades out at 390
//   333-468   AWS service list (333, rows from 342, dots on), fades out at 468
//   423 / 441 / 459   the three containers light up one after the other (deploy)
//   468       a second request: two more packets join the backend flow (they keep flowing to the end)
//   480-600   React welcome page again (480 → 600)
//   504-588   second scan over the deployed cloud floor (504 → 588)
//   672-792   AWS service list again (672, rows 684-724, dots on, fades out at 792)
//   792-864   the picture holds with the stack's drift, the wireframes' drift and the camera push
// Testimonial (read-time rule, unchanged): sentence 1 is fully readable from 261 and stays on screen to 594 (12
// words: 333 f); sentence 2 is fully readable from 636 and stays to 861 (6 words: 225 f). Copy frames are per-entry.
// Cue times are frames from `from` (60 fps). The copy and the quote keep their former timing (`at`, scaled from the
// first 7.2 s version); the illustration's cues are written in bit-local frames (`abs`, multiples of 9 f).
import { chain, type BitTimeline, type Copy } from '../../lib/grid';
import { wordCount } from '../../lib/pace';
import { DEFAULT_LOCALE } from '../../lib/locale';
import { STR } from './copy';

const SLUG = 'front-au-cloud';
const SCALE = 540 / 432; // the copy's and quote's first cue times were written over 7.2 s; scaled to the 9 s version

// Testimonial read time: a sentence stays fully on
// screen for words / 3.5 s + 2 s (about 210 words a minute), rounded up to the 9 f grid. The fade-in (30 f) is not
// part of the time on screen; the fade-out (12 f) starts before the next sentence.
const FADE = 12;
const RISE = 30;
const readFor = (text: string) => Math.ceil(Math.ceil((wordCount(text) * 60) / 3.5 + 120) / 9) * 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 6,
  build: (from, locale = DEFAULT_LOCALE) => {
    const TX = STR.fr.TEXT; // timing text (French): the frames are the same in every locale
    const SX = STR[locale].TEXT; // the text shown
    // the copy's and quote's cues: every scaled frame snapped to the nearest 16th-grid point (9 f)
    const at = (n: number) => from + 9 * Math.round((n * SCALE) / 9);
    // the illustration's cues: bit-local frames, all on the 16th grid (9 f)
    const abs = (n: number) => from + n;
    // the testimonial: sentence 1 is fully readable from 261 f and stays on screen for its read time, then sentence 2
    const q1In = at(176);
    const q1Read = at(206); // sentence 1 fully readable (its fade-in ends here)
    const q1Out = q1Read + readFor(TX.quote1[0]); // 594
    const q2In = q1Out + FADE; // 606
    const q2Read = q2In + RISE; // 636
    const end = q2Read + readFor(TX.quote2[0]); // 861: sentence 2 stays to the end of the bit (the bit is 864 f)
    const cue = {
      open: at(0),
      fe: at(0), // the frontend floor starts to descend
      feCards: at(18), // its panels assemble
      be: at(36), // the backend floor starts to descend
      beBlocks: at(54), // its service blocks rise
      cl: at(63), // the cloud floor starts to descend
      redis: at(72), // the cache starts pulsing
      pkt: at(81), // packets start to flow
      containers: at(90), // the containers drop in
      aside: abs(162), // the stack starts to ease left
      asideEnd: abs(225),
      quoteIn: at(160), // the testimonial box arrives on the right
      push: abs(180), // the camera starts to push in on the stack
      pushEnd: from + 864, // the push keeps easing in over the held picture, to the bit's end
      // IDE window (NestJS module typed on, 30 cps)
      // Rule: at every frame at least 2 wireframes are on screen together (the IDE and the React page open the bit;
      // the hand-overs below overlap; the second React page and the second AWS list stay to the end).
      ideIn: abs(0),
      ideType: abs(27),
      ideOut: abs(396),
      // React welcome page, first and second cycle
      reactIn: abs(9),
      reactOut: abs(225),
      reactIn2: abs(432),
      reactOut2: abs(900), // stays to the end
      // security terminal (stays to the end): trivy typed, then its output
      termIn: abs(207),
      termType: abs(225),
      termImage: abs(342), // scan output: image line
      termTotal: abs(360), // scan output: total
      termSplit: abs(378), // scan output: severities
      termOk: abs(402), // scan output: 0 critical vulnerability (accent)
      // the CI gate (Gate.tsx): two jobs one after another, then the success state
      gateIn: abs(216), // the gate arrives, beside the stack's top right
      gateB: abs(234), // build job starts (spinner)
      gateBDone: abs(270), // build job: check
      gateT: abs(279), // test job starts (spinner)
      gateTDone: abs(315), // test job: check
      gateOk: abs(324), // success state (pill, border, full progress bar)
      // The CI and the Trivy windows leave like every other wireframe of the bit (same exit as the IDE's)
      gateOut: abs(396), // the CI window fades out with the IDE
      termOut: abs(657), // (held until the second AWS list is in) the Trivy terminal fades out once « 0 vulnérabilité critique » has been read
      // the security scan (Gate.tsx): a viewfinder frames the cloud floor, a beam sweeps it top to bottom
      scanIn: abs(306), // the viewfinder's corners appear
      scan: abs(324), // the beam starts to sweep
      scanEnd: abs(384), // the beam reaches the front edge
      scanOut: abs(390), // the viewfinder fades out
      // a second scan over the deployed cloud floor (the same viewfinder, its own cues)
      scanIn2: abs(504),
      scan2: abs(522),
      scanEnd2: abs(582),
      scanOut2: abs(588),
      deploy: abs(423), // the containers light up one by one: box i at deploy + 18 i
      req2: abs(468), // a second request: two more packets join the backend flow
      // AWS service list, first and second cycle
      awsIn: abs(333),
      awsRows: abs(342),
      awsOut: abs(504),
      awsIn2: abs(672),
      awsRows2: abs(684),
      awsOut2: abs(900), // stays to the end
      awsSync: abs(792), // a beat under the held picture (the list used to leave here): keeps the event gap under 72 f
      // the Swagger page is hidden (SHOW_SWAGGER in Wireframes.tsx); its cues are kept for when it returns
      swaggerIn: abs(204),
      swaggerRows: abs(218),
      swaggerOut: abs(300),
      quote1: q1In, // sentence 1 of the testimonial carousel
      quote2: q2In, // sentence 2 (the last one stays to the end)
      end, // the bit's end
    };
    // One word per row in the right zone (the two-zone layout), each landing with its floor; all leave
    // together when the quote takes their place.
    const stack = [
      ...chain(`${SLUG}.stack1`, 'build', [[TX.stack[0], at(9), SX.stack[0]]], { out: at(150) }),
      ...chain(`${SLUG}.stack2`, 'build', [[TX.stack[1], at(45), SX.stack[1]]], { out: at(150) }),
      ...chain(`${SLUG}.stack3`, 'build', [[TX.stack[2], at(81), SX.stack[2]]], { out: at(150) }),
    ];
    // Each testimonial sentence is one whole entry: it fades in within 30 f and stays whole until it leaves.
    const sentence = (id: string, shown: string, inF: number, readF: number, outF: number): Copy => ({
      id: `${SLUG}.${id}.1`,
      text: shown,
      in: inF,
      resolved: readF,
      out: outF,
      chain: `${SLUG}.${id}`,
      mode: 'replace',
    });
    const quote: Copy[] = [
      sentence('quote1', SX.quote1[0], q1In, q1Read, q1Out),
      sentence('quote2', SX.quote2[0], q2In, q2Read, end),
    ];
    return { cue, copy: [...stack, ...quote] };
  },
};

export default timeline;
