import type { NoteColor, NoteId, Point, Size } from './note.types';

export type NotesAction =
  | { type: 'CREATE_NOTE'; payload: { position: Point; size: Size; color: NoteColor } }
  | { type: 'MOVE_NOTE'; payload: { id: NoteId; position: Point } }
  | { type: 'RESIZE_NOTE'; payload: { id: NoteId; size: Size } }
  | { type: 'REMOVE_NOTE'; payload: { id: NoteId } }
  | { type: 'UPDATE_NOTE_CONTENT'; payload: { id: string; content: string } }
  | { type: 'BRING_TO_FRONT'; payload: { id: NoteId } }
  | { type: 'UPDATE_TEXT'; payload: { id: NoteId; content: string } }
  | { type: 'UPDATE_COLOR'; payload: { id: NoteId; color: NoteColor } }
  | { type: 'HYDRATE'; payload: { notes: import('./note.types').Note[] } };
