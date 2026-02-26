export type NoteId = string;

export type Point = Readonly<{
  x: number;
  y: number;
}>;

export type Size = Readonly<{
  width: number;
  height: number;
}>;

export type Rect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green';

export type Note = Readonly<{
  id: NoteId;
  position: Point;
  size: Size;
  content: string;
  color: NoteColor;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}>;

export type NotesState = Readonly<{
  notes: ReadonlyArray<Note>;
  nextZIndex: number;
}>;