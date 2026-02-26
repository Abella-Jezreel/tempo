import { useNotes } from '../hooks/useNotes';
import { Note } from './Note';
import { NOTE_DEFAULT_SIZE } from '../model/note.constants';

export function NoteCanvas() {
  const { notes, send } = useNotes();

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
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={createNote}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 9999,
        }}
      >
        + Add Note
      </button>

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onClick={(id) =>
            send({
              type: 'BRING_TO_FRONT',
              payload: { id },
            })
          }
        />
      ))}
    </div>
  );
}