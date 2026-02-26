import { useEffect, useReducer } from 'react';
import {
  notesReducer,
  initialNotesState,
} from '../model/notes.reducer';
import { NotesState } from '../model/note.types';
import { loadNotesState, saveNotesState } from '../persistence/notesStorage';

function init(): NotesState {
  return loadNotesState() ?? initialNotesState;
}

export function useNotes() {
  const [state, send] = useReducer(notesReducer, undefined as unknown as NotesState, init);

  useEffect(() => {
    saveNotesState(state);
  }, [state]);

  return {
    notes: state.notes,
    nextZIndex: state.nextZIndex,
    send,
  };
}