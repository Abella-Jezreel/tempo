import type { Note as NoteType } from '../model/note.types';
import './Note.module.css';
import { NOTE_COLOR_MAP } from '../model/note.colors';

interface Props {
  note: NoteType;
  onPointerDown: (e: React.PointerEvent, note: NoteType) => void;
  onFocus: (id: string) => void;
  isDragging: boolean;
}

export function Note({ note, onPointerDown, onFocus, isDragging }: Props) {
  return (
    <div
      className={`note ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        zIndex: note.zIndex,
        backgroundColor: NOTE_COLOR_MAP[note.color],
        color: '#1f1f1f',
        padding: '10px',
        borderRadius: '6px'
      }}
      data-note-id={note.id}
      data-w={note.size.width}
      data-h={note.size.height}
      onMouseDown={() => onFocus(note.id)}
      onPointerDown={(e) => onPointerDown(e, note)}
    >
      {note.content || 'Empty note'}
    </div>
  );
}
