import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, TYPE } from '../../brand/tokens';
import { MaskRise } from '../../fx/MaskRise';
import { E, mix, prog } from '../../lib/anim';
import { useStrings } from '../../lib/i18n';
import { actOf, CUE } from '../../timeline';
import type { SoundEvent } from '../../sync';
import { sfx } from '../_shared/sfx';
import type { BitModule, BitProps } from '../types';
import { STR } from './copy';
import { EXIT, RISE } from './timeline';

const SLUG = 'contact';
const K = (name: string) => {
  const v = CUE[`${SLUG}.${name}`];
  if (v === undefined) throw new Error(`${SLUG}: no cue "${name}"`);
  return v;
};

/** Letter-spacing (em) the line starts with: wide, then it closes onto the display track as it rises (as titre). */
const TRACK_IN = 0.22;
// No seed-dependent variation: the same stinger for every seed.
const Bit: React.FC<BitProps> = () => {
  const S = useStrings(STR);
  const f = useCurrentFrame();
  const act = actOf(SLUG);
  const F = f + act.from; // absolute frame: every cue is absolute

  // The tighten: the letter-spacing closes from TRACK_IN to the display track over the rise (E.out, an arrival).
  const track = (inF: number) => `${mix(TRACK_IN, TYPE.display.track, prog(F, inF, inF + RISE, E.out)).toFixed(4)}em`;

  return (
    <AbsoluteFill style={{ background: C.stage }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaskRise
          id={`${SLUG}.msg`}
          text={S.msg}
          frame={F}
          start={K('msg')}
          out={K('msgOut')}
          outDur={EXIT}
          role="display"
          align="center"
          dur={RISE}
          ease={E.out}
          style={{ color: C.bright, letterSpacing: track(K('msg')) }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const cues = (): SoundEvent[] => [sfx('text', K('msg') + 4, 'msg', { weight: 0.9 })];

const bit: BitModule = { slug: SLUG, Component: Bit, cues };
export default bit;
