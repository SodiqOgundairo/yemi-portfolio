import { useCallback, useEffect, useRef } from "react";
import type { Win } from "./useWindows";

/* Window dragging, shared by all three shells.
 *
 * The move writes `transform` straight to the node and only commits the final
 * position to React on pointerup. Routing every pointermove through state
 * re-renders the whole desktop, and every other window with it, sixty times a
 * second. Each shell supplies its own chrome; none of them re-implement this. */
export function useDrag(win: Win, onFocus: () => void, onMoved: (x: number, y: number) => void) {
  const el = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number; x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    if (!el.current) return;
    onFocus();
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y, x: win.x, y: win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [onFocus, win.x, win.y]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current, node = el.current;
    if (!d || !node) return;
    // always leave enough on screen to grab it back
    const x = Math.max(-win.w + 140, Math.min(window.innerWidth - 140, e.clientX - d.dx));
    const y = Math.max(30, Math.min(window.innerHeight - 60, e.clientY - d.dy));
    d.x = x; d.y = y;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, [win.w]);

  const end = useCallback(() => {
    const d = drag.current;
    drag.current = null;
    if (d) onMoved(d.x, d.y);
  }, [onMoved]);

  useEffect(() => {
    const node = el.current;
    if (node && !drag.current) node.style.transform = `translate3d(${win.x}px, ${win.y}px, 0)`;
  }, [win.x, win.y]);

  return { el, bar: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end } };
}
