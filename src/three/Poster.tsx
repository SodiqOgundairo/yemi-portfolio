import { useEffect, useRef } from "react";

/* The scene without the scene.
 *
 * Three captured frames of the real shader at its three beats (drop, spreading,
 * pool) cross-faded on scroll, with a slow drift and a shifting crop so it is
 * never a dead still. It reproduces the actual choreography, because it IS the
 * actual choreography, photographed.
 *
 * No React state and no props that change: everything is written straight to
 * the DOM from one rAF loop, so a weak device pays for three composited layers
 * and nothing else. */

const FRAMES = [
  { src: "/scene/drop.webp", at: 0.00 },
  { src: "/scene/mid.webp",  at: 0.50 },
  { src: "/scene/pool.webp", at: 1.00 },
];

/** Triangular falloff: full opacity at its own beat, gone by its neighbour's. */
function weight(p: number, at: number, span: number) {
  return Math.max(0, 1 - Math.abs(p - at) / span);
}

export default function Poster({
  progress, still = false, onReady,
}: {
  progress: React.RefObject<number>;
  /** Under reduced motion: one frame, no crossfade, no drift. */
  still?: boolean;
  onReady?: () => void;
}) {
  const layers = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    // ready when the pixels are actually decoded, not when the tags exist
    const imgs = layers.current.filter(Boolean) as HTMLImageElement[];
    let alive = true;
    Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())))
      .then(() => { if (alive) onReady?.(); });
    return () => { alive = false; };
  }, [onReady]);

  useEffect(() => {
    if (still) {
      const first = layers.current[0];
      if (first) first.style.opacity = "1";
      return;
    }
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = progress.current ?? 0;
      FRAMES.forEach((f, i) => {
        const el = layers.current[i];
        if (!el) return;
        el.style.opacity = String(weight(p, f.at, 0.55));
      });
      // the whole plate drifts and the crop slides, so the image reads as a
      // camera move rather than a wallpaper
      const host = layers.current[0]?.parentElement;
      if (host) host.style.transform = `translate3d(0, ${(-p * 4).toFixed(2)}%, 0)`;
      FRAMES.forEach((_, i) => {
        const el = layers.current[i];
        if (el) el.style.objectPosition = `${(62 + p * 12).toFixed(1)}% 50%`;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progress, still]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-void" data-scene="poster">
      <div className="absolute inset-0 scale-110 will-change-transform">
        {FRAMES.map((f, i) => (
          <img
            key={f.src}
            ref={(el) => { layers.current[i] = el; }}
            src={f.src}
            alt=""
            aria-hidden
            /* the first frame is the one behind the hero, so it is the only
               one worth fetching eagerly */
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: i === 0 ? 1 : 0, objectPosition: "62% 50%" }}
          />
        ))}
      </div>
      {/* A dither, not a texture. WebP on a smooth dark gradient bands at a
          gradients, which these plates are almost entirely made of. Encoded
          at q82 with a light dither on top for margin. Kept at 0.10: at 0.45
          it read as film grain and destroyed the chrome, which was worse than
          anything it was hiding. Mid grey is a no-op under `overlay`, so it
          perturbs without shifting the image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] [background-repeat:repeat] [background-size:64px_64px] [mix-blend-mode:overlay]"
        style={{ backgroundImage: "url(/scene/grain.png)" }}
      />
    </div>
  );
}
