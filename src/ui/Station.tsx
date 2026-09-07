import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../lib/smooth";

/** Content sticks for the length of the station while the camera travels, then
 *  cross-fades out. You never watch a block of text slide past: each section
 *  holds, resolves, and hands over. That is the "stop right there" beat. */
export default function Station({
  id, index, label, children, align = "left", length = 190,
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
      // hold, then hand over: fade only in the last third of the station
      gsap.to(i, {
        opacity: 0, filter: "blur(6px)", ease: "none",
        scrollTrigger: { trigger: o, start: "bottom 92%", end: "bottom 40%", scrub: true },
      });
    }, o);
    return () => ctx.revert();
  }, []);

  const place =
    align === "right" ? "items-end text-right" : align === "center" ? "items-center text-center" : "items-start";

  return (
    <section ref={outer} id={id} className="relative" style={{ height: `${length}svh` }}>
      <div ref={inner} className="sticky top-0 flex h-[100svh] items-center px-6 sm:px-10">
        <div className={`relative mx-auto flex w-full max-w-6xl flex-col gap-6 ${place}`}>
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
