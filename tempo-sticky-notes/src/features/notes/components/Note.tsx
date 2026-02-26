import { useEffect, useRef, useState } from 'react';
import type { Note as NoteType } from '../model/note.types';
import { NOTE_COLOR_MAP } from '../model/note.colors';

interface Props {
  note: NoteType;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent, note: NoteType) => void;
  onFocus: (id: string) => void;
  onChangeContent: (id: string, content: string) => void;
  onResizePointerDown: (e: React.PointerEvent, note: NoteType) => void;
}

export function Note({
  note,
  isDragging,
  onPointerDown,
  onFocus,
  onChangeContent,
  onResizePointerDown,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(note.content ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // keep draft in sync when note changes externally
  useEffect(() => {
    if (!isEditing) setDraft(note.content ?? '');
  }, [note.content, isEditing]);

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  const commit = () => {
    const next = draft.trimEnd(); // keep user newlines, just avoid trailing spaces
    onChangeContent(note.id, next);
    setIsEditing(false);
  };

  return (
    <div
      className={`note ${isDragging ? 'dragging' : ''}`}
      data-note-id={note.id}
      style={{
        position: 'absolute',
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        zIndex: note.zIndex,
        backgroundColor: NOTE_COLOR_MAP?.[note.color] ?? note.color,
        padding: 12,
        borderRadius: 10,
        boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        color: '#1f1f1f',
      }}
      onMouseDown={() => onFocus(note.id)}
      onPointerDown={(e) => {
        if (isEditing) return; // don't drag while editing
        onPointerDown(e, note);
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            // Save with Ctrl/Cmd + Enter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') commit();
            // Escape cancels edit
            if (e.key === 'Escape') {
              setDraft(note.content ?? '');
              setIsEditing(false);
            }
            // prevent dragging/scroll issues
            e.stopPropagation();
          }}
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            lineHeight: 1.4,
            fontFamily: 'inherit',
            color: '#1f1f1f',
          }}
        />
      ) : (
        <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.4 }}>
          {note.content?.trim() ? note.content : 'Double-click to edit'}
        </div>
      )}
      <div
        onPointerDown={(e) => onResizePointerDown(e, note)}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 24,
          height: 24,
          cursor: 'nwse-resize',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: 4,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path
            d="M8 16L16 8M12 16L16 12M16 16L16 16"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
