import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, TYPE } from '../../../brand/tokens';
import { MaskRise } from '../../../fx/MaskRise';
import { E, mix, prog } from '../../../lib/anim';
import { useStrings } from '../../../lib/i18n';
import type { SoundEvent } from '../../../sync';
import { CUE, W } from '../../../timeline';
import { fitSize } from '../../../lib/measure';
import type { BitModule } from '../../types';
import { sfx } from '../../_shared/sfx';
import { STR } from './copy';
import { K, SLUG, useFrames } from './common';
import { EXIT, RISE } from './timeline';

const TRACK_IN = 0.22;
const COL_W = W - 144;

const Bit: React.FC = () => {
  const S = useStrings(STR);
  const { F } = useFrames();

  const track = (inF: number, to: number = TYPE.display.track) => `${mix(TRACK_IN, to, prog(F, inF, inF + RISE, E.out)).toFixed(4)}em`;
  // Fitted at the final tracking; the wider entry tracking may overhang briefly while it settles.
  const nameSize = fitSize(S.name, COL_W, TYPE.display.size, TYPE.display.weight, TYPE.display.track);
  const roleSize = fitSize(S.role, COL_W, TYPE.line.size, TYPE.line.weight, TYPE.line.track);

  return (
    <AbsoluteFill style={{ background: C.stage }}>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <MaskRise
          id="titre.nom"
          text={S.name}
          frame={F}
          start={K('name')}
          out={K('nameOut')}
          outDur={EXIT}
          role="display"
          align="center"
          dur={RISE}
          ease={E.out}
          size={nameSize}
          style={{ color: C.bright, letterSpacing: track(K('name')) }}
        />
        <MaskRise
          id="titre.role"
          text={S.role}
          frame={F}
          start={K('role')}
          out={K('roleOut')}
          outDur={EXIT}

          role="line"
          size={roleSize}
          align="center"
          dur={RISE}
          ease={E.out}
          style={{ color: C.soft, letterSpacing: track(K('role'), TYPE.line.track) }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const cues = (): SoundEvent[] => {
  const k = (n: string) => {
    const v = CUE[`${SLUG}.${n}`];
    if (v === undefined) throw new Error(`${SLUG}: no cue "${n}"`);
    return v;
  };
  return [
    sfx('text', k('name') + 6, 'name'),
    sfx('text', k('role') + 6, 'role', { weight: 0.8 }),
  ];
};

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
