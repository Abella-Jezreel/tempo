import type { Note } from '../model/note.types';

interface Props {
  note: Note;
  onClick: (id: string) => void;
}

export function Note({ note, onClick }: Props) {
  return (
    <div
      onMouseDown={() => onClick(note.id)}
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
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {note.content || 'Empty note'}
    </div>
  );
}