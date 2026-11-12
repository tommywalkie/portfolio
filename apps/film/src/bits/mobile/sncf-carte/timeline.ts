import { chain, type BitTimeline } from '../../../lib/grid';
import { DEFAULT_LOCALE } from '../../../lib/locale';
import { STR } from './copy';
import { LEG_F, SCAN_F } from './route';

const SLUG = 'sncf-carte';

const timeline: BitTimeline = {
  slug: SLUG,
  bars: 441 / 144,
  build: (from, locale = DEFAULT_LOCALE) => {
    const T = (x: number) => from + x;

    const walk0 = T(126);
    const arr1 = walk0 + LEG_F;
    const leave1 = arr1 + SCAN_F;
    const arr2 = leave1 + LEG_F;
    const leave2 = arr2 + SCAN_F;
    const arr3 = leave2 + LEG_F;
    const cue = {
      open: T(0),
      tapAdd1: T(18),
      tapAdd2: T(45),
      tapAdd3: T(72),
      tapRoute: T(99),
      drawFrom: T(108),
      drawTo: T(153),
      chip: T(162),
      walk0,
      arr1,
      mark1: arr1 + SCAN_F / 2,
      zoom0: arr1,
      zoom1: arr1 + 27,
      leave1,
      arr2,
      mark2: arr2 + SCAN_F / 2,
      leave2,
      arr3,
      mark3: arr3 + SCAN_F / 2,
      cam0: leave2,
      cam1: leave2 + 36,
      copy: leave2 + 18,
      card: leave2 + 45,
      end: T(441),
    };

    const marche1 = chain(`${SLUG}.marche1`, 'build', [[STR.fr.msg[0], cue.copy, STR[locale].msg[0]]], { out: cue.end });
    const marche2 = chain(`${SLUG}.marche2`, 'build', [[STR.fr.msg[1], cue.copy, STR[locale].msg[1]]], { out: cue.end });
    return { cue, copy: [...marche1, ...marche2] };
  },
};

export default timeline;
