import { chain, type BitTimeline, type Copy } from '../../../lib/grid';
import { wordCount } from '../../../lib/pace';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';

const SLUG = 'front-au-cloud';
const SCALE = 540 / 432;

const FADE = 12;
const RISE = 30;
const readFor = (text: string) => Math.ceil(Math.ceil((wordCount(text) * 60) / 3.5 + 120) / 9) * 9;

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 6,
  build: (from, locale = DEFAULT_LOCALE) => {
    const TX = STR.fr.TEXT;
    const SX = STR[locale].TEXT;

    const at = (n: number) => from + 9 * Math.round((n * SCALE) / 9);

    const abs = (n: number) => from + n;

    const q1In = at(176);
    const q1Read = at(206);
    const q1Out = q1Read + readFor(TX.quote1[0]);
    const q2In = q1Out + FADE;
    const q2Read = q2In + RISE;
    const end = q2Read + readFor(TX.quote2[0]);
    const cue = {
      open: at(0),
      fe: at(0),
      feCards: at(18),
      be: at(36),
      beBlocks: at(54),
      cl: at(63),
      redis: at(72),
      pkt: at(81),
      containers: at(90),
      aside: abs(162),
      asideEnd: abs(225),
      quoteIn: at(160),
      push: abs(180),
      pushEnd: from + 864,

      ideIn: abs(0),
      ideType: abs(27),
      ideOut: abs(396),

      reactIn: abs(9),
      reactOut: abs(225),
      reactIn2: abs(432),
      reactOut2: abs(900),

      termIn: abs(207),
      termType: abs(225),
      termImage: abs(342),
      termTotal: abs(360),
      termSplit: abs(378),
      termOk: abs(402),

      gateIn: abs(216),
      gateB: abs(234),
      gateBDone: abs(270),
      gateT: abs(279),
      gateTDone: abs(315),
      gateOk: abs(324),

      gateOut: abs(396),
      termOut: abs(657),

      scanIn: abs(306),
      scan: abs(324),
      scanEnd: abs(384),
      scanOut: abs(390),

      scanIn2: abs(504),
      scan2: abs(522),
      scanEnd2: abs(582),
      scanOut2: abs(588),
      deploy: abs(423),
      req2: abs(468),

      awsIn: abs(333),
      awsRows: abs(342),
      awsOut: abs(504),
      awsIn2: abs(672),
      awsRows2: abs(684),
      awsOut2: abs(900),
      awsSync: abs(792),

      swaggerIn: abs(204),
      swaggerRows: abs(218),
      swaggerOut: abs(300),
      quote1: q1In,
      quote2: q2In,
      end,
    };

    const stack = [
      ...chain(`${SLUG}.stack1`, 'build', [[TX.stack[0], at(9), SX.stack[0]]], { out: at(150) }),
      ...chain(`${SLUG}.stack2`, 'build', [[TX.stack[1], at(45), SX.stack[1]]], { out: at(150) }),
      ...chain(`${SLUG}.stack3`, 'build', [[TX.stack[2], at(81), SX.stack[2]]], { out: at(150) }),
    ];

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
