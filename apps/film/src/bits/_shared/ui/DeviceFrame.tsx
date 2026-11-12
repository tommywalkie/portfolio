import React from 'react';
import { C } from '../../../brand/tokens';

/**
 * A tablet or phone body behind an app screen: a near-black bezel `pad` px around the screen rect,
 * with an optional front camera dot on the bezel's top edge (`camera` is its opacity; omit it for
 * a phone, which draws its own speaker slot inside the screen). Draw it BEFORE the screen (the
 * BrowserWindow or the app's screen), so the screen sits on top. Use `opacity` to fade the body
 * in during a morph from a browser window.
 */
export type DeviceFrameProps = {
  x: number; // screen rect, frame px
  y: number;
  w: number;
  h: number;
  r: number; // the screen's corner radius; the body is r + pad
  pad: number; // bezel width, px (tablet ~28, phone ~14)
  opacity: number; // 0..1
  camera?: number; // opacity of the front camera dot (tablet); omit for none
};

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ x, y, w, h, r, pad, opacity, camera }) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w + 2 * pad,
        height: h + 2 * pad,
        borderRadius: r + pad,
        background: C.appBezel,
        opacity,
        transform: `translate(${x - pad}px, ${y - pad}px)`,
      }}
    />
    {camera !== undefined && (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 12,
          height: 12,
          borderRadius: 6,
          // a hairline on the near-black body: dkLine is pinned in both themes, so the lens stays as
          // subtle as it is on the dark stage instead of turning into a light dot on a white page
          background: C.dkLine,
          opacity: opacity * camera,
          transform: `translate(${x + w / 2 - 6}px, ${y - pad / 2 - 6}px)`,
        }}
      />
    )}
  </>
);
