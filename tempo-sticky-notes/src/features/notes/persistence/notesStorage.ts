import type { NotesState } from '../model/note.types';

const STORAGE_KEY = 'tempo-sticky-notes:v1';

export function loadNotesState(): NotesState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as NotesState;

    // basic guard
    if (!parsed || !Array.isArray(parsed.notes) || typeof parsed.nextZIndex !== 'number') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveNotesState(state: NotesState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota/private mode errors
  }
}