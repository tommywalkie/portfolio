export type P3 = [x: number, y: number, z: number];

const COS = Math.cos(Math.PI / 6);

const P = (p: P3): [number, number] => [(p[0] - p[2]) * COS, (p[0] + p[2]) * 0.5 - p[1]];

export const pts = (list: P3[]) =>
  list
    .map(P)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');

export const flat = (cx: number, y: number, cz: number, w: number, d: number): P3[] => [
  [cx - w / 2, y, cz - d / 2],
  [cx + w / 2, y, cz - d / 2],
  [cx + w / 2, y, cz + d / 2],
  [cx - w / 2, y, cz + d / 2],
];

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
