import { useRef } from 'react';
import { useNotes } from '../../../features/notes/hooks/useNotes';
import { Note } from './Note';
import { TrashZone } from './TrashZone';
import { NOTE_DEFAULT_SIZE } from '../model/note.constants';
import { useDragNote } from '../../../features/notes/hooks/useDragNote';
import { useResizeNote } from '../hooks/useResizeNote';

export function NoteCanvas() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const trashRef = useRef<HTMLDivElement | null>(null);
  const { notes, send } = useNotes();

  const { onPointerDown, isOverTrash, draggingId } = useDragNote({
    canvasRef,
    trashRef,
    bringToFront: (id) => send({ type: 'BRING_TO_FRONT', payload: { id } }),
    commitMove: (id, position) => send({ type: 'MOVE_NOTE', payload: { id, position } }),
    dropTrash: (id) => send({ type: 'DELETE_NOTE', payload: { id } }),
  });

  const { onResizePointerDown } = useResizeNote({
    canvasRef,
    commitResize: (id, size) => send({ type: 'RESIZE_NOTE', payload: { id, size } }),
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
      }}
    >
      <button
        onClick={createNote}
        style={{
          position: 'absolute',
          top: 16,
          left: '47%',
          zIndex: 999999,
          pointerEvents: 'auto',

          display: 'flex',
          alignItems: 'center',
          gap: 8,

          padding: '12px 18px',
          borderRadius: 14,
          border: 'none',

          background: 'linear-gradient(135deg, #1f1f1f, #2a2a2a)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,

          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          cursor: 'pointer',

          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(1px)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
        Add Note
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: 29,
          left: '47%',
          zIndex: 9999,

          display: 'flex',
          alignItems: 'center',
          gap: 8,

          padding: '8px 14px',
          borderRadius: 999,

          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(6px)',

          fontSize: 14,
          fontWeight: 500,
          color: '#333',

          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}
      >
        <span style={{ opacity: 0.6 }}>Notes</span>
        <span
          style={{
            background: '#1f1f1f',
            color: '#fff',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 999,
            minWidth: 24,
            textAlign: 'center',
          }}
        >
          {notes.length}
        </span>
      </div>
      <TrashZone ref={trashRef} active={!!draggingId && isOverTrash} />
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          isDragging={draggingId === note.id}
          onPointerDown={onPointerDown}
          onFocus={(id) => send({ type: 'BRING_TO_FRONT', payload: { id } })}
          onChangeContent={(id, content) =>
            send({ type: 'UPDATE_NOTE_CONTENT', payload: { id, content } })
          }
          onResizePointerDown={onResizePointerDown}
        />
      ))}
    </div>
  );
}
