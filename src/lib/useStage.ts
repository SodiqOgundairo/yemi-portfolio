import { useEffect, useRef, useState } from "react";

export type Stage = {
  /** Live 0..1 through the stage. A REF, not state: see below. */
  progress: React.RefObject<number>;
  /** Stage is on screen. Gates the WebGL frameloop. */
  active: boolean;
  /** Past the stage, so the header now sits on text rather than on a scene. */
  grounded: boolean;
};

/** Scroll progress through one element, plus two coarse flags.
 *
 *  Progress is handed back as a REF rather than state on purpose. As state it
 *  re-rendered the whole landing page on essentially every frame, and every
 *  consumer of it already runs its own loop (useFrame for the scene, rAF for
 *  the poster), so the render bought nothing. The two flags stay as state
 *  because they flip a handful of times per visit and drive real markup.
 *
 *  Scoping to the stage rather than the document matters because the work
 *  index below it is arbitrarily long: document progress would finish the
 *  scene's choreography a third of the way in and then sit at its end state
 *  for thousands of pixels nobody can see it in. */
export function useStage(ref: React.RefObject<HTMLElement | null>): Stage {
  const progress = useRef(0);
  const [active, setActive] = useState(true);
  const [grounded, setGrounded] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      // a margin so the surface is already running by the time it is visible
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);

    let wasGrounded = false;
    const read = () => {
      raf.current = requestAnimationFrame(read);
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      progress.current = p;
      const g = p > 0.9;
      if (g !== wasGrounded) { wasGrounded = g; setGrounded(g); }
    };
    raf.current = requestAnimationFrame(read);

    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, [ref]);

  return { progress, active, grounded };
}
