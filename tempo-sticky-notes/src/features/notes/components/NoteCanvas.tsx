import { useRef } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Note } from './Note';
import { NOTE_DEFAULT_SIZE } from '../model/note.constants';
import { useDragNote } from '../hooks/useDragNote';

export function NoteCanvas() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const { notes, send } = useNotes();

  const { onPointerDown } = useDragNote({
    canvasRef,
    bringToFront: (id) => send({ type: 'BRING_TO_FRONT', payload: { id } }),
    commitMove: (id, position) => send({ type: 'MOVE_NOTE', payload: { id, position } }),
  });

  const createNote = () => {
    send({
      type: 'CREATE_NOTE',
      payload: {
        position: { x: 100 + notes.length * 20, y: 100 + notes.length * 20 },
        size: NOTE_DEFAULT_SIZE,
        color: 'yellow',
      },
    });
  };

  return (
    <div
      ref={canvasRef}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={createNote}
        style={{ position: 'absolute', top: 16, left: 16, zIndex: 9999 }}
      >
        + Add Note
      </button>

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onPointerDown={onPointerDown}
          onFocus={(id) => send({ type: 'BRING_TO_FRONT', payload: { id } })}
        />
      ))}
    </div>
  );
}