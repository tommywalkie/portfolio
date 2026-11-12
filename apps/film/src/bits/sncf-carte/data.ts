// Non-text data of the tool-round app: the QR glyph's pattern (fictional codes, the same in every locale) and the
// route's total numbers. Every string is in copy.ts (i18n).

// The QR glyph: 7 x 7 cells, '1' = dark. One pattern for every tool (fictional codes).
export const QR_CELLS =
  '1110111' + // row 0
  '1000101' + // row 1
  '1011101' + // row 2
  '1001001' + // row 3
  '1101011' + // row 4
  '1000101' + // row 5
  '1110111'; // row 6

// The route's total for the chip: three tools, the metres walked on the plan.
export const ROUTE_TOTAL = { tools: 3, metres: 420 };
