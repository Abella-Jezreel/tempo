import { NOTE_MIN_SIZE } from './note.constants';
import type { Note, NotesState } from './note.types';
import type { NotesAction } from './note.actions';
import { clamp } from '../../../shared/utils/clamp';

function now(): number {
  return Date.now();
}

function createId(): string {
  // good enough for take-home; avoids extra deps
  return crypto.randomUUID ? crypto.randomUUID() : `note_${Math.random().toString(16).slice(2)}`;
}

export const initialNotesState: NotesState = {
  notes: [],
  nextZIndex: 1,
};

function withUpdatedNote(
  notes: ReadonlyArray<Note>,
  id: string,
  updater: (n: Note) => Note,
): ReadonlyArray<Note> {
  return notes.map((n) => (n.id === id ? updater(n) : n));
}

export function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'HYDRATE': {
      const maxZ = action.payload.notes.reduce((m, n) => Math.max(m, n.zIndex), 0);
      return {
        notes: action.payload.notes,
        nextZIndex: maxZ + 1,
      };
    }

    case 'CREATE_NOTE': {
      const t = now();
      const note: Note = {
        id: createId(),
        position: action.payload.position,
        size: action.payload.size,
        content: '',
        color: action.payload.color,
        zIndex: state.nextZIndex,
        createdAt: t,
        updatedAt: t,
      };
      return {
        notes: [...state.notes, note],
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case 'MOVE_NOTE': {
      const t = now();
      return {
        ...state,
        notes: withUpdatedNote(state.notes, action.payload.id, (n) => ({
          ...n,
          position: action.payload.position,
          updatedAt: t,
        })),
      };
    }

    case 'UPDATE_NOTE_CONTENT': {
      const t = now();
      return {
        ...state,
        notes: withUpdatedNote(state.notes, action.payload.id, (n) => ({
          ...n,
          content: action.payload.content,
          updatedAt: t,
        })),
      };
    }

    case 'RESIZE_NOTE': {
      const t = now();
      const width = clamp(action.payload.size.width, NOTE_MIN_SIZE.width, Number.MAX_SAFE_INTEGER);
      const height = clamp(
        action.payload.size.height,
        NOTE_MIN_SIZE.height,
        Number.MAX_SAFE_INTEGER,
      );

      return {
        ...state,
        notes: withUpdatedNote(state.notes, action.payload.id, (n) => ({
          ...n,
          size: { width, height },
          updatedAt: t,
        })),
      };
    }

    case 'REMOVE_NOTE': {
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload.id),
      };
    }

    case 'BRING_TO_FRONT': {
      const t = now();
      const newZ = state.nextZIndex;
      return {
        notes: withUpdatedNote(state.notes, action.payload.id, (n) => ({
          ...n,
          zIndex: newZ,
          updatedAt: t,
        })),
        nextZIndex: newZ + 1,
      };
    }

    case 'UPDATE_TEXT': {
      const t = now();
      return {
        ...state,
        notes: withUpdatedNote(state.notes, action.payload.id, (n) => ({
          ...n,
          content: action.payload.content,
          updatedAt: t,
        })),
      };
    }

    case 'UPDATE_COLOR': {
      const t = now();
      return {
        ...state,
        notes: withUpdatedNote(state.notes, action.payload.id, (n) => ({
          ...n,
          color: action.payload.color,
          updatedAt: t,
        })),
      };
    }

    default:
      return state;
  }
}
