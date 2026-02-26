import { NoteCanvas } from './features/notes/components/NoteCanvas';
import './App.css';

export default function App() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NoteCanvas />
    </div>
  );
}
