import { useEffect, useRef, useState } from "react";

type Mode = "idle" | "hot" | "drag";

/** A reticle that reports state, the way a game cursor does.
 *  Drawn on a raf loop rather than React state so it never lags the pointer. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [fine, setFine] = useState(false);
  const p = useRef({ x: -100, y: -100, rx: -100, ry: -100 });

  useEffect(() => setFine(window.matchMedia("(pointer: fine)").matches), []);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      p.current.x = e.clientX; p.current.y = e.clientY;
      const el = (e.target as HTMLElement).closest("a,button,[data-hot]");
      setMode(el ? "hot" : "idle");
    };
    let id = 0;
    const loop = () => {
      p.current.rx += (p.current.x - p.current.rx) * 0.16;
      p.current.ry += (p.current.y - p.current.ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${p.current.x}px,${p.current.y}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${p.current.rx}px,${p.current.ry}px,0) translate(-50%,-50%)`;
      id = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    id = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(id); };
  }, [fine]);

  if (!fine) return null;
  const hot = mode === "hot";

  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] h-1 w-1 rounded-full bg-bone" />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] transition-[width,height,opacity] duration-300 ease-out"
        style={{ width: hot ? 56 : 30, height: hot ? 56 : 30, opacity: hot ? 1 : 0.45 }}
      >
        {/* corner brackets, not a circle: reads as targeting, not decoration */}
        <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-bone" />
        <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-bone" />
        <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-bone" />
        <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-bone" />
      </div>
    </>
  );
}
