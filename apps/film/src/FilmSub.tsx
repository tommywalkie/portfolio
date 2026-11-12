import React, { useMemo } from 'react';
import { CalculateMetadataFunction, Freeze, useCurrentFrame } from 'remotion';
import { subframes } from './blur';
import { Film } from './Film';
import type { Locale } from './lib/locale';

// The film as a stream of sub-frames for the motion-blurred master (see src/blur.ts). Frame j of
// this composition is the film at the (fractional) time of the j-th sub-frame; accumulate.py
// averages each output frame's group. `groups` (samples per output frame) comes from
// scripts/measure-speed.py via --props=out/samples.json. Discrete state in the acts must use
// fd(frame) so all samples of one output frame agree. `shutters` (optional) shortens the shutter
// on frames too fast for their samples. `locale` is the film's text (fr | en), as in Film.
export type FilmSubProps = { groups: number[]; shutters?: number[]; locale?: Locale };

export const FilmSub: React.FC<FilmSubProps> = ({ groups, shutters, locale = 'fr' }) => {
  const j = useCurrentFrame();
  const subs = useMemo(() => subframes(groups, shutters), [groups, shutters]);
  const s = subs[Math.min(j, subs.length - 1)];
  return (
    <Freeze frame={s.t}>
      <Film locale={locale} />
    </Freeze>
  );
};

export const subMetadata: CalculateMetadataFunction<FilmSubProps> = ({ props }) => ({
  durationInFrames: subframes(props.groups, props.shutters).length,
});
