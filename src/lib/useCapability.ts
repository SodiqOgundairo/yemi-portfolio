import { useState } from "react";

export type SceneMode = "webgl" | "poster";

/* The raymarcher costs per pixel and a phone GPU cannot pay it. The fallback
   is not a degraded shader, it is captured frames of the real thing: 58KB for
   three states against 244KB gzip of three.js plus a continuous GPU load.

   Decided ONCE, synchronously, before first render. Synchronously because the
   scene module is behind React.lazy, so a poster device must never even fetch
   that chunk. Once because switching mid-session would tear down a live WebGL
   context on a resize, and because a device does not stop being a phone. */
function detect(): SceneMode {
  if (typeof window === "undefined") return "poster";

  const q = new URLSearchParams(window.location.search).get("scene");
  if (q === "poster" || q === "webgl") return q; // manual override for testing

  const mm = (s: string) => window.matchMedia(s).matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (mm("(prefers-reduced-motion: reduce)")) return "poster";
  if (nav.connection?.saveData === true) return "poster";
  if ((nav.hardwareConcurrency ?? 8) <= 4) return "poster";
  if ((nav.deviceMemory ?? 8) <= 4) return "poster";
  // a touch primary pointer on a small viewport is the phone signal. Neither
  // alone is enough: a touchscreen laptop is fine, a narrow desktop window is
  // still a desktop.
  if (mm("(pointer: coarse)") && window.innerWidth < 900) return "poster";

  return "webgl";
}

export function useSceneMode(): SceneMode {
  const [mode] = useState(detect);
  return mode;
}

export const prefersStill = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
