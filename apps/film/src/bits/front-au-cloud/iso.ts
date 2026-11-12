// Isometric projection for front-au-cloud. World units: x and z on the floor plane, y up. Every
// solid is drawn as flat SVG polygons, so the picture stays sharp at any scale.
export type P3 = [x: number, y: number, z: number];

const COS = Math.cos(Math.PI / 6);

/** World point to 2D (SVG units inside the stack's group; y grows downward on screen). */
const P = (p: P3): [number, number] => [(p[0] - p[2]) * COS, (p[0] + p[2]) * 0.5 - p[1]];

/** SVG `points` attribute for a list of world points. */
export const pts = (list: P3[]) =>
  list
    .map(P)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');

/** Horizontal rectangle centred on (cx, cz) at height y: w along x, d along z. */
export const flat = (cx: number, y: number, cz: number, w: number, d: number): P3[] => [
  [cx - w / 2, y, cz - d / 2],
  [cx + w / 2, y, cz - d / 2],
  [cx + w / 2, y, cz + d / 2],
  [cx - w / 2, y, cz + d / 2],
];

/** The visible faces of a box: top, the face towards +z (screen left) and the face towards +x (screen right). */
export const boxFaces = (cx: number, y: number, cz: number, w: number, d: number, h: number) => {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const z0 = cz - d / 2;
  const z1 = cz + d / 2;
  return {
    top: flat(cx, y + h, cz, w, d),
    zFace: [
      [x0, y, z1],
      [x1, y, z1],
      [x1, y + h, z1],
      [x0, y + h, z1],
    ] as P3[],
    xFace: [
      [x1, y, z0],
      [x1, y, z1],
      [x1, y + h, z1],
      [x1, y + h, z0],
    ] as P3[],
  };
};
