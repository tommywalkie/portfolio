// titre: the title card. The name rises out of its mask with its letter-spacing closing onto the display track and
// stays; the role rises just below it, in its own style. Both leave together. Nothing else on the stage.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, TYPE } from '../../brand/tokens';
import { MaskRise } from '../../fx/MaskRise';
import { E, mix, prog } from '../../lib/anim';
import { useStrings } from '../../lib/i18n';
import type { SoundEvent } from '../../sync';
import { CUE } from '../../timeline';
import type { BitModule } from '../types';
import { sfx } from '../_shared/sfx';
import { STR } from './copy';
import { K, SLUG, useFrames } from './common';
import { EXIT, RISE } from './timeline';

/** Letter-spacing (em) a line starts with: wide, then it closes onto the display track as it rises. */
const TRACK_IN = 0.22;

// No seed-dependent variation: the same card and timing for every seed.
const Bit: React.FC = () => {
  const S = useStrings(STR);
  const { F } = useFrames();

  // The tighten: the letter-spacing closes from TRACK_IN to the display track over the rise (E.out, an arrival).
  const track = (inF: number, to: number = TYPE.display.track) => `${mix(TRACK_IN, to, prog(F, inF, inF + RISE, E.out)).toFixed(4)}em`;

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      {/* the name, then the role, centred on the stage: nothing else on screen */}
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
          style={{ color: C.bright, letterSpacing: track(K('name')) }}
        />
        <MaskRise
          id="titre.role"
          text={S.role}
          frame={F}
          start={K('role')}
          out={K('roleOut')}
          outDur={EXIT}
          // the role is styled apart from the name: the line role (64 px, weight 500) in the soft colour
          role="line"
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
