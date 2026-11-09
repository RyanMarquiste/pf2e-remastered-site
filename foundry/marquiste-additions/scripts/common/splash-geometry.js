// The distance arithmetic behind the splash rule (scripts/common/bomb-splash.js). It knows nothing about Foundry: a creature is a block of grid squares,
// written as { top, left, rows, columns } (row and column of its top-left square, and its size in squares), so it can be tested on its own.

// The squares a creature takes up. A creature smaller than a square still covers one.
export function block(top, rows, columns) {
  return { top: top.i, left: top.j, rows: Math.max(1, rows), columns: Math.max(1, columns) };
}

// How far apart two creatures are in squares, by the PF2e rule for diagonals (the first is 5 feet, the second 10, and so on alternating: 5, 10, 5, 10).
// It is measured between the nearest squares of the two, so creatures that touch are 1 square apart, and one with a square between them are 2.
export function distance(a, b) {
  const gap = (lowA, sizeA, lowB, sizeB) => Math.max(lowA - (lowB + sizeB - 1), lowB - (lowA + sizeA - 1), 0);
  const across = gap(a.left, a.columns, b.left, b.columns);
  const down = gap(a.top, a.rows, b.top, b.rows);
  const far = Math.max(across, down);
  return far + Math.floor(Math.min(across, down) / 2);
}

// Whether `other` is within `squares` squares of `target`. Creatures sharing a square (or a space) count as within reach.
export function within(target, other, squares) {
  return distance(target, other) <= squares;
}

// How many squares (5 feet each) the splash reaches: one for the normal 5 feet, and one more for each thing that widens it, up to three.
export function reach(widenedBy) {
  return Math.min(1 + widenedBy.length, 3);
}
