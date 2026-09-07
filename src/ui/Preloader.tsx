import { useEffect, useRef, useState } from "react";

/** Counts to 100 and leaves once the renderer signals ready.
 *  Deliberately NOT drei's useProgress: this scene loads no assets through
 *  THREE's LoadingManager, so that hook reports 0 forever and never resolves. */
export default function Preloader({ ready }: { ready: boolean }) {
  const [n, setN] = useState(0);
  const [gone, setGone] = useState(false);
  const start = useRef(performance.now());

  useEffect(() => {
    let id = 0;
    const MIN = 900; // floor so the count is legible rather than a flash
    const tick = () => {
      const elapsed = performance.now() - start.current;
      const floor = Math.min(elapsed / MIN, 1) * 92;      // creeps to 92 on time alone
      const target = ready ? 100 : floor;
      setN((v) => (v < target ? Math.min(v + Math.max(0.6, (target - v) * 0.12), target) : v));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [ready]);

  useEffect(() => {
    if (n >= 99.5) {
      const t = setTimeout(() => setGone(true), 620);
      return () => clearTimeout(t);
    }
  }, [n]);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-void transition-opacity duration-500"
      style={{ opacity: n >= 99.5 ? 0 : 1 }}
    >
      <div className="w-56">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="hud">Loading</span>
          <span className="font-mono text-sm text-bone">{Math.round(n).toString().padStart(3, "0")}</span>
        </div>
        <div className="h-px w-full bg-edge">
          <div className="h-px bg-bone" style={{ width: `${n}%` }} />
        </div>
      </div>
    </div>
  );
}
