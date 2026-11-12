import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../../../brand/tokens';
import { logoOf, type Tool } from '../../../data/tools';

/**
 * A tool tag: logo + name on a light chip (light so dark and single-colour logos all read). It is a
 * depicted surface on the stage, not film type, so it reads the app ramp and stays light in both
 * themes. `size` is the chip height in px; everything inside scales with it.
 */
export const ToolChip: React.FC<{ tool: Tool; size?: number; style?: React.CSSProperties }> = ({ tool, size = 64, style }) => {
  const logo = size * 0.56;
  return (
    <div
      data-ui
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.22,
        height: size,
        padding: `0 ${size * 0.34}px 0 ${size * 0.22}px`,
        borderRadius: size / 2,
        background: C.appPaper,
        border: `1.5px solid ${C.appFill}`,
        boxShadow: '0 20px 60px rgba(0,0,0,.18)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div style={{ width: logo, height: logo, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Img src={staticFile(logoOf(tool))} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
      <span style={{ fontFamily: FONT.text, fontWeight: 600, fontSize: size * 0.4, color: C.appInk, letterSpacing: '-0.01em' }}>{tool.label}</span>
    </div>
  );
};
