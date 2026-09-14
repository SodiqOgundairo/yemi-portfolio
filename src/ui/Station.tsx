import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "../lib/smooth";

/** Content sticks for the length of the station while the camera travels, then
 *  cross-fades out. You never watch a block of text slide past: each section
 *  holds, resolves, and hands over. That is the "stop right there" beat. */
export default function Station({
  id, index, label, children, align = "left", length = 130,
}: {
  id: string; index: string; label: string; children: ReactNode;
  align?: "left" | "right" | "center"; length?: number;
}) {
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    const ctx = gsap.context(() => {
      // arrive
      gsap.from(i.querySelectorAll<HTMLElement>("[data-reveal]"), {
        yPercent: 30, opacity: 0, duration: 1.05, ease: "expo.out", stagger: 0.07,
        scrollTrigger: { trigger: o, start: "top 70%", once: true },
      });
      /* Hold, then hand over. The fade starts slightly INTO the hold rather
         than waiting for the section bottom to appear: tied to the bottom it
         began only once the sticky released, so the first two swipes moved
         nothing at all and the page read as stuck. */
      gsap.to(i, {
        opacity: 0, filter: "blur(6px)", ease: "none",
        scrollTrigger: { trigger: o, start: "top -8%", end: "bottom 45%", scrub: true },
      });
    }, o);
    return () => ctx.revert();
  }, []);

  const place =
    align === "right" ? "items-end text-right" : align === "center" ? "items-center text-center" : "items-start";

  return (
    /* A phone viewport is much taller than it is wide, so the same station
       length that reads as a held beat on a laptop becomes a long stretch of
       empty scene on a phone. Four fifths of the height there.

       Do NOT drop `length` below ~125: the inner is 100svh, and once the
       section is shorter than its own sticky child the hold stops working
       and the text jumps instead of releasing. 130 x 0.8 = 104svh on a
       phone, which is the floor. */
    <section
      ref={outer}
      id={id}
      className="pointer-events-none relative h-[calc(var(--sh)*0.8)] sm:h-[var(--sh)]"
      style={{ "--sh": `${length}svh` } as CSSProperties}
    >
      {/* pointer-events-none so clicks reach the 3D cards behind; links inside
          re-enable it individually */}
      <div ref={inner} className="pointer-events-none sticky top-0 flex h-[100svh] items-center px-6 sm:px-10">
        <div className={`pointer-events-none relative mx-auto flex w-full max-w-6xl flex-col gap-6 ${place}`}>
          <div data-reveal className="flex items-center gap-4">
            <span className="hud text-bone">{index}</span>
            <span className="hairline w-16" />
            <span className="hud">{label}</span>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
