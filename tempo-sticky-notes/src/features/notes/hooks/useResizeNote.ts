import { useCallback, useMemo, useRef, useState } from 'react';
import type { Note, Point } from '../model/note.types';
import { clamp } from '../../../shared/utils/clamp';
import { useWindowEvent } from '../../../features/notes/hooks/useWindowEvent';
import { NOTE_MIN_SIZE } from '../model/note.constants';

type ResizeSession = {
  id: string;
  startPointer: Point;
  startSize: { width: number; height: number };
  startPosition: Point;
};

function getCanvasPointerPoint(e: PointerEvent | React.PointerEvent, canvasEl: HTMLDivElement): Point {
  const rect = canvasEl.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function useResizeNote(params: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  commitResize: (id: string, size: { width: number; height: number }) => void;
}) {
  const { canvasRef, commitResize } = params;

  const [session, setSession] = useState<ResizeSession | null>(null);
  const latestSizeRef = useRef<{ width: number; height: number } | null>(null);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent, note: Note) => {
      e.stopPropagation();
      if (e.button !== 0) return;

      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const startPointer = getCanvasPointerPoint(e, canvasEl);

      setSession({
        id: note.id,
        startPointer,
        startSize: note.size,
        startPosition: note.position,
      });

      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [canvasRef],
  );

  const onMove = useCallback(
    (ev: PointerEvent) => {
      if (!session) return;

      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const noteEl = document.querySelector<HTMLElement>(`[data-note-id="${session.id}"]`);
      if (!noteEl) return;

      const pointer = getCanvasPointerPoint(ev, canvasEl);

      const dx = pointer.x - session.startPointer.x;
      const dy = pointer.y - session.startPointer.y;

      // Clamp max size so the note stays inside canvas
      const maxW = canvasEl.clientWidth - session.startPosition.x;
      const maxH = canvasEl.clientHeight - session.startPosition.y;

      const nextW = clamp(session.startSize.width + dx, NOTE_MIN_SIZE.width, Math.max(NOTE_MIN_SIZE.width, maxW));
      const nextH = clamp(session.startSize.height + dy, NOTE_MIN_SIZE.height, Math.max(NOTE_MIN_SIZE.height, maxH));

      const nextSize = { width: Math.round(nextW), height: Math.round(nextH) };
      latestSizeRef.current = nextSize;

      // Live resize (DOM only)
      noteEl.style.width = `${nextSize.width}px`;
      noteEl.style.height = `${nextSize.height}px`;
    },
    [session, canvasRef],
  );

  const onUp = useCallback(() => {
    if (!session) return;

    const finalSize = latestSizeRef.current ?? session.startSize;
    commitResize(session.id, finalSize);

    latestSizeRef.current = null;
    setSession(null);
  }, [session, commitResize]);

  useWindowEvent('pointermove', onMove, !!session);
  useWindowEvent('pointerup', onUp, !!session);
  useWindowEvent('pointercancel', onUp, !!session);

  return useMemo(
    () => ({
      isResizing: !!session,
      onResizePointerDown,
    }),
    [onResizePointerDown, session],
  );
}