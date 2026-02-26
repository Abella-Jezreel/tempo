import type { Size } from './note.types';

export const CANVAS_MIN_WIDTH = 1024;
export const CANVAS_MIN_HEIGHT = 768;

export const NOTE_MIN_SIZE: Size = { width: 140, height: 120 };
export const NOTE_DEFAULT_SIZE: Size = { width: 220, height: 180 };

export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green'] as const;