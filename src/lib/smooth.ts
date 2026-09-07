import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Lenis drives scroll, GSAP's ticker drives Lenis, ScrollTrigger reads it.
 *  One clock. Without this they fight and the scene stutters. */
/** The browser restores scroll position on reload (history.scrollRestoration
 *  defaults to "auto"). On a scroll-choreographed scene that drops you into the
 *  middle of a camera move with no context, so we own the entry point instead. */
function resetScroll(lenis?: Lenis) {
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true });
}

export function initSmoothScroll() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  resetScroll();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // still land at the top, just without the smoothing layer
    requestAnimationFrame(() => resetScroll());
    return () => {};
  }
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // some browsers restore a frame late, so assert the top twice
  resetScroll(lenis);
  requestAnimationFrame(() => resetScroll(lenis));

  return () => { gsap.ticker.remove(tick); lenis.destroy(); };
}

export { gsap, ScrollTrigger };
