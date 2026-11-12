import React from 'react';
import { Composition, Folder, Still } from 'remotion';
import { BIT_MODULES } from './bits/registry';
import type { BitProps } from './bits/types';
import { C, U } from './brand/tokens';
import { Film, FilmProps } from './Film';
import { FilmSub, subMetadata } from './FilmSub';
import { Audit } from './lib/Audit';
import { FontGate } from './lib/FontGate';
import { LocaleProvider } from './lib/i18n';
import type { Locale } from './lib/locale';
import { MarkSizes, MarkStill, ToolSheet } from './Stills';
import { actOf, FPS, H, planTotal, TOTAL, W } from './timeline';

type SoloProps = BitProps & FilmProps;

// A story bit on its own, font-gated like the film: the unit we iterate and render per seed.
// Composition id: Bit-<slug>. Render it with `pnpm run bit <slug>` (seed and locale in the props file).
const solo = (Bit: React.FC<BitProps>) => {
  const Solo: React.FC<SoloProps> = ({ seed = 1, audit = false, safe, locale = 'fr' }) => (
    <LocaleProvider locale={locale}>
      <FontGate>
        <div style={{ position: 'absolute', inset: 0, background: C.stage }}>
          <Bit seed={seed} />
          {audit && <Audit safe={safe} />}
        </div>
      </FontGate>
    </LocaleProvider>
  );
  return Solo;
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* The whole film, every bit at its FILM_SEED. `--props='{"locale":"en"}'` renders the English film. */}
    <Composition
      id="Film"
      component={Film}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ audit: false, locale: 'fr' as Locale } as FilmProps}
      calculateMetadata={() => ({ durationInFrames: planTotal() })}
    />
    <Composition
      id="FilmSub"
      component={FilmSub}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ groups: [] as number[], locale: 'fr' as Locale }}
      calculateMetadata={subMetadata}
    />

    <Folder name="Bits">
      {BIT_MODULES.map(({ slug, Component }) => (
        <Composition
          key={slug}
          id={`Bit-${slug}`}
          component={solo(Component)}
          durationInFrames={actOf(slug).dur}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{ seed: 1, audit: false, locale: 'fr' as Locale } as SoloProps}
        />
      ))}
    </Folder>

    <Folder name="Stills">
      <Still id="Mark16" component={MarkStill} width={16} height={16} defaultProps={{ size: 16 }} />
      <Still id="MarkLarge" component={MarkStill} width={W} height={H} defaultProps={{ size: 640 * U }} />
      <Still id="MarkSizes" component={MarkSizes} width={W} height={H} />
      <Still id="ToolSheet" component={ToolSheet} width={W} height={H} />
    </Folder>
  </>
);
