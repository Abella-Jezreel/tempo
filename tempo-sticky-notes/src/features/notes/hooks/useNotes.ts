import { useReducer } from 'react';
import { initialNotesState, notesReducer } from '../model/notes.reducer';
import type { NotesAction } from '../model/note.actions';

export function useNotes() {
  const [state, dispatch] = useReducer(notesReducer, initialNotesState);

  return {
    notes: state.notes,
    nextZIndex: state.nextZIndex,
    send: dispatch as React.Dispatch<NotesAction>,
  };
}