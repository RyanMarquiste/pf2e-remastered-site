// The square arithmetic behind the splash rule (scripts/common/bomb-splash.js). It knows nothing about Foundry: a creature is a list of grid squares,
// each written as { i, j } (row and column), so it can be tested on its own.

const keyOf = ({ i, j }) => `${i},${j}`;

// The squares a creature takes up, from its top-left square and its size in squares.
export function footprint(top, rows, columns) {
  const cells = [];
  for (let r = 0; r < Math.max(1, rows); r++) for (let c = 0; c < Math.max(1, columns); c++) cells.push({ i: top.i + r, j: top.j + c });
  return cells;
}

// The chosen square and every square within `rings` squares of it (one ring is the eight neighbours). Diagonals count as adjacent.
export function area(center, rings) {
  const keys = new Set();
  for (let r = -rings; r <= rings; r++) for (let c = -rings; c <= rings; c++) keys.add(keyOf({ i: center.i + r, j: center.j + c }));
  return keys;
}

// How many of a creature's squares fall in the area. A creature on two of them takes the splash twice.
export function squaresIn(cells, areaKeys) {
  return cells.reduce((count, cell) => count + (areaKeys.has(keyOf(cell)) ? 1 : 0), 0);
}

// How many rings of squares the splash reaches: one for the normal 5 feet, and one more for each thing that widens it, up to three.
export function rings(widenedBy) {
  return Math.min(1 + widenedBy.length, 3);
}
