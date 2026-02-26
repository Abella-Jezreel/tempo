import type { NoteId, Point } from './note.types';

export type DragSession = Readonly<{
  id: NoteId;
  startPointer: Point;
  startPosition: Point;
}>;