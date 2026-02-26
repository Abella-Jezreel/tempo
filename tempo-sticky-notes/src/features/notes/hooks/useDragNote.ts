import { useCallback, useMemo, useRef, useState } from 'react';
import type { DragSession } from '../model/interaction.types';
import type { Note, Point } from '../model/note.types';
import { clamp } from '../../../shared/utils/clamp';
import { useWindowEvent } from '../../../features/notes/hooks/useWindowEvent';

function getPointerPoint(e: PointerEvent | React.PointerEvent): Point {
  return { x: e.clientX, y: e.clientY };
}

function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

type CommitMove = (id: string, position: Point) => void;
type BringToFront = (id: string) => void;

export function useDragNote(params: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  commitMove: CommitMove;
  bringToFront: BringToFront;
}) {
  const { canvasRef, commitMove, bringToFront } = params;

  const [session, setSession] = useState<DragSession | null>(null);
  const latestPosRef = useRef<Point | null>(null);
  const draggingIdRef = useRef<string | null>(null);

  const canvasBounds = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return null;
    return el.getBoundingClientRect();
  }, [canvasRef]);

  const clampToCanvas = useCallback(
    (note: Note, pos: Point): Point => {
      const bounds = canvasBounds();
      if (!bounds) return pos;

      // Convert viewport coordinates to canvas-local coordinates for clamping
      // Note position is canvas-local (left/top)
      const maxX = bounds.width - note.size.width;
      const maxY = bounds.height - note.size.height;

      return {
        x: clamp(pos.x, 0, Math.max(0, maxX)),
        y: clamp(pos.y, 0, Math.max(0, maxY)),
      };
    },
    [canvasBounds],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, note: Note) => {
      // Only left button drag
      if (e.button !== 0) return;

      bringToFront(note.id);

      const startPointer = getPointerPoint(e);
      setSession({
        id: note.id,
        startPointer,
        startPosition: note.position,
      });

      draggingIdRef.current = note.id;

      // capture ensures we keep receiving events from this pointer while pressed
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [bringToFront],
  );

  const onMove = useCallback(
    (ev: PointerEvent) => {
      if (!session) return;

      const noteEl = document.querySelector<HTMLElement>(`[data-note-id="${session.id}"]`);
      if (!noteEl) return;

      const pointer = getPointerPoint(ev);
      const delta = sub(pointer, session.startPointer);
      const rawPos = add(session.startPosition, delta);

      // We need the note data to clamp; easiest: store width/height on dataset
      const w = Number(noteEl.dataset.w || 0);
      const h = Number(noteEl.dataset.h || 0);
      const noteLike: Note = {
        id: session.id,
        position: session.startPosition,
        size: { width: w, height: h },
        content: '',
        color: 'yellow',
        zIndex: 1,
        createdAt: 0,
        updatedAt: 0,
      };

      const nextPos = clampToCanvas(noteLike, rawPos);
      latestPosRef.current = nextPos;

      // Visual move only (no React state spam)
      noteEl.style.transform = `translate3d(${nextPos.x - session.startPosition.x}px, ${
        nextPos.y - session.startPosition.y
      }px, 0)`;
    },
    [session, clampToCanvas],
  );

  const onUp = useCallback(() => {
    if (!session) return;

    const finalPos = latestPosRef.current ?? session.startPosition;

    // Clean visual transform
    const noteEl = document.querySelector<HTMLElement>(`[data-note-id="${session.id}"]`);
    if (noteEl) noteEl.style.transform = 'translate3d(0,0,0)';

    commitMove(session.id, finalPos);

    latestPosRef.current = null;
    draggingIdRef.current = null;
    setSession(null);
  }, [session, commitMove]);

  useWindowEvent('pointermove', onMove, !!session);
  useWindowEvent('pointerup', onUp, !!session);
  useWindowEvent('pointercancel', onUp, !!session);

  return useMemo(
    () => ({
      draggingId: draggingIdRef.current,
      onPointerDown,
    }),
    [onPointerDown],
  );
}