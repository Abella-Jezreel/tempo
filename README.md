Architecture

This project is a small “sticky notes board” built with React + TypeScript and organized using a feature-first structure. The goal is to keep UI concerns separated from interaction logic (drag/resize/edit) and from state management (note domain + reducer), so the code stays easy to extend and reason about as features grow.

Folder structure (feature-first)

src/features/notes/ – everything related to the Notes domain

components/ – presentational UI (NoteCanvas, Note, TrashZone)

hooks/ – interaction and orchestration logic (useNotes, useDragNote, useResizeNote, useWindowEvent)

model/ – domain types and reducer (note.types, actions, constants, reducer, colors)

persistence/ – localStorage persistence (notesStorage.ts)

src/shared/ – small reusable utilities/tests (e.g. clamp)

State management

Notes are managed with a reducer (notes.reducer.ts) to keep updates predictable and testable. The reducer owns the single source of truth for:

notes[] (position, size, content, color, zIndex, timestamps)

nextZIndex (used for “bring to front” behavior)

UI components dispatch domain actions (e.g. CREATE_NOTE, MOVE_NOTE, RESIZE_NOTE, DELETE_NOTE) rather than mutating state directly.

Interaction architecture (drag / resize)

Drag and resize are implemented with pointer events and isolated into hooks:

useDragNote handles pointer capture, live movement during drag, clamping to canvas bounds, and committing the final position on pointer up.

useResizeNote handles resize sessions, live DOM resize for responsiveness, and commits final size on pointer up.

During interactions, DOM updates are used for smooth visuals, and the reducer is only updated on “commit” (pointer up), preventing excessive React re-renders.

Persistence

Board state is persisted to localStorage using a versioned key (e.g. tempo-sticky-notes:v1).

On startup: state is hydrated via a lazy reducer initializer (loadNotesState() ?? initialNotesState)

On state change: state is saved in an effect (saveNotesState(state))

Persistence logic is kept in features/notes/persistence/ to keep storage concerns out of UI and reducer code.

Testing

Small pure utilities are unit tested with Vitest (e.g. clamp, math helpers). The reducer and/or domain logic can be tested similarly as the project grows.

🚀 Getting Started
Clone the repository
1. git clone https://github.com/Abella-Jezreel/tempo.git
2. cd tempo-sticky-notes
3. Install dependencies

Make sure you have Node.js (v18 or higher) installed.

1. npm install
Run the development server
1. npm run dev

The app will be available at:

http://localhost:5173
Build for production
1. npm run build
Preview production build
1. npm run preview
🛠 Tech Stack

1. React
2. TypeScript
3. Vite
4. LocalStorage persistence

Custom drag & resize hooks (Pointer Events API)

💾 Data Persistence

All notes are persisted in:

localStorage → tempo-sticky-notes:v1

Refreshing the page restores the board state automatically.
