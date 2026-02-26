import { useReducer } from 'react';
import { notesReducer, initialNotesState } from '../model/notes.reducer';
import type { NotesAction } from '../model/note.actions';

export function useNotes() {
  const [state, dispatch] = useReducer(notesReducer, initialNotesState);

  const send = (action: NotesAction) => {
    dispatch(action);
  };

  return {
    notes: state.notes,
    nextZIndex: state.nextZIndex,
    send,
  };
}