import { describe, expect, it } from 'vitest';
import { rectsIntersect } from './react';

describe('rectsIntersect', () => {
  it('returns true when overlapping', () => {
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }))
      .toBe(true);
  });

  it('returns false when separated', () => {
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 50, y: 50, width: 10, height: 10 }))
      .toBe(false);
  });
});