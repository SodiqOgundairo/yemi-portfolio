import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../lib/smooth";

/** Arrival for plain DOM sections. Same duration and easing as everything
 *  else, driven from the tokens rather than a number invented per section. */
export default function Reveal({
  children, className = "", stagger = 0.07,
}: { children: ReactNode; className?: string; stagger?: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      const kids = node.querySelectorAll<HTMLElement>("[data-reveal]");
      gsap.from(kids.length ? kids : [node], {
        y: 26, opacity: 0, duration: 0.9, ease: "expo.out", stagger,
        scrollTrigger: { trigger: node, start: "top 90%", once: true },
      });
    }, node);
    return () => ctx.revert();
  }, [stagger]);
  return <div ref={el} className={className}>{children}</div>;
}
