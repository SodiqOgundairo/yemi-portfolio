import { useEffect, useState } from "react";

/* The loader is where the page's identity is established, so it is built from
   the same two elements the header uses and it hands over to them IN PLACE:
   the brand mark sits at exactly the header's coordinates, so when the panel
   drops away nothing jumps, the surroundings simply arrive around it.

   Progress is tied to real signals rather than a timer. Two things have to
   land before the page is worth showing: the work has to be fetched, and the
   scene has to have DRAWN A FRAME (not merely mounted, which is what it used
   to report, and why the surface arrived as a pop after the loader had already
   gone). A small time floor stops it flashing on a warm cache. */
export default function Preloader({
  ready, dataReady,
}: { ready: boolean; dataReady: boolean }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [expired, setExpired] = useState(false);

  /* Failsafe. `ready` now means the scene has DRAWN, which is reported from
     inside the render loop, and that loop does not run while the scene is off
     screen. Any path that mounts with the stage out of view would leave this
     panel up forever, covering a page that is otherwise fine. A loader is
     never allowed to be the thing that breaks the site. */
  useEffect(() => {
    const t = setTimeout(() => setExpired(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      /* Stage ceilings, so the number never claims a stage that has not
         happened. It EASES toward the current ceiling with a small guaranteed
         minimum step rather than parking on it: a counter frozen at 034 while
         a fetch is in flight is the thing that reads as broken, and easing
         also decelerates into each stage, which looks deliberate. */
      const target = ready || expired ? 100 : dataReady ? 77 : 33;
      // slow while waiting so the number keeps inching for several seconds
      const k = ready || expired ? 0.11 : 0.02;
      setN((v) => (v >= target ? v : Math.min(target, v + Math.max((target - v) * k, 0.05))));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [ready, dataReady, expired]);

  useEffect(() => {
    if (n < 99.5) return;
    const a = setTimeout(() => setLeaving(true), 180);
    const b = setTimeout(() => setGone(true), 1150);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [n]);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-void transition-opacity duration-[620ms] ease-[var(--ease-glide)]"
      style={{ opacity: leaving ? 0 : 1 }}
      aria-hidden={leaving}
      role="status"
      aria-live="polite"
    >
      {/* same coordinates as the real header, so the handover has no jump */}
      <span className="hud absolute left-gutter top-5 text-bone">Ogundairo</span>

      <div
        className="absolute bottom-0 left-0 right-0 px-gutter pb-8 transition-[opacity,transform] duration-[520ms] ease-[var(--ease-glide)]"
        style={{
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateY(12px)" : "none",
        }}
      >
        <div className="flex items-end justify-between">
          <span className="hud pb-1">
            {!dataReady ? "Starting" : !ready ? "Fetching the work" : "Building the surface"}
          </span>
          <span className="font-mono text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-tight text-bone">
            {Math.round(n).toString().padStart(3, "0")}
          </span>
        </div>
      </div>

      {/* one hairline across the whole viewport: architectural rather than a
          widget, and it reads at any width */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-edge">
        <div
          className="h-px bg-bone transition-[width] duration-200 ease-linear"
          style={{ width: `${n}%` }}
        />
      </div>
    </div>
  );
}
