import { useCallback, useMemo, useRef, useState } from 'react';
import type { DragSession } from '../../../features/notes/model/interaction.types';
import type { Note, Point } from '../../../features/notes/model/note.types';
import { clamp } from '../../../shared/utils/clamp';
import { useWindowEvent } from './useWindowEvent';

function getCanvasPointerPoint(
  e: PointerEvent | React.PointerEvent,
  canvasEl: HTMLDivElement,
): Point {
  const rect = canvasEl.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

  const onPointerDown = useCallback(
    (e: React.PointerEvent, note: Note) => {
      if (e.button !== 0) return;

      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      bringToFront(note.id);

      const startPointer = getCanvasPointerPoint(e, canvasEl);

      // Read actual DOM left/top as the drag start (in case state lags behind)
      const noteEl = e.currentTarget as HTMLElement;
      const startLeft =
        Number.parseFloat(noteEl.style.left || '') || note.position.x;
      const startTop =
        Number.parseFloat(noteEl.style.top || '') || note.position.y;

      const startPosition = { x: startLeft, y: startTop };

      // Ensure no leftover transform from older code
      noteEl.style.transform = 'translate3d(0,0,0)';

      setSession({
        id: note.id,
        startPointer,
        startPosition,
      });

      draggingIdRef.current = note.id;

      noteEl.setPointerCapture?.(e.pointerId);
    },
    [bringToFront, canvasRef],
  );

  const onMove = useCallback(
    (ev: PointerEvent) => {
      if (!session) return;

      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const noteEl = document.querySelector<HTMLElement>(`[data-note-id="${session.id}"]`);
      if (!noteEl) return;

      const pointer = getCanvasPointerPoint(ev, canvasEl);
      const delta = sub(pointer, session.startPointer);
      const rawPos = add(session.startPosition, delta);

      // Use real element size (more reliable than dataset)
      const w = noteEl.offsetWidth;
      const h = noteEl.offsetHeight;

      const maxX = canvasEl.clientWidth - w;
      const maxY = canvasEl.clientHeight - h;

      const nextPos: Point = {
        x: clamp(rawPos.x, 0, Math.max(0, maxX)),
        y: clamp(rawPos.y, 0, Math.max(0, maxY)),
      };

      latestPosRef.current = nextPos;

      // Move with left/top directly (stable)
      noteEl.style.left = `${nextPos.x}px`;
      noteEl.style.top = `${nextPos.y}px`;
    },
    [session, canvasRef],
  );

  const onUp = useCallback(() => {
    if (!session) return;

    const finalPos = latestPosRef.current ?? session.startPosition;

    // Persist to React state so it stays after re-render
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
      isDragging: !!session,
    }),
    [onPointerDown, session],
  );
}