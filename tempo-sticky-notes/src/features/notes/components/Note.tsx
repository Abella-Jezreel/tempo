import type { Note as NoteType } from '../model/note.types';

interface Props {
  note: NoteType;
  onPointerDown: (e: React.PointerEvent, note: NoteType) => void;
  onFocus: (id: string) => void;
}

export function Note({ note, onPointerDown, onFocus }: Props) {
  return (
    <div
      data-note-id={note.id}
      data-w={note.size.width}
      data-h={note.size.height}
      onMouseDown={() => onFocus(note.id)}
      onPointerDown={(e) => onPointerDown(e, note)}
      style={{
        position: 'absolute',
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
        padding: 12,
        borderRadius: 6,
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none', // important for pointer events
        willChange: 'transform',
      }}
    >
      {note.content || 'Empty note'}
    </div>
  );
}